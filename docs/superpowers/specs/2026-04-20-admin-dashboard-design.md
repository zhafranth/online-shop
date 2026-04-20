# VESTIRE Admin Dashboard — Design Spec

**Date:** 2026-04-20
**Status:** Draft (awaiting user review)
**Scope:** Full admin dashboard with mock data persistence (no backend API yet)

## Overview

Add a full-featured admin panel to the VESTIRE online shop project. Since the project currently has no backend API or database, all state is managed client-side via Zustand + localStorage persistence, seeded from mock data on first load.

The admin panel is a separate area under `/admin/*` with its own layout, navigation, and client-side route guard. It includes authentication, product CRUD, order management (status updates), user management (read + delete), and a dashboard overview with stats and charts.

## Goals

- Provide a realistic admin experience for demo/portfolio purposes
- Keep all data client-side (Zustand + persist) — no backend required
- Follow existing VESTIRE design system (navy/gold/cream palette, Cormorant Garamond headings)
- Reuse existing patterns from `cart-store.ts` for consistency

## Non-Goals (Out of Scope)

- Real image upload (file storage). Upload button present but disabled with "Coming soon" tooltip. Image field accepts URL string only.
- Pagination or search on tables (mock data volume small)
- Admin role management or multiple admin accounts (single hardcoded admin only)
- Email notifications or any external integration
- Mobile-optimized admin UI (desktop-first; tablet acceptable)
- Automated tests (no test framework currently in project — manual verification only)

## Tech Decisions

- **State:** Zustand + `persist` middleware (same pattern as `cart-store.ts`)
- **Routing:** Next.js App Router, separate `/admin/*` route segment with own layout
- **Auth:** Client-side guard component (`<AdminGuard>`) in admin layout; redirects to `/admin/login` if unauthenticated
- **Credentials:** Single hardcoded admin: `admin@vestire.com` / `admin123`, displayed on login page in a demo-credentials info box
- **Charts:** Add `recharts` dependency for sales chart on dashboard
- **Styling:** Tailwind CSS v4 + existing CSS variables from `globals.css`

## Architecture

### New Files

```
src/
  app/admin/
    layout.tsx                     # Admin layout: sidebar + topbar + <AdminGuard>
    login/page.tsx                 # Login page (demo creds displayed)
    dashboard/page.tsx             # Overview: stat cards + chart + recent activity
    products/
      page.tsx                     # Product list table
      new/page.tsx                 # Add product form
      [id]/edit/page.tsx           # Edit product form
    orders/
      page.tsx                     # Order list + status filter
      [id]/page.tsx                # Order detail + status update
    users/page.tsx                 # User list + delete action

  components/admin/
    admin-sidebar.tsx              # Left sidebar navigation
    admin-topbar.tsx               # Top bar with admin info + logout
    admin-guard.tsx                # Client-side route guard
    stat-card.tsx                  # Dashboard stat card
    sales-chart.tsx                # Recharts BarChart wrapper
    product-form.tsx               # Reusable add/edit product form
    order-status-badge.tsx         # Colored status pill
    data-table.tsx                 # Reusable table shell
    confirm-modal.tsx              # Confirmation dialog (delete, status change)

  stores/
    admin-auth-store.ts            # { admin, login, logout }
    product-store.ts               # { products, addProduct, updateProduct, deleteProduct, getById }
    order-store.ts                 # { orders, updateStatus, getById }
    user-store.ts                  # { users, deleteUser, getById }

  lib/admin-seeds.ts               # Seed data: mock orders, mock users, admin credentials

  types/admin.ts                   # Order, OrderItem, User, AdminUser types
```

### Files to Modify

- `src/types/index.ts` — extend `Product` with `image: string`, `description: string`, `stock: number`
- `src/lib/constants.ts` — populate new fields on existing `PRODUCTS` entries (placeholder image URLs, generated descriptions, mock stock values)
- `package.json` — add `recharts` dependency

## Data Models

### Product (updated)

```ts
interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice: number | null;
  category: "Men" | "Women" | "Unisex" | "Aksesoris";
  sizes: string[];
  colors: string[];
  badge: "NEW" | "BEST SELLER" | "SALE" | null;
  label: string;
  image: string;        // NEW — URL string; upload disabled
  description: string;  // NEW — product description
  stock: number;        // NEW — current stock count
}
```

### Order

```ts
type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

interface OrderItem {
  productId: number;
  productName: string;
  price: number;
  qty: number;
  size: string;
  color: string;
}

interface Order {
  id: string;                // "ORD-001", "ORD-002", ...
  userId: number;
  userName: string;
  userEmail: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  shippingAddress: string;
  paymentMethod: string;
  createdAt: string;         // ISO 8601
}
```

### User

```ts
interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  joinedAt: string;          // ISO 8601
  totalOrders: number;
  totalSpent: number;
}
```

### AdminUser

```ts
interface AdminUser {
  email: string;
  name: string;
}
```

## Stores

All stores use Zustand with `persist` middleware (pattern from `cart-store.ts`).

### admin-auth-store

- Key: `vestire-admin-auth`
- State: `{ admin: AdminUser | null }`
- Actions:
  - `login(email, password)` — checks against hardcoded credentials in `admin-seeds.ts`; on match, sets `admin` and returns `true`; otherwise returns `false`
  - `logout()` — clears `admin`

### product-store

- Key: `vestire-products`
- State: `{ products: Product[] }`
- Seed: on first hydration (empty), populate from `PRODUCTS` constant
- Actions:
  - `addProduct(data)` — assigns next id, adds to list
  - `updateProduct(id, data)` — replaces by id
  - `deleteProduct(id)` — removes by id
  - `getById(id)` — returns product or undefined

### order-store

- Key: `vestire-orders`
- State: `{ orders: Order[] }`
- Seed: on first hydration, populate from mock data in `admin-seeds.ts`
- Actions:
  - `updateStatus(id, status)` — updates order status
  - `getById(id)` — returns order or undefined

### user-store

- Key: `vestire-users`
- State: `{ users: User[] }`
- Seed: on first hydration, populate from mock data in `admin-seeds.ts`
- Actions:
  - `deleteUser(id)` — removes by id
  - `getById(id)` — returns user or undefined

**Seeding pattern:** set the store's initial state to the seed data. Zustand `persist` hydrates saved state from localStorage on mount; if there's no saved state (first visit), the initial seed remains. This is the simplest pattern — no flag, no useEffect.

For admin-auth-store: initial state is `{ admin: null }` (no seed needed).
For product-store: initial state is `{ products: PRODUCTS }` (seeded from constants).
For order-store and user-store: initial state is `{ orders: SEED_ORDERS }` / `{ users: SEED_USERS }` from `admin-seeds.ts`.

## Auth Flow

1. User navigates to any `/admin/*` route
2. `src/app/admin/layout.tsx` renders `<AdminGuard>` as a wrapper
3. `<AdminGuard>` reads `admin` from `admin-auth-store`
   - If `admin === null` and current path is not `/admin/login` → `router.replace("/admin/login")`
   - If `admin` exists and path is `/admin/login` → `router.replace("/admin/dashboard")`
   - Otherwise render children
4. Login page form submits to `login(email, password)` action
5. Success → redirect to `/admin/dashboard`
6. Failure → show inline error message
7. Logout button in topbar → call `logout()` → redirect to `/admin/login`

**Hardcoded credentials (in `admin-seeds.ts`):**
- Email: `admin@vestire.com`
- Password: `admin123`
- Name: `Admin VESTIRE`

## Pages

### `/admin/login`

- Centered card (max-w 420px), cream background
- VESTIRE logo on top
- Heading: "Admin Portal"
- Form: email input, password input (with show/hide toggle), submit button
- Info box above form: "🔑 Demo: admin@vestire.com / admin123"
- Error message inline below inputs on failed login

### `/admin/dashboard`

- **Stat cards (6, grid-cols-3 md, grid-cols-2 sm):**
  - Total Produk (count from product-store)
  - Total Order (count from order-store)
  - Total User (count from user-store)
  - Revenue (sum of order totals where status is `delivered`)
  - Out of Stock (count of products where `stock === 0`)
  - Pending Orders (count of orders where `status === "pending"`)
- **Sales chart:** recharts `BarChart`, mock data for 6 months (Nov 2025 – Apr 2026), y-axis = revenue in Rp
- **Two-column bottom section:**
  - Recent Orders: mini table of 5 latest orders (id, customer, total, status, date), "View all" link to `/admin/orders`
  - Low Stock Products: list of products where `stock < 10`, shows name + current stock + "Edit" link

### `/admin/products`

- Header: "Produk" heading + "Tambah Produk" button (→ `/admin/products/new`)
- Table columns: thumbnail (40x40, object-cover) | nama | kategori | harga | stock | badge | actions
- Actions: Edit (link) | Delete (opens `<ConfirmModal>`)

### `/admin/products/new` and `/admin/products/[id]/edit`

- Shared form (`<ProductForm>`) with mode prop (`"create" | "edit"`)
- Fields:
  - Image: URL text input + live preview + "Upload" button disabled with tooltip "Coming soon — simpan URL gambar saja"
  - Name (text, required)
  - Description (textarea, required)
  - Price (number, required)
  - Original Price (number, optional — for sale display)
  - Category (select: Men/Women/Unisex/Aksesoris)
  - Sizes (multi-select chips — preset options: XS, S, M, L, XL, 2XL, 3XL, 28, 30, 32, 34, 36, One Size)
  - Colors (chip input — user types + adds)
  - Badge (select: none/NEW/BEST SELLER/SALE)
  - Stock (number, required, min 0)
- Submit → add or update → redirect to `/admin/products`
- Cancel button → back to `/admin/products`

### `/admin/orders`

- Header: "Order" heading + status filter dropdown (All / Pending / Processing / Shipped / Delivered / Cancelled)
- Table: order ID | customer name | date | total | status badge | "Lihat detail" link (→ `/admin/orders/[id]`)

### `/admin/orders/[id]`

- Breadcrumb: Orders / ORD-XXX
- Customer info card (name, email, phone-if-available, shipping address)
- Items table (thumbnail, product name, size, color, qty, price, subtotal)
- Totals panel (subtotal, shipping, total)
- Payment method info
- Status dropdown + "Update Status" button → opens `<ConfirmModal>` with "Ubah status ke X?" → on confirm, calls `updateStatus(id, newStatus)`

### `/admin/users`

- Header: "Pengguna"
- Table: name | email | phone | joined (formatted date) | total orders | total spent | Delete action
- Delete → `<ConfirmModal>` with "Hapus user X?" → on confirm, calls `deleteUser(id)`

## Layout

### Admin Layout (`src/app/admin/layout.tsx`)

```
┌─────────────────────────────────────────────────┐
│ Sidebar (240px)   │ Topbar                      │
│ — navy-dark bg    │ — white bg, border-bottom   │
│ — gold active     ├─────────────────────────────┤
│                   │                             │
│ • Dashboard       │ Content (cream bg, p-8)     │
│ • Products        │                             │
│ • Orders          │                             │
│ • Users           │                             │
│                   │                             │
│ ──────────        │                             │
│ Logout            │                             │
└───────────────────┴─────────────────────────────┘
```

- Sidebar: fixed left, VESTIRE logo (Cormorant Garamond) at top, nav list with icons from `lucide-react` (LayoutDashboard, Package, ShoppingBag, Users, LogOut), active state with gold left border + gold text
- Topbar: page title (derived from pathname or passed via context), right side shows admin avatar initial + name + dropdown (Logout)
- Content area: cream bg, generous padding, card-based sections with white bg + subtle border

**Exception:** `/admin/login` should NOT render the sidebar/topbar chrome. Handle by checking pathname in layout — if `/admin/login`, render children only.

## Seed Data (admin-seeds.ts)

- **ADMIN_CREDENTIALS:** `{ email: "admin@vestire.com", password: "admin123", name: "Admin VESTIRE" }`
- **SEED_USERS:** 8 mock users with realistic Indonesian names, emails, phones, join dates ranging 2025-10 to 2026-03, varying `totalOrders` (0-12) and `totalSpent` (0-5M Rp)
- **SEED_ORDERS:** 15 mock orders
  - Spread across 6 months (Nov 2025 – Apr 2026) for realistic chart data
  - Mix of statuses: 3 pending, 2 processing, 3 shipped, 5 delivered, 2 cancelled
  - Items reference real product IDs from `PRODUCTS`
  - Shipping addresses: plausible Indonesian addresses
  - Payment methods drawn from existing `PAYMENT_OPTIONS` ids

## Error Handling

- Login failure → inline error "Email atau password salah"
- Form validation: required-field red border + error text (client-side, no form library needed)
- Empty states: "Belum ada produk" / "Belum ada order" / "Belum ada user" with illustrations or icon placeholders
- Delete confirmation: always required (no accidental deletes)

## Testing (Manual)

No test framework in project. Verification checklist:

1. Visit `/admin` → redirects to `/admin/login`
2. Login with wrong creds → shows error
3. Login with correct demo creds → redirects to `/admin/dashboard`
4. Dashboard renders 6 stat cards with non-zero values, chart visible, recent orders table shows rows, low stock list populated
5. Navigate to `/admin/products` → table shows all seeded products
6. Add new product → appears in table, persists after page refresh
7. Edit product → changes persist after refresh
8. Delete product (with confirm) → removed from table, persists
9. Navigate to `/admin/orders` → seed orders visible, filter by status works
10. Open order detail → info correct, update status with confirm → status badge updates in list
11. Navigate to `/admin/users` → seed users visible; delete user with confirm
12. Click logout → redirects to `/admin/login`, store cleared
13. Refresh page after logout → remains on login, cannot access `/admin/*` routes without auth

## Dependencies to Add

```json
{
  "recharts": "^2.x"
}
```

Install via `npm install recharts`.

## Open Questions

None at time of writing. All scope decisions captured above.
