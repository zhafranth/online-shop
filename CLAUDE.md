# VESTIRE - Online Shop Web Application

## Project Overview
VESTIRE is an online clothing shop web application targeting unisex audiences. The design follows a minimalist & elegant aesthetic with a dark & luxurious color palette (navy, black, gold).

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 + custom CSS variables for design tokens
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: NextAuth.js v5
- **State Management**: Zustand (client-side cart/UI state)
- **UI Icons**: Lucide React
- **Fonts**: Cormorant Garamond (serif headings) + DM Sans (sans-serif body)

## Design System

### Color Tokens
```
--navy-dark: #0d1526
--navy: #1a2744
--navy-mid: #243352
--gold: #c9a84c
--gold-light: #e8d5a3
--gold-pale: #f7f0e0
--cream: #f5f0e8
--white: #faf9f7
--gray-dark: #3a3a4a
--gray: #888
--gray-light: #ccc
--border: #e2ddd4
--text: #1a1a2a
```

### Typography
- Headings: `Cormorant Garamond` (serif), weight 300-700
- Body: `DM Sans` (sans-serif), weight 300-600
- Base font size: 15px, line-height: 1.6

### Design Patterns
- Buttons: uppercase, letter-spacing 0.08em, 13px font
- Badges: 10px, uppercase, letter-spacing 0.12em
- Cards: hover scale effect on images (1.04)
- Forms: 1.5px border, 12px 16px padding
- Animations: fadeUp (0.4s ease), ticker (25s linear infinite)

## Pages
1. **Homepage** - Split hero + lookbook mosaic + gender banner + new arrivals + USP strip
2. **Catalog** - Sidebar filter (category, size, price range, color) + product grid + sort
3. **Product Detail** - Image gallery + color/size selector + inline size guide + tabs (description, material, reviews)
4. **Cart** - Progress steps + item list + voucher code + sticky total bar
5. **Checkout** - Accordion (address, shipping, payment) + order summary + success screen
6. **Login/Register** - Split screen (brand panel + form panel) with tab toggle

## Project Structure
```
src/
  app/                    # Next.js App Router pages
    (auth)/               # Auth pages (login/register)
    (shop)/               # Shop pages (home, catalog, detail, cart, checkout)
    api/                  # API routes
    layout.tsx            # Root layout
    globals.css           # Global styles + design tokens
  components/
    ui/                   # Reusable UI components (Button, Badge, Input, etc.)
    layout/               # Layout components (Navbar, Footer)
    home/                 # Homepage sections
    catalog/              # Catalog page components
    product/              # Product detail components
    cart/                 # Cart components
    checkout/             # Checkout components
  lib/
    db.ts                 # Prisma client
    auth.ts               # NextAuth config
    utils.ts              # Utility functions (price formatter, etc.)
  stores/
    cart.ts               # Zustand cart store
  types/
    index.ts              # TypeScript type definitions
prisma/
  schema.prisma           # Database schema
```

## Conventions
- Use Indonesian (Bahasa Indonesia) for all user-facing text
- Currency format: `Rp X.XXX` using `id-ID` locale
- Component files: PascalCase (e.g., `ProductCard.tsx`)
- Utility files: camelCase (e.g., `formatPrice.ts`)
- Use `"use client"` directive only when client interactivity is needed
- Prefer Server Components by default
- All images use Next.js `<Image>` component with placeholder patterns until real images are added

## Commands
```bash
npm run dev       # Start development server
npm run build     # Production build
npm run lint      # ESLint
npx prisma studio # Database GUI
npx prisma db push # Push schema to database
```
