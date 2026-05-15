# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**ThickApparel** — an online clothing shop (unisex). All user-facing copy is **Indonesian (Bahasa Indonesia)**. Currency is rendered with `formatPrice()` (`Rp X.XXX`, `id-ID` locale) in `src/lib/utils.ts`.

## Tech Stack

- **Next.js 15.5** (App Router) + **React 19.2** + **TypeScript** (strict)
- **Tailwind CSS v4** — design tokens declared with the `@theme` directive in `src/app/globals.css`. There is no `tailwind.config` file.
- **Zustand 5** (with `persist` middleware) for all client state
- **Lucide React** for icons, **Recharts** for the admin dashboard chart
- **No backend, no DB, no auth provider.** Despite what older notes may suggest, this project does not use Prisma, PostgreSQL, or NextAuth. There is no `prisma/`, no `src/lib/db.ts`, no `src/lib/auth.ts`, no `/api` route handlers.

> **Heads-up (from `AGENTS.md`):** Next.js 15 has breaking changes from older training data. Consult `node_modules/next/dist/docs/` before writing non-obvious Next.js code, and heed deprecation notices.

## Commands

```bash
npm run dev      # next dev
npm run build    # next build
npm run start    # next start
npm run lint     # eslint (flat config in eslint.config.mjs)
```

There are no tests configured.

## Architecture: data flow

This is a **frontend-only prototype**. There is no API layer — instead:

1. **Seed data** lives in plain TS modules:
   - `src/lib/constants.ts` — `PRODUCTS`, `SHIPPING_OPTIONS`, `PAYMENT_OPTIONS`, `SIZE_GUIDE`
   - `src/lib/admin-seeds.ts` — `ADMIN_CREDENTIALS`, `SEED_USERS`, `SEED_ORDERS`
2. **Zustand stores** in `src/stores/` hydrate from those seeds, expose CRUD-style actions, and persist to `localStorage` under keys prefixed `thickapparel-*`:
   - `cart-store.ts` (`thickapparel-cart`) — shopping cart, toast queue
   - `product-store.ts` (`thickapparel-products`) — product catalog (admin can add/edit/delete)
   - `order-store.ts` (`thickapparel-orders`) — orders + status updates
   - `user-store.ts` (`thickapparel-users`) — registered customers
   - `admin-auth-store.ts` (`thickapparel-admin-auth`) — admin session
3. All store files are `"use client"` and use `persist` with `partialize` to keep only the data slice (not the action methods).

When changing a data shape, update the corresponding seed and the matching type in `src/types/index.ts` (storefront) or `src/types/admin.ts` (admin) together — they are the schema-of-record.

## Architecture: routing

Flat App Router layout under `src/app/` — **no `(auth)` or `(shop)` route groups** despite what older notes claim:

| Path                              | Purpose                                   |
| --------------------------------- | ----------------------------------------- |
| `/`                               | Homepage (hero, new arrivals, USP, etc.)  |
| `/catalog`                        | Product grid + sidebar filters            |
| `/product/[id]`                   | Product detail                            |
| `/cart`, `/checkout`              | Cart + checkout flow                      |
| `/login`                          | Storefront login/register (split screen)  |
| `/admin/login`                    | Admin login                               |
| `/admin/dashboard`                | Sales chart, stat cards (Recharts)        |
| `/admin/products`, `.../new`, `.../[id]/edit` | Product CRUD                  |
| `/admin/orders`, `.../[id]`       | Order list + detail / status updates      |
| `/admin/users`                    | Customer list                             |

### Admin auth gate

`src/app/admin/layout.tsx` wraps every `/admin/*` route in `<AdminGuard>` (`src/components/admin/admin-guard.tsx`). The guard reads `useAdminAuthStore` and:
- redirects unauthenticated visitors to `/admin/login`
- redirects authenticated admins away from `/admin/login` to `/admin/dashboard`

Credentials are **hardcoded** in `src/lib/admin-seeds.ts` (`admin@thickapparel.com` / `admin123`) — there is no real auth, just a localStorage flag. Don't add real-secret logic on top of this without first replacing the auth layer.

## Design system

Tokens are defined in `src/app/globals.css` inside `@theme`. The palette names (`navy`, `gold`, `cream`, etc.) are **legacy** — they map to a neutral grayscale (`gold` is now `#0a0a0a`, `navy-dark` is `#0a0a0a`, etc.) so existing class names keep working without a global rename. **Do not assume colors from the names** — always check `globals.css`.

- Fonts: `Cormorant Garamond` (serif headings), `DM Sans` (sans body) — loaded via `next/font/google` in `src/app/layout.tsx` and exposed as CSS vars (`--font-cormorant`, `--font-dm-sans`).
- Container utility: `.container-site` (max-width 1280px, padding 40px / 16px mobile).
- Animations defined in `globals.css`: `fadeUp`, `ticker`, `toastIn`, `toastOut`.
- Reusable primitives in `src/components/ui/` — `Button`, `Badge`, `Input`, `Tag`, `StepBar`, `Toast`, `PlaceholderImage`. Prefer these over hand-rolled equivalents.
- `PlaceholderImage` renders a striped placeholder when `src` is omitted; otherwise a `next/image` with `fill`. Use it instead of bare `<Image>` for product/lookbook slots.

## Conventions

- TypeScript path alias: `@/*` → `./src/*`
- Component files: kebab-case (e.g. `product-form.tsx`, `admin-sidebar.tsx`) — older notes saying PascalCase are wrong, the actual codebase is kebab-case.
- Default to **Server Components**; add `"use client"` only when needed (interactivity, Zustand, hooks).
- All product/lookbook images are remote Unsplash URLs. The hostname `images.unsplash.com` is allowlisted in `next.config.ts` — add new remote hosts there if needed.
- Mock-data identifiers: products use numeric `id`, orders use `ORD-XXX` strings.
