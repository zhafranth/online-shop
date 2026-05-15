# Destinations — Pencarian Lokasi

Modul ini bagian dari **RajaOngkir API V2**. Dipakai untuk mengisi dropdown alamat pengiriman di checkout (province → city → district → subdistrict).

- **Base URL:** `https://rajaongkir.komerce.id/api/v1`
- **Header:** `key: <RAJAONGKIR_API_KEY>`
- Semua endpoint pakai **GET**, tanpa body.

RajaOngkir menyediakan dua pendekatan:

1. **Step-by-Step Method** — pemilihan berjenjang (recommended untuk form checkout konvensional).
2. **Direct Search Method** — search bebas dengan keyword (recommended untuk autocomplete).

---

## 1. Step-by-Step Method

### 1.1 Search Province

```http
GET /destination/province
```

```bash
curl --location 'https://rajaongkir.komerce.id/api/v1/destination/province' \
  --header 'key: YOUR_API_KEY'
```

**Response (200):**

```json
{
  "meta": { "message": "Success Get Province", "code": 200, "status": "success" },
  "data": [
    { "id": 1,  "name": "NUSA TENGGARA BARAT (NTB)" },
    { "id": 11, "name": "DKI JAKARTA" }
  ]
}
```

### 1.2 Search City (by Province ID)

```http
GET /destination/city/{province_id}
```

```bash
curl --location 'https://rajaongkir.komerce.id/api/v1/destination/city/12' \
  --header 'key: YOUR_API_KEY'
```

**Response (200):**

```json
{
  "meta": { "message": "Success Get City By Province ID", "code": 200, "status": "success" },
  "data": [
    { "id": 1360, "name": "JAKARTA SELATAN", "zip_code": "0" },
    { "id": 1361, "name": "JAGAKARSA",       "zip_code": "12630" }
  ]
}
```

### 1.3 Search District (by City ID)

```http
GET /destination/district/{city_id}
```

```bash
curl --location 'https://rajaongkir.komerce.id/api/v1/destination/district/575' \
  --header 'key: YOUR_API_KEY'
```

Response struktur sama dengan City: `id`, `name`, `zip_code`.

### 1.4 Search Subdistrict (by District ID)

```http
GET /destination/sub-district/{district_id}
```

```bash
curl --location 'https://rajaongkir.komerce.id/api/v1/destination/sub-district/5823' \
  --header 'key: YOUR_API_KEY'
```

**Response (200):**

```json
{
  "meta": { "message": "Success Get Sub District By District ID", "code": 200, "status": "success" },
  "data": [
    { "id": 68513, "name": "BALERAKSA", "zip_code": "53355" }
  ]
}
```

> Tingkat **subdistrict** opsional. Untuk hitung ongkir cukup sampai **district**.

---

## 2. Direct Search Method (Autocomplete)

Lebih cocok untuk UX modern (1 input field), dan dipasangkan dengan endpoint **Calculate Domestic Cost** (bukan `district/domestic-cost`).

### 2.1 Search Domestics Destination

```http
GET /destination/domestic-destination?search={keyword}&limit={n}&offset={n}
```

Pencarian fuzzy berdasarkan nama kelurahan/kecamatan/kota. Hasilnya berupa array of object dengan `id` yang langsung dipakai sebagai `origin` / `destination` di endpoint hitung ongkir.

> Path persis endpoint ini bisa berubah; rujuk halaman <https://www.rajaongkir.com/docs/shipping-cost/endpoint-rajaongkir-for-search-base/about> kalau respons 404.

### 2.2 Search International Destination

```http
GET /destination/international-destination?search={country_or_city}
```

Mengembalikan daftar kota/negara tujuan internasional dengan `id` yang dipakai di endpoint `calculate/international-cost`.

---

## Caching Strategy

Data lokasi nyaris statis. Di Next.js:

```ts
// app/api/destinations/province/route.ts
export async function GET() {
  const res = await fetch(`${process.env.RAJAONGKIR_BASE_URL}/destination/province`, {
    headers: { key: process.env.RAJAONGKIR_API_KEY! },
    next: { revalidate: 60 * 60 * 24 * 7 }, // 7 hari
  });
  return Response.json(await res.json(), { status: res.status });
}
```

Untuk **subdistrict** yang potensial lebih sering update (kode pos baru), pakai TTL lebih pendek (~24 jam).

## Hint: ID adalah yang Penting

Saat menyimpan alamat user, **simpan `id` district/subdistrict** (bukan nama-nya saja). Saat checkout, ID ini dipakai langsung di parameter `origin`/`destination` di endpoint hitung ongkir — tanpa konversi.

Untuk store di Zustand misalnya:

```ts
interface ShippingAddress {
  provinceId: number;
  provinceName: string;
  cityId: number;
  cityName: string;
  districtId: number;
  districtName: string;
  subdistrictId?: number;
  zipCode: string;
  fullAddress: string;
}
```
