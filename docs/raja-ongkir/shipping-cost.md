# Shipping Cost — Hitung Ongkir

Ada **3 endpoint** kalkulasi ongkir di RajaOngkir V2. Pilih sesuai metode input destinasi:

| Endpoint | Sumber `origin`/`destination` ID | Pemakaian |
| --- | --- | --- |
| `POST /calculate/district/domestic-cost` | District ID (dari step-by-step) | Form berjenjang province → city → district |
| `POST /calculate/domestic-cost` | ID dari Search Domestic Destination | Autocomplete satu input |
| `POST /calculate/international-cost` | ID dari Search International Destination | Pengiriman luar negeri |

- **Base URL:** `https://rajaongkir.komerce.id/api/v1`
- **Header:** `key: <RAJAONGKIR_API_KEY>` + `Content-Type: application/x-www-form-urlencoded`
- Method semua endpoint: **POST** dengan body `x-www-form-urlencoded`.

---

## 1. District Calculate Cost (Step-by-Step)

```http
POST /calculate/district/domestic-cost
```

### Body Parameters

| Field | Type | Required | Keterangan |
| --- | --- | :---: | --- |
| `origin` | int | ✅ | District ID asal (mis. `1391`) |
| `destination` | int | ✅ | District ID tujuan |
| `weight` | int | ✅ | Berat dalam **gram** (1 kg = `1000`) |
| `courier` | string | ✅ | Kode kurir, multi pakai `:` (mis. `jne:sicepat:jnt`) |
| `price` | string | ❌ | `lowest` atau `highest` — sort hasil |

### cURL

```bash
curl --location 'https://rajaongkir.komerce.id/api/v1/calculate/district/domestic-cost' \
  --header 'key: YOUR_API_KEY' \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data-urlencode 'origin=1391' \
  --data-urlencode 'destination=1376' \
  --data-urlencode 'weight=1000' \
  --data-urlencode 'courier=jne:sicepat:jnt:pos:tiki:anteraja' \
  --data-urlencode 'price=lowest'
```

### Response (200)

```json
{
  "meta": { "message": "Success Calculate Shipping cost", "code": 200, "status": "success" },
  "data": [
    {
      "name": "Jalur Nugraha Ekakurir (JNE)",
      "code": "jne",
      "service": "REG",
      "description": "Layanan Reguler",
      "cost": 18000,
      "etd": "2-3 day"
    },
    {
      "name": "SiCepat Ekspres",
      "code": "sicepat",
      "service": "REG",
      "description": "Layanan Reguler",
      "cost": 17000,
      "etd": "1-2 day"
    }
  ]
}
```

> Field `cost` sudah dalam **Rupiah** (integer). Field `etd` adalah estimasi durasi dalam hari kerja.

---

## 2. Calculate Domestic Cost (Direct Search)

```http
POST /calculate/domestic-cost
```

### Body Parameters

| Field | Type | Required | Keterangan |
| --- | --- | :---: | --- |
| `origin` | int | ✅ | Location ID dari Search Domestic Destination |
| `destination` | int | ✅ | Location ID tujuan |
| `weight` | int | ✅ | Berat (gram) |
| `courier` | string | ✅ | Kode kurir tunggal atau multi (`:`-separated) |
| `price` | string | ❌ | `lowest` / `highest` |

### cURL

```bash
curl --location 'https://rajaongkir.komerce.id/api/v1/calculate/domestic-cost' \
  --header 'key: YOUR_API_KEY' \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data-urlencode 'origin=31555' \
  --data-urlencode 'destination=68423' \
  --data-urlencode 'weight=1000' \
  --data-urlencode 'courier=jne:sicepat:jnt' \
  --data-urlencode 'price=lowest'
```

### Response (200)

Sama struktur dengan endpoint #1 (array of `{ name, code, service, description, cost, etd }`).

---

## 3. Calculate International Cost

```http
POST /calculate/international-cost
```

Hanya kurir `jne`, `tiki`, dan `pos` yang didukung untuk internasional.

### Body Parameters

| Field | Type | Required | Keterangan |
| --- | --- | :---: | --- |
| `origin` | int | ✅ | District/City ID di Indonesia |
| `destination` | int | ✅ | International destination ID |
| `weight` | int | ✅ | Berat (gram) |
| `courier` | string | ✅ | `jne` / `tiki` / `pos` |
| `price` | string | ❌ | `lowest` / `highest` |

### cURL

```bash
curl --location 'https://rajaongkir.komerce.id/api/v1/calculate/international-cost' \
  --header 'key: YOUR_API_KEY' \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data-urlencode 'origin=152' \
  --data-urlencode 'destination=104' \
  --data-urlencode 'weight=1000' \
  --data-urlencode 'courier=pos' \
  --data-urlencode 'price=lowest'
```

### Response (200)

```json
{
  "meta": { "message": "Success Calculate International Shipping Cost", "code": 200, "status": "success" },
  "data": [
    {
      "name": "POS Indonesia",
      "code": "pos",
      "service": "EMS",
      "description": "Express Mail Service",
      "currency": "IDR",
      "cost": 580000,
      "etd": "4-7 day",
      "currency_updated_at": "2025-01-01 00:00:00",
      "currency_value": 1
    }
  ]
}
```

Untuk kurir yang memberikan harga dalam **USD/SGD**, field `currency`, `currency_value`, dan `currency_updated_at` menjelaskan konversi yang dipakai.

---

## Error Common

| `meta.code` | Penyebab | Solusi |
| --- | --- | --- |
| `400` | Parameter wajib hilang / typo | Cek `origin`, `destination`, `weight`, `courier` |
| `401` | API key salah / tidak diset di header `key` | Verifikasi env var |
| `404` | `origin`/`destination` ID tidak ditemukan | Pastikan ID berasal dari endpoint destination yang sama (district vs domestic-destination) |
| `422` | Kombinasi `courier` tidak melayani rute itu | Hapus kurir tertentu dari list multi-courier |

Lihat juga [`error-handling.md`](./error-handling.md).

---

## Implementasi di ThickApparel (Next.js)

### Route Handler

```ts
// src/app/api/shipping/cost/route.ts
import { NextResponse } from "next/server";

interface CostRequest {
  origin: number;
  destination: number;
  weight: number;
  couriers: string[];
}

export async function POST(req: Request) {
  const body = (await req.json()) as CostRequest;

  const form = new URLSearchParams({
    origin: String(body.origin),
    destination: String(body.destination),
    weight: String(body.weight),
    courier: body.couriers.join(":"),
    price: "lowest",
  });

  const res = await fetch(
    `${process.env.RAJAONGKIR_BASE_URL}/calculate/district/domestic-cost`,
    {
      method: "POST",
      headers: {
        key: process.env.RAJAONGKIR_API_KEY!,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: form,
      cache: "no-store",
    },
  );

  return NextResponse.json(await res.json(), { status: res.status });
}
```

### Tipe TypeScript

```ts
// src/types/shipping.ts
export interface ShippingOption {
  name: string;
  code: string;
  service: string;
  description: string;
  cost: number;        // dalam Rupiah
  etd: string;         // mis. "2-3 day"
}

export interface ShippingCostResponse {
  meta: { message: string; code: number; status: "success" | "error" };
  data: ShippingOption[];
}
```

### Catatan berat produk

Karena ThickApparel jual pakaian, asumsi berat per item:

- Kaos / kemeja ringan: 250–400 g
- Hoodie / sweater: 600–800 g
- Jaket / outer: 800–1200 g

Pastikan setiap product di `src/lib/constants.ts` punya field `weight` (gram). Total berat checkout = Σ (qty × weight).
