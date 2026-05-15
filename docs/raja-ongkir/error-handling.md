# Error Handling & Konvensi Response

Semua modul Komerce/RajaOngkir mengikuti envelope yang konsisten:

```json
{
  "meta": {
    "message": "human readable message",
    "code": 200,
    "status": "success"   // atau "error"
  },
  "data": null | object | array
}
```

## Mapping HTTP Status

| `meta.code` | Arti | Action |
| --- | --- | --- |
| `200` | OK (read sukses) | proses `data` |
| `201` | Created (write sukses) | simpan ID hasil create |
| `400` | Bad Request — parameter typo / format salah | log & tampilkan validation error ke user |
| `401` | Unauthorized — API key salah / hilang | cek env var, **jangan retry** |
| `403` | Forbidden — endpoint butuh role lebih tinggi / sandbox key di prod | minta approval Komerce |
| `404` | Not Found — `order_no` / `payment_id` / destination `id` tidak ada | verifikasi ulang sumber ID |
| `422` | Unprocessable Entity — validasi business logic gagal (cancel order yang sudah shipped, cancel payment yang sudah paid, kurir tidak cover rute) | tampilkan pesan spesifik ke user |
| `429` | Rate Limit / kuota habis | back-off exponential, alert admin |
| `500` | Internal Server Error di Komerce | retry dengan jeda; log untuk laporan ke support |

## Pola Error Body

Saat error, `data` biasanya berisi salah satu:

```json
{ "data": null }
```

atau

```json
{ "data": { "errors": "Data not found" } }
```

atau

```json
{ "data": { "errors": { "field_name": ["validation message"] } } }
```

> Karena format `errors` tidak 100% konsisten antar modul, di FE pakai narrow type guard sebelum render.

## Helper Generic di Project

```ts
// src/lib/komerce.ts
export interface KomerceResponse<T> {
  meta: {
    message: string;
    code: number;
    status: "success" | "error";
  };
  data: T | null | { errors: string | Record<string, string[]> };
}

export class KomerceError extends Error {
  constructor(
    public status: number,
    public code: number,
    message: string,
    public raw?: unknown,
  ) {
    super(message);
  }
}

export async function komerceFetch<T>(
  url: string,
  init: RequestInit,
): Promise<T> {
  const res = await fetch(url, init);
  const json = (await res.json()) as KomerceResponse<T>;

  if (!res.ok || json.meta.status === "error") {
    throw new KomerceError(res.status, json.meta.code, json.meta.message, json);
  }
  return json.data as T;
}
```

Pakai di route handler:

```ts
import { komerceFetch, KomerceError } from "@/lib/komerce";

try {
  const provinces = await komerceFetch<Array<{ id: number; name: string }>>(
    `${process.env.RAJAONGKIR_BASE_URL}/destination/province`,
    { headers: { key: process.env.RAJAONGKIR_API_KEY! } },
  );
  return Response.json({ data: provinces });
} catch (e) {
  if (e instanceof KomerceError) {
    return Response.json(
      { error: e.message, code: e.code },
      { status: e.status },
    );
  }
  throw e;
}
```

## Retry Policy

| Skenario | Retry? | Strategi |
| --- | --- | --- |
| `4xx` (kecuali 429) | ❌ | Fix request, jangan retry |
| `429` | ✅ | Exponential back-off: 1s, 2s, 4s, 8s, max 5x |
| `500/502/503/504` | ✅ | Retry max 2x dengan jitter |
| Network timeout | ✅ | Retry 1x |

Hindari retry untuk write operations (`store`, `pickup/request`, `payment/create`) kecuali Anda **yakin** request sebelumnya tidak masuk (mis. timeout 0s = belum kirim). Untuk write yang tidak idempoten, **always** gunakan `reference_id` unik sehingga side-effect dobel bisa diidentifikasi.

## Common Pitfalls

1. **Mencampur header `key` dan `x-api-key`.** Shipping Cost pakai `key`, Komship/Payment pakai `x-api-key`. Salah header = `401`.
2. **Weight bukan gram.** Banyak yang kirim `weight=1` mengira itu kg. Komerce **selalu** gram.
3. **Cancel order setelah pickup.** Setelah status `Dijemput`, cancel ditolak `422`. Pakai endpoint reschedule/return policy kurir di luar API.
4. **Tracking AWB <5 menit setelah pickup.** Sistem kurir butuh waktu sync. Tampilkan state "menunggu kurir" di UI.
5. **Sandbox key di production base URL.** `403 Forbidden` — pastikan env per environment terpisah.
6. **Origin/destination cross-method.** ID dari `/destination/district` **tidak compatible** dengan endpoint `/calculate/domestic-cost` (search-base). Pakai endpoint kalkulasi yang sesuai dengan sumber ID.

## Monitoring di Production

Pasang minimal:

- **Sentry / Logtail** untuk capture `KomerceError`
- **Alert webhook gagal >3 kali** di Vercel / monitoring tool
- **Dashboard latency** per endpoint (P95 < 2 detik wajar untuk Indonesia)
