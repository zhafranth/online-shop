# Adapter Pattern — Dummy vs Real

Pola desain agar **komponen UI tidak tahu** apakah datanya dari hardcode atau dari RajaOngkir asli. Migrasi nanti = ganti env var, **bukan rewrite komponen**.

## Konsep

```
┌────────────────┐     ┌────────────────────┐     ┌─────────────────────┐
│  Komponen UI   │ ──▶ │  ShippingService   │ ──▶ │ DummyShipping       │
│  (Checkout,    │     │  (interface)       │     │ Service (default)   │
│   Tracking,    │     │                    │     ├─────────────────────┤
│   dst.)        │     │                    │ ──▶ │ RajaOngkirShipping  │
│                │     │                    │     │ Service (nanti)     │
└────────────────┘     └────────────────────┘     └─────────────────────┘
```

Interface satu, implementasi dua. Pilihan implementasi ditentukan oleh env var **saat startup**.

---

## Struktur Folder

```
src/services/raja-ongkir/
├── index.ts                       # factory: pilih dummy vs real
├── types.ts                       # interface ShippingService, PaymentService
├── dummy/
│   ├── shipping.dummy.ts
│   └── payment.dummy.ts
└── real/
    ├── shipping.real.ts           # belum diimplementasi sekarang
    └── payment.real.ts            # belum diimplementasi sekarang
```

---

## Interface (Kontrak)

`src/services/raja-ongkir/types.ts`

```ts
import type {
  ApiResponse, Province, City, District, ShippingOption,
  QrisPayment, PaymentStatus, TrackingManifest, OrderShippingStatus,
} from "@/types/raja-ongkir";

// ──────────────────────────────────────────
// ShippingService
// ──────────────────────────────────────────
export interface ShippingService {
  getProvinces(): Promise<ApiResponse<Province[]>>;
  getCities(provinceId: number): Promise<ApiResponse<City[]>>;
  getDistricts(cityId: number): Promise<ApiResponse<District[]>>;

  calculateCost(input: {
    originDistrictId: number;
    destinationDistrictId: number;
    weight: number;        // gram
    couriers: string[];    // mis. ["jne","jnt"]
  }): Promise<ApiResponse<ShippingOption[]>>;

  getTrackingManifest(input: {
    orderId: string;
    paidAt: string;
  }): Promise<ApiResponse<{
    status: OrderShippingStatus;
    manifest: TrackingManifest[];
  }>>;
}

// ──────────────────────────────────────────
// PaymentService
// ──────────────────────────────────────────
export interface PaymentService {
  getMethods(): Promise<ApiResponse<{
    qris: Array<{ code: string; name: string; fee_percent: number; enabled: boolean }>;
    virtual_account: Array<{ code: string; name: string; fee: number; enabled: boolean }>;
  }>>;

  createQris(input: {
    amount: number;
    referenceId: string;
    customerName: string;
    customerEmail?: string;
    customerPhone?: string;
  }): Promise<ApiResponse<QrisPayment>>;

  getStatus(paymentId: string): Promise<ApiResponse<{
    payment_id: string;
    reference_id: string;
    status: PaymentStatus;
    paid_at?: string;
  }>>;

  cancel(paymentId: string): Promise<ApiResponse<{ payment_id: string; status: PaymentStatus }>>;

  // === DUMMY-ONLY (tidak ada di real, gunakan webhook) ===
  /**
   * Hanya tersedia di DummyPaymentService. Real service abaikan / throw.
   * Dipakai oleh tombol "Simulasi Pembayaran" di dev mode.
   */
  simulatePaid?(paymentId: string): Promise<void>;
}
```

> Method `simulatePaid?` opsional. Real service tidak meng-expose-nya — di production tombol simulasi memang **tidak** boleh ada.

---

## Implementasi Dummy

`src/services/raja-ongkir/dummy/shipping.dummy.ts`

```ts
import type { ShippingService } from "../types";
import {
  getProvincesDummy, getCitiesDummy, getDistrictsDummy,
  calculateCostDummy,
} from "@/lib/dummy/destinations";
import { deriveStatus, deriveManifest } from "@/lib/dummy/status-simulator";
import { useOrderStore } from "@/stores/order-store";

export const dummyShippingService: ShippingService = {
  getProvinces: getProvincesDummy,
  getCities: getCitiesDummy,
  getDistricts: getDistrictsDummy,
  calculateCost: calculateCostDummy,

  async getTrackingManifest({ orderId, paidAt }) {
    return {
      meta: { message: "ok", code: 200, status: "success" },
      data: {
        status: deriveStatus(paidAt),
        manifest: deriveManifest(paidAt),
      },
    };
  },
};
```

`src/services/raja-ongkir/dummy/payment.dummy.ts`

```ts
import type { PaymentService } from "../types";
import { createQrisDummy } from "@/lib/dummy/payment-channels";
import { usePaymentStore } from "@/stores/payment-store";
import { useOrderStore } from "@/stores/order-store";
import { generateDummyAwb } from "@/lib/dummy/awb-generator";

export const dummyPaymentService: PaymentService = {
  async getMethods() { /* return DUMMY_PAYMENT_METHODS_RESPONSE */ },

  async createQris(input) {
    const res = await createQrisDummy(input);
    // simpan ke store agar getStatus konsisten
    usePaymentStore.getState().add(res.data);
    return res;
  },

  async getStatus(paymentId) {
    const session = usePaymentStore.getState().sessions[paymentId];
    return {
      meta: { message: "ok", code: 200, status: "success" },
      data: session
        ? { payment_id: paymentId, reference_id: session.reference_id, status: session.status, paid_at: session.paid_at }
        : { payment_id: paymentId, reference_id: "", status: "FAILED" },
    };
  },

  async cancel(paymentId) {
    usePaymentStore.getState().cancel(paymentId);
    return { meta: { message: "cancelled", code: 200, status: "success" },
             data: { payment_id: paymentId, status: "CANCELLED" } };
  },

  async simulatePaid(paymentId) {
    const session = usePaymentStore.getState().sessions[paymentId];
    if (!session || session.status !== "PENDING") return;

    const paidAt = new Date().toISOString();
    usePaymentStore.getState().markPaid(paymentId, paidAt);

    // update order — generate AWB
    useOrderStore.getState().markPaid(session.reference_id, {
      awb: generateDummyAwb(),
      paidAt,
    });
  },
};
```

---

## Factory

`src/services/raja-ongkir/index.ts`

```ts
import type { ShippingService, PaymentService } from "./types";
import { dummyShippingService } from "./dummy/shipping.dummy";
import { dummyPaymentService } from "./dummy/payment.dummy";

// Real services dibuat nanti
// import { realShippingService } from "./real/shipping.real";
// import { realPaymentService } from "./real/payment.real";

const USE_DUMMY = process.env.NEXT_PUBLIC_USE_DUMMY_RAJAONGKIR !== "false";

export const shippingService: ShippingService = USE_DUMMY
  ? dummyShippingService
  : /* realShippingService */ dummyShippingService;

export const paymentService: PaymentService = USE_DUMMY
  ? dummyPaymentService
  : /* realPaymentService */ dummyPaymentService;
```

> Default-nya **dummy**. Untuk swap ke real, set di `.env.local`:
> ```env
> NEXT_PUBLIC_USE_DUMMY_RAJAONGKIR=false
> ```

---

## Pemakaian di Komponen

`src/app/checkout/components/courier-options.tsx` (contoh)

```tsx
"use client";

import { useEffect, useState } from "react";
import { shippingService } from "@/services/raja-ongkir";
import { useCartStore } from "@/stores/cart-store";
import { useShippingStore } from "@/stores/shipping-store";
import type { ShippingOption } from "@/types/raja-ongkir";

export function CourierOptions() {
  const address = useShippingStore((s) => s.address);
  const totalWeight = useCartStore((s) => s.totalWeight());
  const [options, setOptions] = useState<ShippingOption[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!address) return;
    setLoading(true);
    shippingService
      .calculateCost({
        originDistrictId: 1391, // hardcoded warehouse
        destinationDistrictId: address.districtId,
        weight: totalWeight,
        couriers: ["jne", "jnt", "sicepat", "anteraja", "pos"],
      })
      .then((res) => setOptions(res.data))
      .finally(() => setLoading(false));
  }, [address?.districtId, totalWeight]);

  if (!address) return <p>Pilih alamat dulu.</p>;
  if (loading) return <p>Memuat opsi kurir…</p>;

  return (
    <div>
      {options.map((opt) => (
        <CourierRadio key={`${opt.code}-${opt.service}`} option={opt} />
      ))}
    </div>
  );
}
```

> Komponen ini **tidak tahu** apakah `shippingService` dari dummy atau real. Saat ganti env, behavior tetap sama persis dari sisi UI.

---

## Migrasi ke Real

Saat siap pakai RajaOngkir asli:

### 1. Tulis Real Service

`src/services/raja-ongkir/real/shipping.real.ts`

```ts
import type { ShippingService } from "../types";

export const realShippingService: ShippingService = {
  async getProvinces() {
    const res = await fetch("/api/komerce/destinations/province");
    return res.json();
  },

  async getCities(provinceId) {
    const res = await fetch(`/api/komerce/destinations/city/${provinceId}`);
    return res.json();
  },

  // ... dst
};
```

Route handler-nya yang call ke RajaOngkir + lampirkan API key — detail di [`docs/raja-ongkir/integration-guide.md`](../raja-ongkir/integration-guide.md).

### 2. Update Factory

```ts
// src/services/raja-ongkir/index.ts
import { realShippingService } from "./real/shipping.real";
import { realPaymentService } from "./real/payment.real";

const USE_DUMMY = process.env.NEXT_PUBLIC_USE_DUMMY_RAJAONGKIR !== "false";

export const shippingService = USE_DUMMY ? dummyShippingService : realShippingService;
export const paymentService = USE_DUMMY ? dummyPaymentService : realPaymentService;
```

### 3. Set Env

`.env.local`:

```env
NEXT_PUBLIC_USE_DUMMY_RAJAONGKIR=false
RAJAONGKIR_API_KEY=...
KOMERCE_API_KEY=...
```

### 4. Hapus Tombol Simulasi

Komponen yang pakai `paymentService.simulatePaid?.()` cek dulu:

```tsx
{process.env.NODE_ENV !== "production" && paymentService.simulatePaid && (
  <button onClick={() => paymentService.simulatePaid!(paymentId)}>
    🔧 Simulasi Pembayaran
  </button>
)}
```

`paymentService.simulatePaid` di real version = `undefined` → tombol auto-hilang.

---

## Best Practices

### 1. Selalu Pakai Service, Jangan Import Dummy Langsung

❌ **Jangan**:
```ts
import { DUMMY_PROVINCES } from "@/lib/dummy/destinations";
```

✅ **Lakukan**:
```ts
import { shippingService } from "@/services/raja-ongkir";
const { data } = await shippingService.getProvinces();
```

Kalau import langsung, komponen jadi **coupled** ke implementasi dummy → saat migrasi harus ubah komponen.

### 2. Tipe TypeScript Sama untuk Dummy & Real

Tipe di `src/types/raja-ongkir.ts` adalah **kontrak**. Dummy & real **wajib** match. Kalau tipe berbeda, kompiler langsung error saat swap → safety net otomatis.

### 3. Loading State Tetap Ada Meski Dummy Sinkron

Promise dummy resolve seketika (microtask), tapi komponen tetap render `loading` state. Pas swap ke real, loading sudah ada → no UI surprises.

### 4. Error Handling Dipasang Dari Awal

```ts
try {
  const { data } = await shippingService.calculateCost(...);
} catch (e) {
  setError("Gagal menghitung ongkir, coba lagi.");
}
```

Dummy tidak akan throw, tapi pasang try-catch dari awal → migrasi ke real langsung handle network error.

### 5. Hindari `if (USE_DUMMY) ...` di Komponen

Branch logic dummy-vs-real **hanya** boleh di factory. Komponen harus tetap polymorphic. Kalau butuh tombol dev-only, pakai check `process.env.NODE_ENV` atau optional method seperti `simulatePaid?`.

---

## Testing Strategy

### Unit Test (komponen UI)

Pakai service yang di-inject (dependency injection) untuk test mode. Bisa pakai React Context:

```tsx
const ServiceContext = createContext({
  shippingService: dummyShippingService,
  paymentService: dummyPaymentService,
});

export function ServiceProvider({ services, children }: ...) {
  return <ServiceContext.Provider value={services}>{children}</ServiceContext.Provider>;
}
```

Di test:

```tsx
<ServiceProvider services={{ shippingService: mockShipping, paymentService: mockPayment }}>
  <Checkout />
</ServiceProvider>
```

### Integration Test (service layer)

Test `dummyShippingService.calculateCost` langsung — pastikan output match snapshot.

### E2E (Playwright)

Cukup jalankan dengan `NEXT_PUBLIC_USE_DUMMY_RAJAONGKIR=true` → flow lengkap bisa di-test deterministik tanpa external API.
