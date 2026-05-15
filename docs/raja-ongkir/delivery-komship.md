# Komship Delivery API

Modul **Komship Delivery API** dipakai untuk seluruh siklus order kurir: buat order → request pickup → cetak label → cek status → cancel/tracking.

- **Base URL Sandbox:** `https://api-sandbox.collaborator.komerce.id`
- **Base URL Production:** `https://api.collaborator.komerce.id`
- **Header otentikasi:** `x-api-key: <KOMERCE_API_KEY>` (+ `Content-Type: application/json` untuk request berbody JSON)

> Semua path di bawah ini diawali dengan `/order/api/v1/...`.

---

## 1. Create Order

```http
POST /order/api/v1/orders/store
```

Membuat order baru di sistem Komerce. Setelah berhasil, order masuk antrian `Created` / `Packing` dan menunggu request pickup.

### Headers

```http
x-api-key: <KOMERCE_API_KEY>
Content-Type: application/json
```

### Request Body

```json
{
  "order_date": "2025-05-21",
  "brand_name": "ThickApparel",
  "shipper_name": "ThickApparel Warehouse",
  "shipper_phone": "081234567890",
  "shipper_destination_id": 5969,
  "shipper_address": "Jl. Sudirman No. 1, Jakarta",
  "origin_pin_point": "-6.2088, 106.8456",
  "shipper_email": "ops@thickapparel.com",
  "receiver_name": "Budi Santoso",
  "receiver_phone": "081298765432",
  "receiver_destination_id": 4956,
  "receiver_address": "Jl. Asia Afrika No. 8, Bandung",
  "destination_pin_point": "-6.9175, 107.6191",
  "shipping": "JNE",
  "shipping_type": "REG23",
  "payment_method": "BANK TRANSFER",
  "shipping_cost": 18000,
  "shipping_cashback": 0,
  "service_fee": 0,
  "additional_cost": 0,
  "grand_total": 518000,
  "cod_value": 0,
  "insurance_value": 5000,
  "order_details": [
    {
      "product_name": "Thick Heavyweight Tee",
      "product_variant_name": "Black / L",
      "product_price": 250000,
      "product_weight": 350,
      "product_width": 10,
      "product_height": 5,
      "product_length": 30,
      "qty": 2,
      "subtotal": 500000
    }
  ]
}
```

### Field-field Penting

| Field | Tipe | Required | Catatan |
| --- | --- | :---: | --- |
| `order_date` | `string` (YYYY-MM-DD) | ✅ | Tanggal order |
| `brand_name` | `string` | ✅ | Nama brand yang muncul di label |
| `shipper_name/phone/address` | `string` | ✅ | Identitas pengirim |
| `shipper_destination_id` | `int` | ✅ | District ID asal (dari endpoint search destination Komship) |
| `receiver_*` | sama dengan shipper | ✅ | Identitas penerima |
| `shipping` | `string` | ✅ | Nama kurir HURUF BESAR (`JNE`, `J&T`, `SICEPAT`, dst.) |
| `shipping_type` | `string` | ✅ | Service code (mis. `REG23`, `YES23`) — ambil dari endpoint Calculate Delivery Price |
| `payment_method` | `string` | ✅ | `BANK TRANSFER` atau `COD` |
| `shipping_cost` | `int` | ✅ | Ongkir |
| `cod_value` | `int` | ❌ | Nominal COD; isi `0` kalau bukan COD |
| `insurance_value` | `number` | ❌ | Nilai asuransi paket (lihat About Insurance) |
| `commodity_code` | `string` | ⚠️ kurir tertentu | Wajib untuk Lion Parcel — lihat [`couriers.md`](./couriers.md#commodity-code-khusus-lion) |
| `order_details[].product_weight` | `int` | ✅ | gram per item |

### cURL

```bash
curl --location 'https://api-sandbox.collaborator.komerce.id/order/api/v1/orders/store' \
  --header 'x-api-key: YOUR_KOMERCE_KEY' \
  --header 'Content-Type: application/json' \
  --data-raw '{ ... payload di atas ... }'
```

### Response (201)

```json
{
  "meta": {
    "message": "Success Create New Order",
    "code": 201,
    "status": "success"
  },
  "data": {
    "order_id": 9999,
    "order_no": "KOM2025051512345"
  }
}
```

> `order_no` adalah **identitas utama** order. Simpan ke order store (`src/stores/order-store.ts`) saat integrasi. AWB belum tersedia di response create; AWB baru muncul setelah `pickup/request` sukses.

---

## 2. Search Destination & Calculate Delivery Price (versi Komship)

Selain RajaOngkir V2, Komship punya endpoint hitung ongkir sendiri yang langsung mengembalikan `shipping_type` valid:

```http
GET  /order/api/v1/destination/search?keyword=...
POST /order/api/v1/calculate
```

Body `POST /calculate`:

```json
{
  "shipper_destination_id": 5969,
  "receiver_destination_id": 4956,
  "weight": 1000,
  "item_value": 500000,
  "cod": "no"
}
```

Response mengembalikan list courier + service yang **sudah** dalam format `shipping` + `shipping_type` siap dipakai untuk `orders/store`. Gunakan endpoint ini kalau order memang akan dibuat via Komship — supaya tidak perlu mapping kode kurir manual.

---

## 3. Pickup Request

```http
POST /order/api/v1/pickup/request
```

Setelah order dibuat, request pickup untuk menjadwalkan kurir datang ambil paket. **AWB akan terbit di response endpoint ini.**

### Request Body

```json
{
  "pickup_date": "2025-05-22",
  "pickup_time": "10:00",
  "pickup_vehicle": "Motor",
  "orders": [
    { "order_no": "KOM2025051512345" }
  ]
}
```

| Field | Required | Keterangan |
| --- | :---: | --- |
| `pickup_date` | ✅ | Format `YYYY-MM-DD` |
| `pickup_time` | ✅ | Format `HH:MM` |
| `pickup_vehicle` | ✅ | `Motor`, `Mobil`, atau `Truk` |
| `orders[]` | ✅ | Array order yang mau di-pickup bareng (max sesuai limit kurir) |

### cURL

```bash
curl --location 'https://api-sandbox.collaborator.komerce.id/order/api/v1/pickup/request' \
  --header 'x-api-key: YOUR_KOMERCE_KEY' \
  --header 'Content-Type: application/json' \
  --data '{
    "pickup_date": "2025-05-22",
    "pickup_time": "10:00",
    "pickup_vehicle": "Motor",
    "orders": [{"order_no": "KOM2025051512345"}]
  }'
```

### Response (201)

```json
{
  "meta": { "message": "Success Request Pickup", "code": 201, "status": "success" },
  "data": [
    {
      "status": "success",
      "order_no": "KOM2025051512345",
      "awb": "JNE12345678"
    }
  ]
}
```

`data[i].awb` inilah nomor resi yang dipakai untuk endpoint tracking.

---

## 4. Print Label

```http
POST /order/api/v1/orders/print-label?page={page_n}&order_no={order_no(,order_no...)}
```

Generate label PDF (base64) untuk satu/banyak order.

### Query Parameters

| Field | Required | Keterangan |
| --- | :---: | --- |
| `page` | ✅ | `page_1`, `page_2`, `page_4`, `page_5`, `page_6` (jumlah label per halaman) |
| `order_no` | ✅ | Bisa multiple, pisahkan dengan koma |

### cURL

```bash
curl --location --request POST \
  'https://api-sandbox.collaborator.komerce.id/order/api/v1/orders/print-label?page=page_4&order_no=KOM2025051512345,KOM2025051512346' \
  --header 'x-api-key: YOUR_KOMERCE_KEY'
```

### Response (200)

```json
{
  "meta": { "message": "Generate Print Label success", "code": 200, "status": "success" },
  "data": {
    "path": "/storage/label-22-05-2025-10-00-00000000000.pdf",
    "base_64": "JVBERi0xLjMK..."
  }
}
```

Kirim `base_64` langsung ke browser sebagai `data:application/pdf;base64,...` untuk preview/print.

---

## 5. Detail Order

```http
GET /order/api/v1/orders/detail?order_no={order_no}
```

### cURL

```bash
curl --location 'https://api-sandbox.collaborator.komerce.id/order/api/v1/orders/detail?order_no=KOM2025051512345' \
  --header 'x-api-key: YOUR_KOMERCE_KEY'
```

### Response (200)

```json
{
  "meta": { "message": "Success get order detail", "code": 200, "status": "success" },
  "data": {
    "order_no": "KOM2025051512345",
    "awb": "JNE12345678",
    "order_status": "Dikirim",
    "shipper_name": "ThickApparel Warehouse",
    "receiver_name": "Budi Santoso",
    "shipping": "JNE",
    "grand_total": 518000,
    "order_details": [
      { "product_name": "Thick Heavyweight Tee", "qty": 2, "subtotal": 500000 }
    ]
  }
}
```

### Status Order

| Status | Arti |
| --- | --- |
| `Created` | Order baru, belum di-pickup |
| `Packing` | Order sedang disiapkan |
| `Diajukan` | Pickup sudah di-request |
| `Dijemput` | Kurir sudah ambil paket |
| `Dikirim` | Dalam perjalanan |
| `Selesai` | Sampai ke penerima |
| `Dibatalkan` | Order dibatalkan |

---

## 6. Cancel Order

```http
PUT /order/api/v1/orders/cancel
```

> Hanya bisa cancel order dengan status **`Created`** atau **`Packing`** (sebelum di-pickup).

### Request Body

```json
{ "order_no": "KOM2025051512345" }
```

### cURL

```bash
curl --location --request PUT 'https://api-sandbox.collaborator.komerce.id/order/api/v1/orders/cancel' \
  --header 'x-api-key: YOUR_KOMERCE_KEY' \
  --header 'Content-Type: application/json' \
  --data '{"order_no": "KOM2025051512345"}'
```

### Response (200)

```json
{
  "meta": { "message": "success cancel order", "code": 200, "status": "success" },
  "data": null
}
```

### Error (422)

```json
{
  "meta": { "message": "cancel order failed", "code": 422, "status": "error" },
  "data": { "errors": "Failed Cancel order, order status not eligible" }
}
```

---

## 7. History Airway Bill

```http
GET /order/api/v1/orders/history-airway-bill?shipping={courier}&airway_bill={awb}
```

History event AWB untuk order yang dibuat lewat Komship. Lebih ringkas dibanding endpoint `/track/waybill` RajaOngkir V2, tapi sudah cukup untuk timeline UI.

### cURL

```bash
curl --location 'https://api-sandbox.collaborator.komerce.id/order/api/v1/orders/history-airway-bill?shipping=jne&airway_bill=JNE12345678' \
  --header 'x-api-key: YOUR_KOMERCE_KEY'
```

### Response (200)

```json
{
  "meta": { "message": "success get data", "code": 200, "status": "success" },
  "data": {
    "airway_bill": "JNE12345678",
    "last_status": "Dikirim",
    "history": [
      {
        "desc": "Paket telah dipickup oleh kurir",
        "date": "2025-05-22 11:00:00",
        "code": "PICKUP",
        "status": "Dijemput"
      },
      {
        "desc": "Paket dalam perjalanan",
        "date": "2025-05-23 08:00:00",
        "code": "IN_TRANSIT",
        "status": "Dikirim"
      }
    ]
  }
}
```

---

## 8. Insurance & Commodity

### Insurance

Field `insurance_value` (number, Rupiah) menentukan nilai asuransi paket. Premi otomatis dihitung oleh kurir berdasarkan persentase × `insurance_value`. Set ke `0` kalau tidak pakai asuransi.

### Commodity

Field `commodity_code` (string) **wajib** untuk **Lion Parcel** dan beberapa kurir lain saat shipping barang spesifik. Daftar kode lengkap di:

<https://docs.google.com/spreadsheets/d/1aveqmZkts9DLmWKViyuBOGV1ORQYyWgBBoX0sqTiE3A/edit?usp=sharing>

Untuk ThickApparel (apparel/textile), kode yang relevan biasanya kategori **Garment** atau **Textile**.

---

## 9. Webhook

Lihat dokumen tersendiri di [`webhooks.md`](./webhooks.md) untuk format payload + cara verifikasi.

---

## Integrasi dengan ThickApparel

### Tipe Order di Project

Struct order saat ini hanya untuk mock (`src/lib/admin-seeds.ts`). Saat integrasi:

```ts
// src/types/admin.ts — extend Order type
export interface Order {
  id: string;                  // ORD-XXX (local)
  komerceOrderNo?: string;     // KOMxxx dari Komerce
  awb?: string;                // resi
  courier?: string;            // "JNE"
  service?: string;            // "REG23"
  status: "Created" | "Packing" | "Diajukan" | "Dijemput" | "Dikirim" | "Selesai" | "Dibatalkan";
  // ... existing fields
}
```

### Flow Singkat

1. **Checkout sukses** → panggil `/api/komerce/orders/store` (route handler) → simpan `komerceOrderNo`.
2. **Admin trigger pickup** dari `/admin/orders/[id]` → panggil `/api/komerce/pickup` → simpan `awb`.
3. **Customer track** di `/orders/[id]` → panggil `/api/komerce/track?awb=...&courier=...`.
4. **Webhook update** → endpoint `/api/komerce/webhook` patch status order di store.
