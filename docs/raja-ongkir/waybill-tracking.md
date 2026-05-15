# Waybill / AWB Tracking

Endpoint untuk melacak status pengiriman berdasarkan **nomor resi (AWB)**.

- **Base URL:** `https://rajaongkir.komerce.id/api/v1`
- **Method:** `POST`
- **Header:** `key: <RAJAONGKIR_API_KEY>`

> ⚠️ AWB yang baru saja terbit kadang butuh beberapa menit sebelum trackable di sistem kurir. Implementasi UI sebaiknya tampilkan state "belum aktif" untuk request <5 menit setelah AWB di-generate.

## Endpoint

```http
POST /track/waybill?awb={awb_number}&courier={courier_code}
```

### Query Parameters

| Field | Type | Required | Keterangan |
| --- | --- | :---: | --- |
| `awb` | string | ✅ | Nomor resi |
| `courier` | string | ✅ | Kode kurir (lihat [`couriers.md`](./couriers.md)) |
| `last_phone_number` | string | ⚠️ kurir tertentu | 5 digit terakhir nomor HP penerima — wajib untuk J&T dan beberapa kurir lain |

### cURL

```bash
curl --location --request POST \
  "https://rajaongkir.komerce.id/api/v1/track/waybill?awb=JNE12345678&courier=jne" \
  --header "key: YOUR_API_KEY"
```

## Response (200)

```json
{
  "meta": { "message": "Success Get Waybill", "code": 200, "status": "success" },
  "data": {
    "delivered": true,
    "summary": {
      "courier_code": "jne",
      "courier_name": "JNE",
      "waybill_number": "JNE12345678",
      "service_code": "REG",
      "waybill_date": "2025-01-10",
      "shipper_name": "ThickApparel",
      "receiver_name": "Budi Santoso",
      "origin": "JAKARTA",
      "destination": "BANDUNG",
      "status": "DELIVERED"
    },
    "details": {
      "waybill_number": "JNE12345678",
      "waybill_date": "2025-01-10",
      "waybill_time": "10:23:00",
      "weight": "1.00 kg",
      "origin": "JAKARTA",
      "destination": "BANDUNG",
      "shipper_name": "ThickApparel",
      "shipper_address1": "Jl. Sudirman No. 1",
      "shipper_address2": "",
      "shipper_address3": "",
      "shipper_city": "JAKARTA SELATAN",
      "receiver_name": "Budi Santoso",
      "receiver_address1": "Jl. Asia Afrika No. 8",
      "receiver_address2": "",
      "receiver_address3": "",
      "receiver_city": "BANDUNG"
    },
    "delivery_status": {
      "status": "DELIVERED",
      "pod_receiver": "Budi Santoso",
      "pod_date": "2025-01-12",
      "pod_time": "14:45:00"
    },
    "manifest": [
      {
        "manifest_code": "PICKUP",
        "manifest_description": "Paket telah dipickup oleh kurir",
        "manifest_date": "2025-01-10",
        "manifest_time": "11:00:00",
        "city_name": "JAKARTA SELATAN"
      },
      {
        "manifest_code": "IN_TRANSIT",
        "manifest_description": "Paket dalam perjalanan ke kota tujuan",
        "manifest_date": "2025-01-11",
        "manifest_time": "08:30:00",
        "city_name": "BEKASI"
      },
      {
        "manifest_code": "DELIVERED",
        "manifest_description": "Paket telah diterima",
        "manifest_date": "2025-01-12",
        "manifest_time": "14:45:00",
        "city_name": "BANDUNG"
      }
    ]
  }
}
```

### Field Penting

| Path | Keterangan |
| --- | --- |
| `data.delivered` | `boolean` — `true` kalau paket sudah sampai |
| `data.summary.status` | Status ringkas (mis. `ON PROCESS`, `IN TRANSIT`, `DELIVERED`) |
| `data.delivery_status.pod_receiver` | Siapa yang menerima paket (POD = Proof of Delivery) |
| `data.manifest[]` | History event lengkap, urut kronologis |

## Implementasi di ThickApparel

### Tipe TypeScript

```ts
// src/types/tracking.ts
export interface TrackingManifest {
  manifest_code: string;
  manifest_description: string;
  manifest_date: string;
  manifest_time: string;
  city_name: string;
}

export interface TrackingResponse {
  meta: { message: string; code: number; status: "success" | "error" };
  data: {
    delivered: boolean;
    summary: {
      courier_code: string;
      courier_name: string;
      waybill_number: string;
      service_code: string;
      waybill_date: string;
      shipper_name: string;
      receiver_name: string;
      origin: string;
      destination: string;
      status: string;
    };
    details: Record<string, string>;
    delivery_status: {
      status: string;
      pod_receiver: string;
      pod_date: string;
      pod_time: string;
    };
    manifest: TrackingManifest[];
  };
}
```

### Route Handler

```ts
// src/app/api/shipping/track/route.ts
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const awb = searchParams.get("awb");
  const courier = searchParams.get("courier");

  if (!awb || !courier) {
    return Response.json(
      { meta: { code: 400, status: "error", message: "awb dan courier wajib diisi" } },
      { status: 400 },
    );
  }

  const url = new URL(`${process.env.RAJAONGKIR_BASE_URL}/track/waybill`);
  url.searchParams.set("awb", awb);
  url.searchParams.set("courier", courier);

  const res = await fetch(url, {
    method: "POST",
    headers: { key: process.env.RAJAONGKIR_API_KEY! },
    cache: "no-store",
  });
  return Response.json(await res.json(), { status: res.status });
}
```

### UX Tip

Pasang tombol "Lacak Pesanan" di halaman detail order (`/orders/[id]`). Saat tombol diklik:

1. Ambil `awb` & `courier` dari order yang sudah ter-shipped.
2. Render manifest sebagai **vertical timeline** (lihat pola `StepBar` di `src/components/ui/`).
3. Highlight item terakhir sebagai status saat ini.

## Versi Komship (alternatif)

Komship juga menyediakan endpoint history AWB sendiri di `/order/api/v1/orders/history-airway-bill`. Lihat [`delivery-komship.md`](./delivery-komship.md#history-airway-bill). Bedanya:

- Endpoint RajaOngkir V2 (di file ini) lebih lengkap (`summary` + `details` + `manifest`).
- Endpoint Komship lebih sederhana (`history` saja), tapi sudah cukup kalau pesanan dibuat lewat Komship.

Pilih sesuai sumber order. Untuk ThickApparel yang nantinya pakai Komship untuk create order, **gunakan endpoint Komship** agar konsisten.
