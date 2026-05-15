# Daftar Kurir (3PL) RajaOngkir × Komship

Daftar kode kurir resmi yang dipakai sebagai value parameter `courier` di endpoint `calculate-cost` dan parameter `shipping` di Komship Create Order. Gunakan **kode**, bukan nama lengkap.

## Matriks Fitur (RajaOngkir V2)

| Nama Kurir | Kode | Domestic Cost | International Cost | Tracking AWB |
| --- | --- | :---: | :---: | :---: |
| JNE | `jne` | ✅ | ✅ | ✅ |
| J&T Express | `jnt` | ✅ | ❌ | ✅ |
| SiCepat Ekspres | `sicepat` | ✅ | ❌ | ✅ |
| ID Express | `ide` | ✅ | ❌ | ❌ |
| SAP Express | `sap` | ✅ | ❌ | ✅ |
| Ninja Xpress | `ninja` | ✅ | ❌ | ✅ |
| TIKI | `tiki` | ✅ | ✅ | ✅ |
| Wahana Express | `wahana` | ✅ | ❌ | ✅ |
| POS Indonesia | `pos` | ✅ | ✅ | ✅ |
| Sentral Cargo | `sentral` | ✅ | ❌ | ❌ |
| Lion Parcel | `lion` | ✅ | ❌ | ✅ |
| Royal Express Asia | `rex` | ✅ | ❌ | ❌ |
| Anteraja | `anteraja` | ✅ | ❌ | ✅ |
| RPX | `rpx` | ✅ | ❌ | ✅ |
| Star Cargo | `star` | ✅ | ❌ | ✅ |
| NCS | `ncs` | ✅ | ❌ | ❌ |
| DSE | `dse` | ✅ | ❌ | ❌ |

Hanya **JNE**, **TIKI**, dan **POS** yang mendukung pengiriman internasional.

## Cara Pakai di Request

### Multi-kurir (cek ongkir paralel)

Pisahkan kode dengan **titik dua** (`:`). Wajib pakai format ini di endpoint `district/domestic-cost`:

```
courier=jne:sicepat:jnt:pos:tiki:anteraja
```

### Single courier

```
courier=jne
```

## Kurir di Komship Delivery API

Saat **membuat order** (`/order/api/v1/orders/store`), field `shipping` memakai nama kurir dalam **huruf besar** (bukan kode lowercase), contoh:

| `shipping` | `shipping_type` (contoh) |
| --- | --- |
| `JNE` | `REG23`, `OKE23`, `YES23` |
| `J&T` | `EZ`, `REG` |
| `SICEPAT` | `REG`, `SIUNT`, `BEST` |
| `POS` | `Paket Kilat Khusus`, `Pos Reguler` |
| `IDEXPRESS` | `STD` |
| `NINJA` | `STANDARD` |
| `SAP` | `REG`, `SDS` |
| `LION` | `REGPACK`, `ONEPACK` |

> Kode service (`shipping_type`) bisa berubah-ubah; selalu ambil dari hasil endpoint **Calculate Delivery Price** (`/order/api/v1/calculate`) yang mengembalikan `service` valid untuk akun Komship Anda.

## Commodity Code (khusus LION)

Saat memakai **Lion Parcel** di Komship, field `commodity_code` **wajib** diisi. Contoh nilai: `ELG150` (untuk Electronic Goods). Komerce menyediakan referensi lengkap di Google Spreadsheet:

<https://docs.google.com/spreadsheets/d/1aveqmZkts9DLmWKViyuBOGV1ORQYyWgBBoX0sqTiE3A/edit?usp=sharing>

## Catatan untuk ThickApparel

Project menjual pakaian. Rekomendasi default kurir untuk awal launch:

```ts
const DEFAULT_COURIERS = ["jne", "jnt", "sicepat", "pos", "anteraja"] as const;
```

Lima kurir di atas paling umum di Indonesia, semua mendukung domestic cost + tracking. Tambahkan opsi internasional (`jne`, `tiki`, `pos`) hanya kalau pelanggan luar negeri benar-benar mau didukung.
