# VESTIRE Online Shop Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a complete Next.js online clothing shop (VESTIRE) matching the Claude Design prototype pixel-perfectly, with 6 pages: Home, Catalog, Product Detail, Cart, Checkout, and Login/Register.

**Architecture:** Next.js 15 App Router with TypeScript. Server Components by default, `"use client"` only for interactive components. Zustand for cart state persisted to localStorage. Tailwind CSS v4 with custom theme tokens matching the design system (navy/gold/cream palette). Prisma + PostgreSQL for product data, NextAuth v5 for authentication.

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS v4, Zustand, Prisma, PostgreSQL, NextAuth.js v5, Lucide React

---

## File Structure

```
online-shop/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout (fonts, metadata)
│   │   ├── globals.css             # Tailwind imports + CSS custom properties
│   │   ├── page.tsx                # Homepage
│   │   ├── catalog/
│   │   │   └── page.tsx            # Catalog page
│   │   ├── product/
│   │   │   └── [id]/
│   │   │       └── page.tsx        # Product detail page
│   │   ├── cart/
│   │   │   └── page.tsx            # Cart page
│   │   ├── checkout/
│   │   │   └── page.tsx            # Checkout page
│   │   └── login/
│   │       └── page.tsx            # Login/Register page
│   ├── components/
│   │   ├── ui/
│   │   │   ├── button.tsx          # Button variants (primary, gold, outline)
│   │   │   ├── badge.tsx           # Badge component
│   │   │   ├── input.tsx           # Form input
│   │   │   ├── tag.tsx             # Tag/chip for filters & size selection
│   │   │   ├── placeholder-image.tsx # Placeholder image pattern
│   │   │   ├── step-bar.tsx        # Checkout progress steps
│   │   │   └── toast.tsx           # Toast notification
│   │   ├── layout/
│   │   │   ├── navbar.tsx          # Top navigation bar
│   │   │   ├── footer.tsx          # Site footer
│   │   │   └── ticker.tsx          # Scrolling announcement ticker
│   │   ├── home/
│   │   │   ├── hero-section.tsx    # Split hero (left copy + right image)
│   │   │   ├── editors-picks.tsx   # Mosaic product grid
│   │   │   ├── gender-banner.tsx   # For Him / For Her split banner
│   │   │   ├── new-arrivals.tsx    # New arrivals product grid
│   │   │   └── usp-strip.tsx       # USP icons strip
│   │   ├── catalog/
│   │   │   ├── sidebar-filter.tsx  # Sidebar with category, size, price, color filters
│   │   │   ├── product-grid.tsx    # Product grid with sort
│   │   │   └── active-filters.tsx  # Active filter chips
│   │   ├── product/
│   │   │   ├── image-gallery.tsx   # Main image + thumbnails
│   │   │   ├── product-info.tsx    # Price, color, size, qty, CTA
│   │   │   ├── size-guide.tsx      # Inline size guide table
│   │   │   ├── product-tabs.tsx    # Description, Material, Reviews tabs
│   │   │   └── related-products.tsx # Related products grid
│   │   ├── cart/
│   │   │   ├── cart-item.tsx       # Single cart item row
│   │   │   ├── voucher-input.tsx   # Voucher code input
│   │   │   ├── cart-recommendations.tsx # "Complete your look" section
│   │   │   └── cart-sticky-bar.tsx # Sticky bottom total bar
│   │   ├── checkout/
│   │   │   ├── address-section.tsx # Address accordion section
│   │   │   ├── shipping-section.tsx # Shipping method accordion
│   │   │   ├── payment-section.tsx # Payment method accordion
│   │   │   ├── order-summary.tsx   # Right sidebar order summary
│   │   │   └── order-success.tsx   # Order success screen
│   │   └── login/
│   │       ├── brand-panel.tsx     # Left brand panel
│   │       ├── login-form.tsx      # Login form
│   │       └── register-form.tsx   # Register form
│   ├── lib/
│   │   ├── utils.ts                # formatPrice, cn helper
│   │   └── constants.ts            # Product seed data, shipping/payment options
│   ├── stores/
│   │   └── cart-store.ts           # Zustand cart store with localStorage persistence
│   └── types/
│       └── index.ts                # Product, CartItem, etc. type definitions
├── public/
│   └── (placeholder for future images)
├── tailwind.config.ts              # Tailwind theme with VESTIRE design tokens
├── next.config.ts                  # Next.js config
├── tsconfig.json
├── package.json
└── CLAUDE.md
```

---

## Task 1: Scaffold Next.js Project & Install Dependencies

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`
- Create: `src/app/layout.tsx`, `src/app/globals.css`, `src/app/page.tsx`

- [ ] **Step 1: Create Next.js project**

```bash
cd "/Users/zhafrantharif/Documents/Others Project/online-shop"
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --no-turbopack
```

Expected: Project scaffolded with `src/app/` structure.

- [ ] **Step 2: Install additional dependencies**

```bash
npm install zustand lucide-react clsx
```

- [ ] **Step 3: Initialize git repository**

```bash
git init
git add -A
git commit -m "chore: scaffold Next.js 15 project with TypeScript and Tailwind CSS"
```

---

## Task 2: Configure Tailwind Theme & Global Styles

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Configure Tailwind with VESTIRE design tokens**

Replace `tailwind.config.ts`:

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#1a2744",
          dark: "#0d1526",
          mid: "#243352",
        },
        gold: {
          DEFAULT: "#c9a84c",
          light: "#e8d5a3",
          pale: "#f7f0e0",
        },
        cream: "#f5f0e8",
        site: {
          white: "#faf9f7",
          text: "#1a1a2a",
          border: "#e2ddd4",
          gray: {
            DEFAULT: "#888",
            dark: "#3a3a4a",
            light: "#ccc",
          },
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      keyframes: {
        ticker: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        toastIn: {
          from: { opacity: "0", bottom: "60px" },
          to: { opacity: "1", bottom: "80px" },
        },
        toastOut: {
          from: { opacity: "1" },
          to: { opacity: "0" },
        },
      },
      animation: {
        ticker: "ticker 25s linear infinite",
        "fade-up": "fadeUp 0.4s ease forwards",
        "toast-in": "toastIn 0.3s ease",
        "toast-out": "toastOut 0.3s ease 2s forwards",
      },
    },
  },
  plugins: [],
};
export default config;
```

- [ ] **Step 2: Write global CSS**

Replace `src/app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    background: #faf9f7;
    color: #1a1a2a;
    font-size: 15px;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
  }

  h1, h2, h3, h4 {
    font-family: var(--font-serif);
    font-weight: 600;
    line-height: 1.2;
  }

  h1 { font-size: clamp(2rem, 5vw, 4rem); }
  h2 { font-size: clamp(1.5rem, 3vw, 2.5rem); }
  h3 { font-size: 1.3rem; }

  /* Scrollbar */
  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: #f5f0e8; }
  ::-webkit-scrollbar-thumb { background: #e8d5a3; border-radius: 3px; }
}

@layer components {
  .container-site {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 40px;
  }

  @media (max-width: 768px) {
    .container-site {
      padding: 0 16px;
    }
  }
}
```

- [ ] **Step 3: Configure root layout with fonts**

Replace `src/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "VESTIRE - Mode Terpilih Untuk Semua",
  description:
    "Koleksi fashion premium dengan kualitas terbaik. Kemeja, dress, outer, dan aksesoris untuk pria & wanita.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
```

- [ ] **Step 4: Create minimal homepage placeholder**

Replace `src/app/page.tsx`:

```tsx
export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="font-serif text-4xl text-navy">VESTIRE</h1>
    </div>
  );
}
```

- [ ] **Step 5: Verify dev server runs**

```bash
npm run dev
```

Open `http://localhost:3000` — should show "VESTIRE" in serif font with navy color.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: configure Tailwind theme with VESTIRE design tokens and global styles"
```

---

## Task 3: Types, Utils & Constants

**Files:**
- Create: `src/types/index.ts`
- Create: `src/lib/utils.ts`
- Create: `src/lib/constants.ts`

- [ ] **Step 1: Define TypeScript types**

Create `src/types/index.ts`:

```typescript
export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice: number | null;
  category: "Men" | "Women" | "Unisex" | "Aksesoris";
  sizes: string[];
  colors: string[];
  badge: "NEW" | "BEST SELLER" | "SALE" | null;
  label: string;
}

export interface CartItem extends Product {
  selectedSize: string;
  selectedColor: string;
  qty: number;
}

export interface ShippingOption {
  id: string;
  label: string;
  description: string;
  price: number;
}

export interface PaymentOption {
  id: string;
  label: string;
  description: string;
  icon: string;
}
```

- [ ] **Step 2: Create utility functions**

Create `src/lib/utils.ts`:

```typescript
import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatPrice(price: number): string {
  return "Rp " + price.toLocaleString("id-ID");
}
```

- [ ] **Step 3: Create constants (product data, shipping, payment options)**

Create `src/lib/constants.ts`:

```typescript
import { Product, ShippingOption, PaymentOption } from "@/types";

export const PRODUCTS: Product[] = [
  { id: 1, name: "Kemeja Linen Premium", price: 285000, originalPrice: 350000, category: "Men", sizes: ["S", "M", "L", "XL", "2XL"], colors: ["Navy", "Krem", "Putih"], badge: "NEW", label: "kemeja pria linen" },
  { id: 2, name: "Dress Maxi Batik Modern", price: 425000, originalPrice: null, category: "Women", sizes: ["S", "M", "L", "XL", "2XL"], colors: ["Navy", "Hitam"], badge: "BEST SELLER", label: "dress maxi wanita" },
  { id: 3, name: "Outer Blazer Minimalis", price: 520000, originalPrice: 650000, category: "Unisex", sizes: ["S", "M", "L", "XL"], colors: ["Hitam", "Camel"], badge: "SALE", label: "outer blazer unisex" },
  { id: 4, name: "Celana Kulot Premium", price: 198000, originalPrice: null, category: "Women", sizes: ["S", "M", "L", "XL", "2XL", "3XL"], colors: ["Hitam", "Navy", "Krem"], badge: null, label: "celana kulot wanita" },
  { id: 5, name: "Kaos Oversize Washed", price: 149000, originalPrice: 185000, category: "Unisex", sizes: ["S", "M", "L", "XL", "2XL"], colors: ["Hitam", "Putih", "Abu"], badge: "NEW", label: "kaos oversize unisex" },
  { id: 6, name: "Rok A-Line Plisket", price: 235000, originalPrice: null, category: "Women", sizes: ["S", "M", "L", "XL"], colors: ["Krem", "Hitam", "Mauve"], badge: null, label: "rok a-line wanita" },
  { id: 7, name: "Jaket Bomber Kasual", price: 390000, originalPrice: 480000, category: "Men", sizes: ["S", "M", "L", "XL"], colors: ["Hitam", "Olive"], badge: "SALE", label: "jaket bomber pria" },
  { id: 8, name: "Set Koordinat Linen", price: 475000, originalPrice: null, category: "Women", sizes: ["S", "M", "L", "XL", "2XL"], colors: ["Krem", "Biru Muda"], badge: "NEW", label: "set koordinat linen" },
  { id: 9, name: "Kemeja Flannel Pria", price: 225000, originalPrice: null, category: "Men", sizes: ["S", "M", "L", "XL", "2XL"], colors: ["Navy", "Merah", "Hijau"], badge: null, label: "kemeja flannel pria" },
  { id: 10, name: "Dress Midi Crinkle", price: 315000, originalPrice: 380000, category: "Women", sizes: ["S", "M", "L", "XL"], colors: ["Hitam", "Terracotta"], badge: "SALE", label: "dress midi wanita" },
  { id: 11, name: "Celana Chino Slim", price: 275000, originalPrice: null, category: "Men", sizes: ["28", "30", "32", "34", "36"], colors: ["Krem", "Navy", "Abu"], badge: null, label: "celana chino pria" },
  { id: 12, name: "Scarf Premium Voile", price: 89000, originalPrice: null, category: "Aksesoris", sizes: ["One Size"], colors: ["Hitam", "Krem", "Mauve"], badge: "NEW", label: "scarf voile" },
];

export const SHIPPING_OPTIONS: ShippingOption[] = [
  { id: "jne", label: "JNE REG", description: "Estimasi 2–3 hari kerja", price: 15000 },
  { id: "jnt", label: "J&T Express", description: "Estimasi 2–4 hari kerja", price: 12000 },
  { id: "sicepat", label: "SiCepat HEMAT", description: "Estimasi 3–5 hari kerja", price: 9000 },
  { id: "gosend", label: "GoSend Same Day", description: "Tiba hari ini (area tertentu)", price: 35000 },
];

export const PAYMENT_OPTIONS: PaymentOption[] = [
  { id: "transfer", label: "Transfer Bank", description: "BCA, Mandiri, BNI, BRI", icon: "🏦" },
  { id: "gopay", label: "GoPay / OVO", description: "Bayar via dompet digital", icon: "📱" },
  { id: "cc", label: "Kartu Kredit / Debit", description: "Visa, Mastercard, JCB", icon: "💳" },
  { id: "cod", label: "Bayar di Tempat (COD)", description: "Khusus area tertentu", icon: "🤝" },
  { id: "paylater", label: "Kredivo / Akulaku", description: "Cicilan 0%", icon: "📋" },
];

export const SIZE_GUIDE = [
  { size: "XS", dada: "76–80", pinggang: "58–62", panggul: "84–88", tinggi: "150–155" },
  { size: "S", dada: "80–84", pinggang: "62–66", panggul: "88–92", tinggi: "155–160" },
  { size: "M", dada: "85–89", pinggang: "67–71", panggul: "93–97", tinggi: "158–163" },
  { size: "L", dada: "90–94", pinggang: "72–76", panggul: "98–102", tinggi: "160–165" },
  { size: "XL", dada: "95–100", pinggang: "77–82", panggul: "103–108", tinggi: "162–167" },
  { size: "2XL", dada: "101–106", pinggang: "83–88", panggul: "109–114", tinggi: "163–168" },
];
```

- [ ] **Step 4: Commit**

```bash
git add src/types src/lib
git commit -m "feat: add TypeScript types, utils, and product/config constants"
```

---

## Task 4: Zustand Cart Store

**Files:**
- Create: `src/stores/cart-store.ts`

- [ ] **Step 1: Create cart store with localStorage persistence**

Create `src/stores/cart-store.ts`:

```typescript
"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem } from "@/types";

interface CartStore {
  items: CartItem[];
  toast: string | null;
  addItem: (item: CartItem) => void;
  updateQty: (index: number, qty: number) => void;
  removeItem: (index: number) => void;
  clearCart: () => void;
  showToast: (message: string) => void;
  dismissToast: () => void;
  totalItems: () => number;
  subtotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      toast: null,

      addItem: (item) => {
        const { items } = get();
        const existingIndex = items.findIndex(
          (c) =>
            c.id === item.id &&
            c.selectedSize === item.selectedSize &&
            c.selectedColor === item.selectedColor
        );

        if (existingIndex >= 0) {
          const updated = items.map((c, i) =>
            i === existingIndex ? { ...c, qty: c.qty + item.qty } : c
          );
          set({ items: updated });
        } else {
          set({ items: [...items, item] });
        }

        get().showToast(`✓ ${item.name} ditambahkan ke keranjang`);
      },

      updateQty: (index, qty) => {
        set({
          items: get().items.map((c, i) =>
            i === index ? { ...c, qty } : c
          ),
        });
      },

      removeItem: (index) => {
        set({ items: get().items.filter((_, i) => i !== index) });
      },

      clearCart: () => set({ items: [] }),

      showToast: (message) => {
        set({ toast: message });
        setTimeout(() => set({ toast: null }), 2300);
      },

      dismissToast: () => set({ toast: null }),

      totalItems: () => get().items.reduce((sum, item) => sum + item.qty, 0),

      subtotal: () =>
        get().items.reduce((sum, item) => sum + item.price * item.qty, 0),
    }),
    {
      name: "vestire-cart",
      partialize: (state) => ({ items: state.items }),
    }
  )
);
```

- [ ] **Step 2: Commit**

```bash
git add src/stores
git commit -m "feat: add Zustand cart store with localStorage persistence"
```

---

## Task 5: Reusable UI Components

**Files:**
- Create: `src/components/ui/button.tsx`
- Create: `src/components/ui/badge.tsx`
- Create: `src/components/ui/input.tsx`
- Create: `src/components/ui/tag.tsx`
- Create: `src/components/ui/placeholder-image.tsx`
- Create: `src/components/ui/step-bar.tsx`
- Create: `src/components/ui/toast.tsx`

- [ ] **Step 1: Create Button component**

Create `src/components/ui/button.tsx`:

```tsx
import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "gold" | "outline" | "outline-white";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: "default" | "sm";
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-navy text-white hover:bg-navy-dark",
  gold: "bg-gold text-white hover:bg-[#b8963e]",
  outline: "bg-transparent border-[1.5px] border-navy text-navy hover:bg-navy hover:text-white",
  "outline-white":
    "bg-transparent border-[1.5px] border-white/60 text-white hover:border-white",
};

export function Button({
  variant = "primary",
  size = "default",
  fullWidth = false,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 font-sans font-medium uppercase tracking-[0.08em] border-none cursor-pointer transition-all duration-200 text-decoration-none",
        size === "default" ? "px-7 py-3 text-[13px]" : "px-[18px] py-2 text-xs",
        fullWidth && "w-full",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}
```

- [ ] **Step 2: Create Badge component**

Create `src/components/ui/badge.tsx`:

```tsx
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "navy";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-block text-[10px] font-semibold tracking-[0.12em] uppercase px-2.5 py-[3px]",
        variant === "navy"
          ? "bg-navy text-white border border-navy"
          : "border border-gold text-gold",
        className
      )}
    >
      {children}
    </span>
  );
}
```

- [ ] **Step 3: Create Input component**

Create `src/components/ui/input.tsx`:

```tsx
import { cn } from "@/lib/utils";
import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ label, className, id, ...props }: InputProps) {
  return (
    <div>
      {label && (
        <label
          htmlFor={id}
          className="block text-xs font-medium tracking-[0.06em] text-site-gray uppercase mb-1.5"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        className={cn(
          "w-full px-4 py-3 border-[1.5px] border-site-border bg-white font-sans text-sm text-site-text outline-none transition-colors duration-200",
          "focus:border-navy placeholder:text-site-gray-light",
          className
        )}
        {...props}
      />
    </div>
  );
}
```

- [ ] **Step 4: Create Tag component**

Create `src/components/ui/tag.tsx`:

```tsx
"use client";

import { cn } from "@/lib/utils";

interface TagProps {
  children: React.ReactNode;
  active?: boolean;
  activeVariant?: "navy" | "gold";
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

export function Tag({
  children,
  active = false,
  activeVariant = "navy",
  disabled = false,
  onClick,
  className,
}: TagProps) {
  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      className={cn(
        "inline-flex items-center px-3 py-[5px] text-xs font-medium border-[1.5px] border-site-border cursor-pointer transition-all duration-150 select-none tracking-[0.04em]",
        "hover:border-navy",
        active && activeVariant === "navy" && "bg-navy text-white border-navy",
        active && activeVariant === "gold" && "bg-gold text-white border-gold",
        disabled && "opacity-35 cursor-not-allowed line-through",
        className
      )}
    >
      {children}
    </button>
  );
}
```

- [ ] **Step 5: Create PlaceholderImage component**

Create `src/components/ui/placeholder-image.tsx`:

```tsx
import { cn } from "@/lib/utils";

interface PlaceholderImageProps {
  label?: string;
  className?: string;
}

export function PlaceholderImage({
  label = "foto produk",
  className,
}: PlaceholderImageProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center relative overflow-hidden",
        "bg-[repeating-linear-gradient(45deg,#e8e4da,#e8e4da_4px,#edeae2_4px,#edeae2_16px)]",
        className
      )}
    >
      <span className="font-mono text-[11px] text-[#999] text-center p-2 leading-relaxed whitespace-pre-line">
        {label}
      </span>
    </div>
  );
}
```

- [ ] **Step 6: Create StepBar component**

Create `src/components/ui/step-bar.tsx`:

```tsx
import { cn } from "@/lib/utils";

interface Step {
  label: string;
  status: "pending" | "active" | "done";
}

interface StepBarProps {
  steps: Step[];
}

export function StepBar({ steps }: StepBarProps) {
  return (
    <div className="flex items-center">
      {steps.map((step, i) => (
        <div key={step.label} className="contents">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold border-2 shrink-0",
                step.status === "active" && "bg-navy text-white border-navy",
                step.status === "done" && "bg-gold text-white border-gold",
                step.status === "pending" && "bg-white text-site-gray border-site-border"
              )}
            >
              {step.status === "done" ? "✓" : i + 1}
            </div>
            <span
              className={cn(
                "text-xs font-medium whitespace-nowrap",
                step.status === "active" ? "text-navy" : "text-site-gray"
              )}
            >
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={cn(
                "flex-1 h-px mx-2 min-w-5",
                step.status === "done" ? "bg-gold" : "bg-site-border"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 7: Create Toast component**

Create `src/components/ui/toast.tsx`:

```tsx
"use client";

import { useCartStore } from "@/stores/cart-store";

export function Toast() {
  const toast = useCartStore((state) => state.toast);

  if (!toast) return null;

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-navy text-white px-6 py-3 text-[13px] font-medium z-[9999] whitespace-nowrap animate-toast-in">
      {toast}
    </div>
  );
}
```

- [ ] **Step 8: Commit**

```bash
git add src/components/ui
git commit -m "feat: add reusable UI components (Button, Badge, Input, Tag, PlaceholderImage, StepBar, Toast)"
```

---

## Task 6: Layout Components (Navbar, Footer, Ticker)

**Files:**
- Create: `src/components/layout/navbar.tsx`
- Create: `src/components/layout/footer.tsx`
- Create: `src/components/layout/ticker.tsx`

- [ ] **Step 1: Create Navbar component**

Create `src/components/layout/navbar.tsx`:

```tsx
"use client";

import Link from "next/link";
import { Search, Heart, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/stores/cart-store";

const NAV_LINKS = [
  { label: "Men", href: "/catalog?cat=Men" },
  { label: "Women", href: "/catalog?cat=Women" },
  { label: "Unisex", href: "/catalog?cat=Unisex" },
  { label: "Sale", href: "/catalog?cat=Sale" },
];

export function Navbar() {
  const totalItems = useCartStore((state) => state.totalItems());

  return (
    <nav className="fixed top-0 left-0 right-0 z-[1000] bg-navy-dark border-b border-white/[0.08]">
      <div className="max-w-[1280px] mx-auto px-10 flex items-center h-[72px]">
        {/* Logo */}
        <Link
          href="/"
          className="font-serif text-[22px] font-bold text-gold tracking-[0.06em] mr-12 shrink-0 no-underline"
        >
          VESTIRE
        </Link>

        {/* Nav Links */}
        <div className="flex gap-8 flex-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-white/75 text-[13px] font-medium tracking-[0.1em] uppercase no-underline transition-colors duration-200 pb-0.5 border-b-[1.5px] border-transparent hover:text-white hover:border-gold"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Icons */}
        <div className="flex gap-5 items-center">
          <Search
            size={20}
            className="text-white/75 cursor-pointer hover:text-white transition-colors"
            strokeWidth={1.8}
          />
          <Heart
            size={20}
            className="text-white/75 cursor-pointer hover:text-white transition-colors"
            strokeWidth={1.8}
          />
          <Link href="/cart" className="relative">
            <ShoppingBag
              size={20}
              className="text-white/75 hover:text-white transition-colors"
              strokeWidth={1.8}
            />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-gold text-white w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
          <Link
            href="/login"
            className="text-white/75 text-xs tracking-[0.08em] uppercase font-medium no-underline hover:text-white transition-colors"
          >
            Masuk
          </Link>
        </div>
      </div>
    </nav>
  );
}
```

- [ ] **Step 2: Create Footer component**

Create `src/components/layout/footer.tsx`:

```tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="bg-navy-dark text-white/60 pt-[60px] pb-[30px]">
      <div className="container-site">
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="font-serif text-[28px] font-bold text-gold mb-3">
              VESTIRE
            </div>
            <p className="text-[13px] leading-[1.8] max-w-[260px]">
              Mode terpilih untuk semua. Kualitas premium, harga terjangkau,
              dikirim ke seluruh Indonesia.
            </p>
            <div className="flex gap-3 mt-5">
              {["IG", "TK", "FB", "YT"].map((s) => (
                <div
                  key={s}
                  className="w-9 h-9 border border-white/20 flex items-center justify-center text-[11px] cursor-pointer hover:border-gold hover:text-gold transition-colors"
                >
                  {s}
                </div>
              ))}
            </div>
          </div>

          {/* Belanja */}
          <div>
            <div className="text-[11px] font-semibold tracking-[0.12em] uppercase text-white mb-4">
              Belanja
            </div>
            {["Pria", "Wanita", "Unisex", "Sale", "New Arrivals"].map((t) => (
              <div
                key={t}
                className="text-[13px] mb-2 cursor-pointer hover:text-gold transition-colors"
              >
                {t}
              </div>
            ))}
          </div>

          {/* Bantuan */}
          <div>
            <div className="text-[11px] font-semibold tracking-[0.12em] uppercase text-white mb-4">
              Bantuan
            </div>
            {[
              "Panduan Ukuran",
              "Lacak Pesanan",
              "Retur & Refund",
              "FAQ",
              "Kontak Kami",
            ].map((t) => (
              <div
                key={t}
                className="text-[13px] mb-2 cursor-pointer hover:text-gold transition-colors"
              >
                {t}
              </div>
            ))}
          </div>

          {/* Newsletter */}
          <div>
            <div className="text-[11px] font-semibold tracking-[0.12em] uppercase text-white mb-4">
              Newsletter
            </div>
            <p className="text-xs mb-3">
              Dapatkan update koleksi & promo eksklusif.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="email kamu"
                className="flex-1 px-3 py-2.5 bg-white/[0.08] border border-white/15 text-white text-xs outline-none font-sans placeholder:text-white/40"
              />
              <Button
                variant="gold"
                size="sm"
                className="shrink-0 rounded-none px-3.5 py-2.5"
              >
                →
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex justify-between text-xs">
          <span>© 2026 VESTIRE. All rights reserved.</span>
          <span>Privacy Policy · Terms of Service</span>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 3: Create Ticker component**

Create `src/components/layout/ticker.tsx`:

```tsx
export function Ticker() {
  const text =
    "✦ FREE ONGKIR MIN. Rp200.000     ✦ NEW ARRIVALS EVERY WEEK     ✦ SIZE S – 4XL     ✦ RETUR 14 HARI     ✦ GARANSI KUALITAS     ";

  return (
    <div className="bg-gold text-white py-2 overflow-hidden whitespace-nowrap">
      <div className="inline-block animate-ticker text-xs font-medium tracking-[0.1em]">
        {text}
        {text}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/layout
git commit -m "feat: add layout components (Navbar, Footer, Ticker)"
```

---

## Task 7: Homepage

**Files:**
- Create: `src/components/home/hero-section.tsx`
- Create: `src/components/home/editors-picks.tsx`
- Create: `src/components/home/gender-banner.tsx`
- Create: `src/components/home/new-arrivals.tsx`
- Create: `src/components/home/usp-strip.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Create HeroSection component**

Create `src/components/home/hero-section.tsx`:

```tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlaceholderImage } from "@/components/ui/placeholder-image";

export function HeroSection() {
  return (
    <div className="grid grid-cols-2 min-h-[88vh]">
      {/* Left: copy */}
      <div className="bg-navy text-white flex flex-col justify-center p-[clamp(40px,6vw,100px)]">
        <div className="text-[11px] font-semibold tracking-[0.2em] uppercase text-gold mb-5">
          New Season 2026
        </div>
        <h1 className="font-serif font-light leading-[1.1] mb-4 text-[clamp(2.8rem,5vw,5rem)]">
          Tampil
          <br />
          <em className="italic text-gold">Percaya</em>
          <br />
          Diri
        </h1>
        <p className="text-[15px] text-white/65 max-w-[340px] leading-[1.8] mb-9">
          Koleksi terbaru kami menggabungkan kenyamanan modern dengan estetika
          yang timeless. Untuk setiap versi terbaik dirimu.
        </p>
        <div className="flex gap-3.5 flex-wrap">
          <Link href="/catalog">
            <Button variant="gold">Belanja Sekarang</Button>
          </Link>
          <Link href="/catalog?cat=Women">
            <Button variant="outline-white">Lihat Lookbook</Button>
          </Link>
        </div>
        {/* Stats */}
        <div className="flex gap-10 mt-[60px] pt-10 border-t border-white/[0.12]">
          {[
            ["500+", "Produk"],
            ["50K+", "Pelanggan"],
            ["4.9★", "Rating"],
          ].map(([val, label]) => (
            <div key={label}>
              <div className="font-serif text-[28px] font-semibold text-gold">
                {val}
              </div>
              <div className="text-[11px] tracking-[0.1em] uppercase text-white/50 mt-0.5">
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: hero image */}
      <PlaceholderImage
        label={"hero campaign\nmodel foto – full bleed"}
        className="h-full min-h-[88vh]"
      />
    </div>
  );
}
```

- [ ] **Step 2: Create EditorsPicks component**

Create `src/components/home/editors-picks.tsx`:

```tsx
import Link from "next/link";
import { PRODUCTS } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
import { PlaceholderImage } from "@/components/ui/placeholder-image";
import { Badge } from "@/components/ui/badge";

export function EditorsPicks() {
  const featured = [PRODUCTS[1], PRODUCTS[2], PRODUCTS[3]];

  return (
    <section className="py-20 bg-site-white">
      <div className="container-site">
        <div className="flex justify-between items-end mb-10">
          <div>
            <div className="text-[11px] tracking-[0.16em] uppercase text-gold mb-2">
              Pilihan Editor
            </div>
            <h2 className="font-serif font-normal">Koleksi Terkurasi</h2>
          </div>
          <Link
            href="/catalog"
            className="text-[13px] tracking-[0.08em] uppercase text-navy underline underline-offset-4 no-underline hover:underline"
          >
            Lihat Semua →
          </Link>
        </div>

        {/* Mosaic: 1 large + 2 stacked */}
        <div className="grid grid-cols-[1.5fr_1fr] gap-4 h-[560px]">
          {/* Large left */}
          <Link
            href={`/product/${featured[0].id}`}
            className="relative group cursor-pointer block"
          >
            <PlaceholderImage
              label={`${featured[0].label}\nfeatured large`}
              className="w-full h-full transition-transform duration-400 group-hover:scale-[1.04]"
            />
            <div className="absolute top-2.5 right-2.5 w-8 h-8 bg-white/90 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity">
              ♡
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[rgba(13,21,38,0.85)] to-transparent px-6 pb-5 pt-10">
              {featured[0].badge && (
                <Badge className="mb-2 border-gold text-gold">
                  {featured[0].badge}
                </Badge>
              )}
              <div className="font-serif text-[22px] text-white mb-1">
                {featured[0].name}
              </div>
              <div className="text-[13px] text-gold-light">
                {formatPrice(featured[0].price)}
              </div>
            </div>
          </Link>

          {/* Right: 2 stacked */}
          <div className="grid grid-rows-2 gap-4">
            {[featured[1], featured[2]].map((p) => (
              <Link
                key={p.id}
                href={`/product/${p.id}`}
                className="relative group cursor-pointer block"
              >
                <PlaceholderImage
                  label={p.label}
                  className="w-full h-full transition-transform duration-400 group-hover:scale-[1.04]"
                />
                <div className="absolute top-2.5 right-2.5 w-8 h-8 bg-white/90 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  ♡
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[rgba(13,21,38,0.8)] to-transparent px-4 pb-3.5 pt-6">
                  <div className="font-serif text-base text-white">
                    {p.name}
                  </div>
                  <div className="text-xs text-gold-light">
                    {formatPrice(p.price)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Create GenderBanner component**

Create `src/components/home/gender-banner.tsx`:

```tsx
import Link from "next/link";
import { PlaceholderImage } from "@/components/ui/placeholder-image";
import { Button } from "@/components/ui/button";

const BANNERS = [
  { label: "For Him", desc: "Koleksi pria terbaru", cat: "Men", overlay: "rgba(13,21,38,0.6)" },
  { label: "For Her", desc: "Koleksi wanita terkurasi", cat: "Women", overlay: "rgba(45,26,46,0.65)" },
];

export function GenderBanner() {
  return (
    <section className="grid grid-cols-2">
      {BANNERS.map(({ label, desc, cat, overlay }) => (
        <Link
          key={cat}
          href={`/catalog?cat=${cat}`}
          className="relative h-[380px] cursor-pointer overflow-hidden block group"
        >
          <PlaceholderImage
            label={`${cat.toLowerCase()} campaign`}
            className="absolute inset-0 w-full h-full"
          />
          <div
            className="absolute inset-0"
            style={{ background: overlay }}
          />
          <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center">
            <div className="text-[11px] tracking-[0.2em] uppercase text-gold mb-3">
              Koleksi {label.split(" ")[1]}
            </div>
            <h2 className="font-serif font-normal text-[40px] mb-2">
              {label}
            </h2>
            <p className="text-[13px] text-white/70 mb-7">{desc}</p>
            <Button variant="outline-white" size="sm">
              Explore →
            </Button>
          </div>
        </Link>
      ))}
    </section>
  );
}
```

- [ ] **Step 4: Create NewArrivals component**

Create `src/components/home/new-arrivals.tsx`:

```tsx
import Link from "next/link";
import { PRODUCTS } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
import { PlaceholderImage } from "@/components/ui/placeholder-image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function NewArrivals() {
  const newItems = PRODUCTS.filter((p) => p.badge === "NEW").slice(0, 4);

  return (
    <section className="py-20 bg-cream">
      <div className="container-site">
        <div className="text-center mb-12">
          <div className="text-[11px] tracking-[0.16em] uppercase text-gold mb-2">
            Terbaru
          </div>
          <h2 className="font-serif font-normal">New Arrivals</h2>
        </div>

        <div className="grid grid-cols-4 gap-6">
          {newItems.map((p) => (
            <Link
              key={p.id}
              href={`/product/${p.id}`}
              className="group cursor-pointer block no-underline text-site-text"
            >
              <div className="overflow-hidden relative">
                <PlaceholderImage
                  label={p.label}
                  className="w-full h-[280px] transition-transform duration-400 group-hover:scale-[1.04]"
                />
                <div className="absolute top-2.5 right-2.5 w-8 h-8 bg-white/90 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  ♡
                </div>
                {p.badge && (
                  <Badge variant="navy" className="absolute top-2.5 left-2.5">
                    {p.badge}
                  </Badge>
                )}
              </div>
              <div className="pt-3">
                <div className="font-serif text-base font-medium mb-1">
                  {p.name}
                </div>
                <div className="text-[13px] text-site-gray">
                  <span className="text-navy font-semibold text-sm">
                    {formatPrice(p.price)}
                  </span>
                  {p.originalPrice && (
                    <span className="line-through ml-1.5 text-xs">
                      {formatPrice(p.originalPrice)}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/catalog">
            <Button variant="primary">Lihat Semua Produk</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Create UspStrip component**

Create `src/components/home/usp-strip.tsx`:

```tsx
const USPS = [
  { icon: "🚚", title: "Free Ongkir", sub: "Min. belanja Rp 200.000" },
  { icon: "↩", title: "Retur 14 Hari", sub: "Tanpa pertanyaan" },
  { icon: "🔒", title: "Pembayaran Aman", sub: "SSL Encrypted" },
  { icon: "⭐", title: "Kualitas Terjamin", sub: "Garansi kepuasan" },
];

export function UspStrip() {
  return (
    <div className="bg-navy py-10">
      <div className="container-site">
        <div className="grid grid-cols-4 gap-6 text-center">
          {USPS.map(({ icon, title, sub }) => (
            <div key={title}>
              <div className="text-2xl mb-2">{icon}</div>
              <div className="font-serif text-base text-white mb-1">
                {title}
              </div>
              <div className="text-xs text-white/50">{sub}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Assemble Homepage**

Replace `src/app/page.tsx`:

```tsx
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Ticker } from "@/components/layout/ticker";
import { HeroSection } from "@/components/home/hero-section";
import { EditorsPicks } from "@/components/home/editors-picks";
import { GenderBanner } from "@/components/home/gender-banner";
import { NewArrivals } from "@/components/home/new-arrivals";
import { UspStrip } from "@/components/home/usp-strip";
import { Toast } from "@/components/ui/toast";

export default function HomePage() {
  return (
    <div className="min-h-screen pt-[72px] animate-fade-up">
      <Navbar />
      <Ticker />
      <HeroSection />
      <EditorsPicks />
      <GenderBanner />
      <NewArrivals />
      <UspStrip />
      <Footer />
      <Toast />
    </div>
  );
}
```

- [ ] **Step 7: Verify homepage renders correctly**

```bash
npm run dev
```

Open `http://localhost:3000` — should show full homepage with ticker, split hero, editors picks mosaic, gender banners, new arrivals grid, USP strip, and footer.

- [ ] **Step 8: Commit**

```bash
git add src/components/home src/app/page.tsx
git commit -m "feat: implement homepage with hero, editors picks, gender banners, new arrivals, and USP strip"
```

---

## Task 8: Catalog Page

**Files:**
- Create: `src/components/catalog/sidebar-filter.tsx`
- Create: `src/components/catalog/product-grid.tsx`
- Create: `src/components/catalog/active-filters.tsx`
- Create: `src/app/catalog/page.tsx`

- [ ] **Step 1: Create SidebarFilter component**

Create `src/components/catalog/sidebar-filter.tsx`:

```tsx
"use client";

import { Tag } from "@/components/ui/tag";
import { Button } from "@/components/ui/button";
import { PRODUCTS } from "@/lib/constants";

const CATEGORIES = ["Semua", "Men", "Women", "Unisex", "Aksesoris"];
const SIZES = ["S", "M", "L", "XL", "2XL", "3XL"];
const COLORS = [
  { name: "Hitam", hex: "#1a1a2a" },
  { name: "Navy", hex: "#1a2744" },
  { name: "Krem", hex: "#e8d9c0" },
  { name: "Putih", hex: "#f5f0e8" },
  { name: "Abu", hex: "#888" },
  { name: "Camel", hex: "#c19a6b" },
  { name: "Olive", hex: "#7a8c5a" },
  { name: "Mauve", hex: "#b08090" },
];

interface SidebarFilterProps {
  activeCat: string;
  activeSizes: string[];
  activeColors: string[];
  maxPrice: number;
  onCatChange: (cat: string) => void;
  onSizeToggle: (size: string) => void;
  onColorToggle: (color: string) => void;
  onPriceChange: (price: number) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
}

export function SidebarFilter({
  activeCat,
  activeSizes,
  activeColors,
  maxPrice,
  onCatChange,
  onSizeToggle,
  onColorToggle,
  onPriceChange,
  onReset,
  hasActiveFilters,
}: SidebarFilterProps) {
  return (
    <aside className="sticky top-[90px] self-start">
      {/* Category */}
      <div className="mb-8">
        <div className="text-[11px] font-semibold tracking-[0.14em] uppercase text-navy mb-3.5 pb-2.5 border-b border-site-border">
          Kategori
        </div>
        {CATEGORIES.map((c) => (
          <div
            key={c}
            onClick={() => onCatChange(c)}
            className={`py-2 text-sm cursor-pointer flex justify-between items-center border-b border-site-border ${
              activeCat === c
                ? "text-navy font-semibold"
                : "text-site-gray-dark font-normal"
            }`}
          >
            {c}
            <span className="text-[11px] text-site-gray">
              {PRODUCTS.filter((p) => c === "Semua" || p.category === c).length}
            </span>
          </div>
        ))}
      </div>

      {/* Size */}
      <div className="mb-8">
        <div className="text-[11px] font-semibold tracking-[0.14em] uppercase text-navy mb-3.5 pb-2.5 border-b border-site-border">
          Ukuran
        </div>
        <div className="flex flex-wrap gap-1.5">
          {SIZES.map((s) => (
            <Tag
              key={s}
              active={activeSizes.includes(s)}
              onClick={() => onSizeToggle(s)}
              className="min-w-[38px] justify-center text-xs"
            >
              {s}
            </Tag>
          ))}
        </div>
      </div>

      {/* Price */}
      <div className="mb-8">
        <div className="text-[11px] font-semibold tracking-[0.14em] uppercase text-navy mb-3.5 pb-2.5 border-b border-site-border">
          Harga
        </div>
        <input
          type="range"
          min={50}
          max={650}
          value={maxPrice}
          onChange={(e) => onPriceChange(+e.target.value)}
          className="w-full h-[3px] appearance-none outline-none bg-site-border [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:bg-navy [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
        />
        <div className="flex justify-between text-xs text-site-gray mt-1.5">
          <span>Rp 0</span>
          <span className="text-navy font-semibold">Rp {maxPrice}.000</span>
        </div>
      </div>

      {/* Color */}
      <div className="mb-8">
        <div className="text-[11px] font-semibold tracking-[0.14em] uppercase text-navy mb-3.5 pb-2.5 border-b border-site-border">
          Warna
        </div>
        <div className="flex flex-wrap gap-2">
          {COLORS.map((c) => (
            <div
              key={c.name}
              title={c.name}
              onClick={() => onColorToggle(c.name)}
              className="w-[22px] h-[22px] rounded-full cursor-pointer transition-all"
              style={{
                background: c.hex,
                border: activeColors.includes(c.name)
                  ? "3px solid #c9a84c"
                  : "2px solid #e2ddd4",
                boxShadow: activeColors.includes(c.name)
                  ? "0 0 0 1px #c9a84c"
                  : "none",
              }}
            />
          ))}
        </div>
      </div>

      {/* Reset */}
      {hasActiveFilters && (
        <Button
          variant="outline"
          size="sm"
          fullWidth
          onClick={onReset}
        >
          Reset Filter
        </Button>
      )}
    </aside>
  );
}
```

- [ ] **Step 2: Create ActiveFilters component**

Create `src/components/catalog/active-filters.tsx`:

```tsx
"use client";

interface ActiveFiltersProps {
  filters: string[];
  sort: string;
  onRemoveFilter: (filter: string) => void;
  onSortChange: (sort: string) => void;
}

export function ActiveFilters({
  filters,
  sort,
  onRemoveFilter,
  onSortChange,
}: ActiveFiltersProps) {
  return (
    <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
      <div className="flex gap-1.5 flex-wrap">
        {filters.map((f) => (
          <div
            key={f}
            className="flex items-center gap-1.5 bg-navy text-white px-2.5 py-1 text-xs"
          >
            {f}
            <span
              className="cursor-pointer text-sm opacity-70 hover:opacity-100"
              onClick={() => onRemoveFilter(f)}
            >
              ×
            </span>
          </div>
        ))}
      </div>
      <select
        value={sort}
        onChange={(e) => onSortChange(e.target.value)}
        className="font-sans text-[13px] px-3 py-2 border-[1.5px] border-site-border bg-white outline-none cursor-pointer"
      >
        {["Terbaru", "Harga ↑", "Harga ↓"].map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    </div>
  );
}
```

- [ ] **Step 3: Create ProductGrid component**

Create `src/components/catalog/product-grid.tsx`:

```tsx
import Link from "next/link";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import { PlaceholderImage } from "@/components/ui/placeholder-image";
import { Badge } from "@/components/ui/badge";

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-20 text-site-gray">
        <div className="font-serif text-2xl mb-2">Produk tidak ditemukan</div>
        <div className="text-[13px]">Coba ubah filter kamu</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-7">
      {products.map((p) => (
        <Link
          key={p.id}
          href={`/product/${p.id}`}
          className="group cursor-pointer block no-underline text-site-text"
        >
          <div className="overflow-hidden relative">
            <PlaceholderImage
              label={p.label}
              className="w-full h-[260px] transition-transform duration-400 group-hover:scale-[1.04]"
            />
            <div className="absolute top-2.5 right-2.5 w-8 h-8 bg-white/90 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              ♡
            </div>
            {p.badge && (
              <Badge
                variant={p.badge === "SALE" ? "default" : "navy"}
                className={`absolute top-2.5 left-2.5 ${
                  p.badge === "SALE" ? "border-gold text-gold bg-white" : ""
                }`}
              >
                {p.badge}
              </Badge>
            )}
          </div>
          <div className="pt-3">
            <div className="text-[11px] text-site-gray mb-0.5">
              {p.category}
            </div>
            <div className="font-serif text-base font-medium mb-1">
              {p.name}
            </div>
            <div className="text-[13px] text-site-gray">
              <span className="text-navy font-semibold text-sm">
                {formatPrice(p.price)}
              </span>
              {p.originalPrice && (
                <span className="line-through ml-1.5 text-xs">
                  {formatPrice(p.originalPrice)}
                </span>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Create Catalog page**

Create `src/app/catalog/page.tsx`:

```tsx
"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { PRODUCTS } from "@/lib/constants";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { SidebarFilter } from "@/components/catalog/sidebar-filter";
import { ProductGrid } from "@/components/catalog/product-grid";
import { ActiveFilters } from "@/components/catalog/active-filters";
import { Toast } from "@/components/ui/toast";

const CATEGORIES = ["Semua", "Men", "Women", "Unisex", "Aksesoris"];
const SIZES = ["S", "M", "L", "XL", "2XL", "3XL"];

function CatalogContent() {
  const searchParams = useSearchParams();
  const initialCat = searchParams.get("cat") || "Semua";

  const [activeCat, setActiveCat] = useState(initialCat);
  const [activeSizes, setActiveSizes] = useState<string[]>([]);
  const [activeColors, setActiveColors] = useState<string[]>([]);
  const [sort, setSort] = useState("Terbaru");
  const [maxPrice, setMaxPrice] = useState(650);

  const toggleArr = (arr: string[], val: string) =>
    arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];

  const filtered = PRODUCTS.filter((p) => {
    if (activeCat !== "Semua" && p.category !== activeCat) return false;
    if (activeSizes.length && !activeSizes.some((s) => p.sizes.includes(s)))
      return false;
    if (activeColors.length && !activeColors.some((c) => p.colors.includes(c)))
      return false;
    if (p.price > maxPrice * 1000) return false;
    return true;
  }).sort((a, b) => {
    if (sort === "Harga ↑") return a.price - b.price;
    if (sort === "Harga ↓") return b.price - a.price;
    return b.id - a.id;
  });

  const activeFilters = [
    ...(activeCat !== "Semua" ? [activeCat] : []),
    ...activeSizes,
    ...activeColors,
  ];

  const handleRemoveFilter = (filter: string) => {
    if (CATEGORIES.includes(filter)) setActiveCat("Semua");
    else if (SIZES.includes(filter))
      setActiveSizes(toggleArr(activeSizes, filter));
    else setActiveColors(toggleArr(activeColors, filter));
  };

  const handleReset = () => {
    setActiveCat("Semua");
    setActiveSizes([]);
    setActiveColors([]);
    setMaxPrice(650);
  };

  return (
    <div className="min-h-screen pt-[72px] animate-fade-up">
      <Navbar />

      {/* Header */}
      <div className="bg-cream py-8 pb-6 border-b border-site-border">
        <div className="container-site">
          <div className="text-[11px] text-site-gray mb-1.5">
            <a href="/" className="cursor-pointer hover:text-navy">
              Home
            </a>
            {" › Katalog"}
            {activeCat !== "Semua" && ` › ${activeCat}`}
          </div>
          <div className="flex justify-between items-center">
            <h1 className="font-serif font-normal text-[32px]">
              {activeCat === "Semua"
                ? "Semua Produk"
                : `Koleksi ${activeCat}`}
            </h1>
            <div className="text-[13px] text-site-gray">
              {filtered.length} produk
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container-site py-10">
        <div className="grid grid-cols-[240px_1fr] gap-10">
          <SidebarFilter
            activeCat={activeCat}
            activeSizes={activeSizes}
            activeColors={activeColors}
            maxPrice={maxPrice}
            onCatChange={setActiveCat}
            onSizeToggle={(s) => setActiveSizes(toggleArr(activeSizes, s))}
            onColorToggle={(c) => setActiveColors(toggleArr(activeColors, c))}
            onPriceChange={setMaxPrice}
            onReset={handleReset}
            hasActiveFilters={activeFilters.length > 0}
          />

          <div>
            <ActiveFilters
              filters={activeFilters}
              sort={sort}
              onRemoveFilter={handleRemoveFilter}
              onSortChange={setSort}
            />
            <ProductGrid products={filtered} />
          </div>
        </div>
      </div>

      <Footer />
      <Toast />
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense>
      <CatalogContent />
    </Suspense>
  );
}
```

- [ ] **Step 5: Verify catalog page**

```bash
npm run dev
```

Open `http://localhost:3000/catalog` — should show sidebar filter + product grid with sorting.

- [ ] **Step 6: Commit**

```bash
git add src/components/catalog src/app/catalog
git commit -m "feat: implement catalog page with sidebar filters, product grid, and sorting"
```

---

## Task 9: Product Detail Page

**Files:**
- Create: `src/components/product/image-gallery.tsx`
- Create: `src/components/product/product-info.tsx`
- Create: `src/components/product/size-guide.tsx`
- Create: `src/components/product/product-tabs.tsx`
- Create: `src/components/product/related-products.tsx`
- Create: `src/app/product/[id]/page.tsx`

- [ ] **Step 1: Create ImageGallery component**

Create `src/components/product/image-gallery.tsx`:

```tsx
"use client";

import { useState } from "react";
import { PlaceholderImage } from "@/components/ui/placeholder-image";

interface ImageGalleryProps {
  label: string;
  selectedColor: string;
}

export function ImageGallery({ label, selectedColor }: ImageGalleryProps) {
  const [activeImg, setActiveImg] = useState(0);

  return (
    <div>
      <PlaceholderImage
        label={`${label}\nfoto utama – ${selectedColor}`}
        className="w-full h-[540px]"
      />
      <div className="grid grid-cols-4 gap-2 mt-2.5">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            onClick={() => setActiveImg(i)}
            className="cursor-pointer"
            style={{
              outline:
                activeImg === i
                  ? "2px solid #1a2744"
                  : "2px solid transparent",
              outlineOffset: 1,
            }}
          >
            <PlaceholderImage
              label={`foto ${i + 1}`}
              className="w-full h-[90px]"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create SizeGuide component**

Create `src/components/product/size-guide.tsx`:

```tsx
"use client";

import { SIZE_GUIDE } from "@/lib/constants";

interface SizeGuideProps {
  selectedSize: string | null;
  onSizeSelect: (size: string) => void;
}

export function SizeGuide({ selectedSize, onSizeSelect }: SizeGuideProps) {
  return (
    <div className="mt-3.5 border-[1.5px] border-gold-light bg-gold-pale p-4">
      <div className="font-serif text-base mb-3 text-navy">
        Panduan Ukuran (cm)
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-navy text-white">
              {["Size", "Dada", "Pinggang", "Panggul", "Tinggi"].map((h) => (
                <th
                  key={h}
                  className="px-2.5 py-2 text-left font-semibold whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SIZE_GUIDE.map((row, i) => (
              <tr
                key={row.size}
                onClick={() => onSizeSelect(row.size)}
                className={`cursor-pointer hover:bg-cream ${
                  i % 2 === 0 ? "bg-white" : "bg-cream"
                }`}
              >
                <td
                  className={`px-2.5 py-[7px] border-b border-site-border font-bold ${
                    selectedSize === row.size ? "text-gold" : "text-site-text"
                  }`}
                >
                  {row.size}
                </td>
                <td className="px-2.5 py-[7px] border-b border-site-border">
                  {row.dada}
                </td>
                <td className="px-2.5 py-[7px] border-b border-site-border">
                  {row.pinggang}
                </td>
                <td className="px-2.5 py-[7px] border-b border-site-border">
                  {row.panggul}
                </td>
                <td className="px-2.5 py-[7px] border-b border-site-border">
                  {row.tinggi}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="text-[11px] text-site-gray mt-2.5">
        * Ukur pada bagian terlebar. Klik baris untuk pilih ukuran.
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create ProductInfo component**

Create `src/components/product/product-info.tsx`:

```tsx
"use client";

import { useState } from "react";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/stores/cart-store";
import { Badge } from "@/components/ui/badge";
import { Tag } from "@/components/ui/tag";
import { Button } from "@/components/ui/button";
import { SizeGuide } from "./size-guide";

interface ProductInfoProps {
  product: Product;
}

export function ProductInfo({ product: p }: ProductInfoProps) {
  const [selColor, setSelColor] = useState(p.colors[0]);
  const [selSize, setSelSize] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const handleAdd = () => {
    if (!selSize) return;
    addItem({ ...p, selectedColor: selColor, selectedSize: selSize, qty });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const discountPct = p.originalPrice
    ? Math.round((1 - p.price / p.originalPrice) * 100)
    : 0;

  return (
    <div className="sticky top-[90px]">
      {p.badge && <Badge className="mb-3">{p.badge}</Badge>}

      <h1 className="font-serif font-normal text-[32px] leading-[1.2] mb-1.5">
        {p.name}
      </h1>

      {/* Rating */}
      <div className="flex items-center gap-2 mb-4 text-[13px]">
        <span className="text-gold">★★★★★</span>
        <span className="text-site-gray">4.9 (128 ulasan)</span>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-2.5 mb-6 pb-6 border-b border-site-border">
        <span className="font-serif text-[28px] font-semibold text-navy">
          {formatPrice(p.price)}
        </span>
        {p.originalPrice && (
          <>
            <span className="text-base text-site-gray line-through">
              {formatPrice(p.originalPrice)}
            </span>
            <span className="text-xs bg-gold text-white px-2 py-0.5">
              -{discountPct}%
            </span>
          </>
        )}
      </div>

      {/* Color */}
      <div className="mb-6">
        <div className="text-xs font-semibold tracking-[0.1em] uppercase mb-2.5">
          Warna:{" "}
          <span className="text-site-gray font-normal normal-case">
            {selColor}
          </span>
        </div>
        <div className="flex gap-2">
          {p.colors.map((c) => (
            <div
              key={c}
              onClick={() => setSelColor(c)}
              className={`px-3.5 py-[5px] text-xs cursor-pointer border-[1.5px] transition-all ${
                selColor === c
                  ? "border-navy bg-navy text-white"
                  : "border-site-border bg-white text-site-text"
              }`}
            >
              {c}
            </div>
          ))}
        </div>
      </div>

      {/* Size */}
      <div className="mb-5">
        <div className="flex justify-between items-center mb-2.5">
          <div className="text-xs font-semibold tracking-[0.1em] uppercase">
            Ukuran
          </div>
          <button
            onClick={() => setSizeGuideOpen(!sizeGuideOpen)}
            className="bg-none border-none text-xs text-gold cursor-pointer font-sans underline underline-offset-[3px]"
          >
            📐 Panduan Ukuran {sizeGuideOpen ? "▲" : "▼"}
          </button>
        </div>
        <div className="flex gap-1.5 flex-wrap mb-3">
          {p.sizes.map((s) => (
            <Tag
              key={s}
              active={selSize === s}
              onClick={() => setSelSize(s)}
              className="min-w-[44px] justify-center text-[13px]"
            >
              {s}
            </Tag>
          ))}
        </div>
        {!selSize && (
          <div className="text-xs text-gold mt-1">
            ↑ Pilih ukuran terlebih dahulu
          </div>
        )}
        {sizeGuideOpen && (
          <SizeGuide selectedSize={selSize} onSizeSelect={setSelSize} />
        )}
      </div>

      {/* Qty + CTA */}
      <div className="flex gap-2.5 mb-3">
        <div className="flex border-[1.5px] border-site-border items-center">
          <button
            onClick={() => setQty(Math.max(1, qty - 1))}
            className="w-10 h-12 bg-none border-none text-lg cursor-pointer text-navy"
          >
            −
          </button>
          <span className="w-10 text-center text-sm font-semibold">{qty}</span>
          <button
            onClick={() => setQty(qty + 1)}
            className="w-10 h-12 bg-none border-none text-lg cursor-pointer text-navy"
          >
            +
          </button>
        </div>
        <Button
          variant="primary"
          className={`flex-1 ${!selSize ? "opacity-40 cursor-not-allowed" : ""} ${added ? "!bg-gold" : ""}`}
          onClick={handleAdd}
          disabled={!selSize}
        >
          {added ? "✓ Ditambahkan!" : "Tambah ke Keranjang"}
        </Button>
      </div>

      <Button variant="outline" fullWidth className="mb-5">
        ♡ Simpan ke Wishlist
      </Button>

      {/* Meta */}
      <div className="text-xs text-site-gray leading-[2] border-t border-site-border pt-4">
        <div>✓ Stok tersedia · Pengiriman 1–3 hari kerja</div>
        <div>✓ Free ongkir min. Rp 200.000</div>
        <div>✓ Retur mudah dalam 14 hari</div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Create ProductTabs component**

Create `src/components/product/product-tabs.tsx`:

```tsx
"use client";

import { useState } from "react";
import { Product } from "@/types";

interface ProductTabsProps {
  product: Product;
}

export function ProductTabs({ product: p }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState("desc");

  const tabs = [
    { id: "desc", label: "Deskripsi" },
    { id: "material", label: "Material & Perawatan" },
    { id: "review", label: "Ulasan (128)" },
  ];

  return (
    <div className="container-site px-10 pb-[60px]">
      {/* Tab nav */}
      <div className="flex border-b-2 border-site-border mb-7">
        {tabs.map(({ id, label }) => (
          <div
            key={id}
            onClick={() => setActiveTab(id)}
            className={`px-6 py-3 text-[13px] font-medium cursor-pointer tracking-[0.04em] -mb-[2px] border-b-2 ${
              activeTab === id
                ? "border-navy text-navy"
                : "border-transparent text-site-gray"
            }`}
          >
            {label}
          </div>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "desc" && (
        <div className="max-w-[680px] leading-[1.9] text-site-gray-dark text-sm">
          <p className="mb-4">
            {p.name} hadir dengan desain yang elegan dan bahan berkualitas
            tinggi. Dipotong dengan presisi untuk memberikan siluet yang sempurna
            di berbagai bentuk tubuh.
          </p>
          <ul className="pl-5">
            {[
              "Bahan premium, nyaman sepanjang hari",
              "Tersedia dalam berbagai pilihan warna",
              "Potongan modern, cocok untuk berbagai kesempatan",
              "Mudah dicuci dan cepat kering",
            ].map((t) => (
              <li key={t} className="mb-1.5">
                {t}
              </li>
            ))}
          </ul>
        </div>
      )}

      {activeTab === "material" && (
        <div className="max-w-[680px] text-sm leading-[1.9] text-site-gray-dark">
          <p>Komposisi: 60% Cotton, 35% Linen, 5% Elastane</p>
          <p className="mt-3">
            Panduan perawatan: Cuci dengan tangan atau mesin suhu dingin (30°C).
            Jangan diperas. Setrika suhu sedang.
          </p>
        </div>
      )}

      {activeTab === "review" && (
        <div className="grid grid-cols-[200px_1fr] gap-10">
          <div className="text-center p-6 border border-site-border">
            <div className="font-serif text-[52px] font-semibold text-navy">
              4.9
            </div>
            <div className="text-gold text-xl my-1">★★★★★</div>
            <div className="text-xs text-site-gray">128 ulasan</div>
          </div>
          <div>
            {[5, 4, 3, 2, 1].map((n) => {
              const pcts = [85, 10, 3, 1, 1];
              return (
                <div key={n} className="flex items-center gap-2.5 mb-2">
                  <span className="text-xs w-2">{n}</span>
                  <span className="text-gold text-xs">★</span>
                  <div className="flex-1 h-1.5 bg-site-border rounded-sm">
                    <div
                      className="h-full bg-gold rounded-sm"
                      style={{ width: `${pcts[5 - n]}%` }}
                    />
                  </div>
                  <span className="text-xs text-site-gray w-[30px]">
                    {pcts[5 - n]}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 5: Create RelatedProducts component**

Create `src/components/product/related-products.tsx`:

```tsx
import Link from "next/link";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import { PlaceholderImage } from "@/components/ui/placeholder-image";

interface RelatedProductsProps {
  products: Product[];
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  return (
    <div className="bg-cream py-[60px]">
      <div className="container-site">
        <h3 className="font-serif font-normal text-2xl mb-8 text-center">
          Mungkin Kamu Suka
        </h3>
        <div className="grid grid-cols-4 gap-5">
          {products.map((rp) => (
            <Link
              key={rp.id}
              href={`/product/${rp.id}`}
              className="group cursor-pointer block no-underline text-site-text"
            >
              <div className="overflow-hidden">
                <PlaceholderImage
                  label={rp.label}
                  className="w-full h-[200px] transition-transform duration-400 group-hover:scale-[1.04]"
                />
              </div>
              <div className="pt-3">
                <div className="font-serif text-[0.9rem] font-medium mb-1">
                  {rp.name}
                </div>
                <div className="text-[13px] text-site-gray">
                  <span className="text-navy font-semibold">
                    {formatPrice(rp.price)}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Create Product Detail page**

Create `src/app/product/[id]/page.tsx`:

```tsx
"use client";

import { use } from "react";
import Link from "next/link";
import { PRODUCTS } from "@/lib/constants";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Toast } from "@/components/ui/toast";
import { ImageGallery } from "@/components/product/image-gallery";
import { ProductInfo } from "@/components/product/product-info";
import { ProductTabs } from "@/components/product/product-tabs";
import { RelatedProducts } from "@/components/product/related-products";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const product = PRODUCTS.find((p) => p.id === Number(id)) || PRODUCTS[0];
  const related = PRODUCTS.filter(
    (x) =>
      x.id !== product.id &&
      (x.category === product.category || x.category === "Unisex")
  ).slice(0, 4);

  return (
    <div className="min-h-screen pt-[72px] animate-fade-up">
      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-cream py-3.5 border-b border-site-border">
        <div className="container-site">
          <div className="text-xs text-site-gray">
            <Link href="/" className="cursor-pointer hover:text-navy no-underline text-site-gray">
              Home
            </Link>
            {" › "}
            <Link href="/catalog" className="cursor-pointer hover:text-navy no-underline text-site-gray">
              Katalog
            </Link>
            {` › ${product.name}`}
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="container-site py-12 px-10">
        <div className="grid grid-cols-[1fr_440px] gap-[60px] items-start">
          <ImageGallery
            label={product.label}
            selectedColor={product.colors[0]}
          />
          <ProductInfo product={product} />
        </div>
      </div>

      <ProductTabs product={product} />
      <RelatedProducts products={related} />
      <Footer />
      <Toast />
    </div>
  );
}
```

- [ ] **Step 7: Verify product detail page**

```bash
npm run dev
```

Open `http://localhost:3000/product/1` — should show product with image gallery, info panel, tabs, and related products.

- [ ] **Step 8: Commit**

```bash
git add src/components/product src/app/product
git commit -m "feat: implement product detail page with gallery, size guide, tabs, and related products"
```

---

## Task 10: Cart Page

**Files:**
- Create: `src/components/cart/cart-item.tsx`
- Create: `src/components/cart/voucher-input.tsx`
- Create: `src/components/cart/cart-recommendations.tsx`
- Create: `src/components/cart/cart-sticky-bar.tsx`
- Create: `src/app/cart/page.tsx`

- [ ] **Step 1: Create CartItem component**

Create `src/components/cart/cart-item.tsx`:

```tsx
"use client";

import Link from "next/link";
import { CartItem as CartItemType } from "@/types";
import { formatPrice } from "@/lib/utils";
import { PlaceholderImage } from "@/components/ui/placeholder-image";

interface CartItemProps {
  item: CartItemType;
  index: number;
  onUpdateQty: (index: number, qty: number) => void;
  onRemove: (index: number) => void;
}

export function CartItem({ item, index, onUpdateQty, onRemove }: CartItemProps) {
  return (
    <div className="flex gap-5 py-6 border-b border-site-border items-start">
      <PlaceholderImage
        label={item.label}
        className="w-[100px] h-[120px] shrink-0"
      />
      <div className="flex-1">
        <div className="flex justify-between items-start gap-4">
          <div>
            <div className="text-[11px] text-site-gray mb-0.5">
              {item.category}
            </div>
            <Link
              href={`/product/${item.id}`}
              className="font-serif text-lg mb-1.5 cursor-pointer no-underline text-site-text hover:text-navy block"
            >
              {item.name}
            </Link>
            <div className="flex gap-3 text-xs text-site-gray">
              <span>Ukuran: {item.selectedSize || "-"}</span>
              <span>Warna: {item.selectedColor || "-"}</span>
            </div>
          </div>
          <button
            onClick={() => onRemove(index)}
            className="bg-none border-none text-site-gray cursor-pointer text-lg shrink-0 hover:text-navy"
          >
            ×
          </button>
        </div>
        <div className="flex justify-between items-center mt-4">
          <div className="flex border-[1.5px] border-site-border items-center">
            <button
              onClick={() => onUpdateQty(index, Math.max(1, item.qty - 1))}
              className="w-9 h-9 bg-none border-none text-lg cursor-pointer"
            >
              −
            </button>
            <span className="w-9 text-center text-[13px] font-semibold">
              {item.qty}
            </span>
            <button
              onClick={() => onUpdateQty(index, item.qty + 1)}
              className="w-9 h-9 bg-none border-none text-lg cursor-pointer"
            >
              +
            </button>
          </div>
          <div className="text-right">
            <div className="font-serif text-lg font-semibold text-navy">
              {formatPrice(item.price * item.qty)}
            </div>
            {item.qty > 1 && (
              <div className="text-[11px] text-site-gray">
                {formatPrice(item.price)} × {item.qty}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create VoucherInput component**

Create `src/components/cart/voucher-input.tsx`:

```tsx
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface VoucherInputProps {
  subtotal: number;
  onApplyDiscount: (discount: number) => void;
}

export function VoucherInput({ subtotal, onApplyDiscount }: VoucherInputProps) {
  const [voucher, setVoucher] = useState("");
  const [msg, setMsg] = useState("");

  const applyVoucher = () => {
    if (voucher.toUpperCase() === "VESTIRE10") {
      const discount = Math.round(subtotal * 0.1);
      onApplyDiscount(discount);
      setMsg("✓ Voucher berhasil! Diskon 10%");
    } else {
      onApplyDiscount(0);
      setMsg("✗ Kode voucher tidak valid");
    }
  };

  return (
    <div className="p-5 border-[1.5px] border-dashed border-site-border mb-8">
      <div className="text-[13px] font-semibold mb-2.5">🎫 Kode Voucher</div>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Masukkan kode voucher..."
          value={voucher}
          onChange={(e) => setVoucher(e.target.value)}
          className="flex-1 px-4 py-3 border-[1.5px] border-site-border bg-white font-sans text-sm text-site-text outline-none focus:border-navy"
        />
        <Button variant="primary" onClick={applyVoucher}>
          Pakai
        </Button>
      </div>
      {msg && (
        <div
          className={`text-xs mt-2 ${
            msg.startsWith("✓") ? "text-gold" : "text-[#c0392b]"
          }`}
        >
          {msg}
        </div>
      )}
      <div className="text-[11px] text-site-gray mt-1.5">
        Coba kode: VESTIRE10
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create CartRecommendations component**

Create `src/components/cart/cart-recommendations.tsx`:

```tsx
import Link from "next/link";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import { PlaceholderImage } from "@/components/ui/placeholder-image";

interface CartRecommendationsProps {
  products: Product[];
}

export function CartRecommendations({ products }: CartRecommendationsProps) {
  return (
    <div className="mb-8">
      <div className="font-serif text-lg mb-4">Lengkapi Penampilanmu</div>
      <div className="grid grid-cols-3 gap-4">
        {products.map((rp) => (
          <Link
            key={rp.id}
            href={`/product/${rp.id}`}
            className="flex gap-3 items-center p-3 border border-site-border no-underline text-site-text hover:border-navy transition-colors"
          >
            <PlaceholderImage
              label={rp.label}
              className="w-[60px] h-[70px] shrink-0"
            />
            <div>
              <div className="font-serif text-[13px] mb-0.5">{rp.name}</div>
              <div className="text-xs text-gold font-semibold">
                {formatPrice(rp.price)}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Create CartStickyBar component**

Create `src/components/cart/cart-sticky-bar.tsx`:

```tsx
"use client";

import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface CartStickyBarProps {
  totalItems: number;
  ongkir: number;
  total: number;
  discount: number;
}

export function CartStickyBar({
  totalItems,
  ongkir,
  total,
  discount,
}: CartStickyBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-navy text-white px-10 py-4 flex justify-between items-center z-[100] shadow-[0_-4px_20px_rgba(0,0,0,0.2)]">
      <div>
        <div className="text-[11px] text-white/60 mb-0.5">
          {totalItems} item ·{" "}
          {ongkir === 0 ? "✓ Free Ongkir" : `Ongkir ${formatPrice(ongkir)}`}
        </div>
        <div className="font-serif text-[22px] text-gold">
          {formatPrice(total)}
        </div>
        {discount > 0 && (
          <div className="text-[11px] text-gold-light">
            Hemat {formatPrice(discount)}
          </div>
        )}
      </div>
      <Link href="/checkout">
        <Button
          variant="gold"
          className="text-sm px-9 py-3.5"
        >
          Lanjut ke Checkout →
        </Button>
      </Link>
    </div>
  );
}
```

- [ ] **Step 5: Create Cart page**

Create `src/app/cart/page.tsx`:

```tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/stores/cart-store";
import { PRODUCTS } from "@/lib/constants";
import { Navbar } from "@/components/layout/navbar";
import { Toast } from "@/components/ui/toast";
import { StepBar } from "@/components/ui/step-bar";
import { Button } from "@/components/ui/button";
import { CartItem } from "@/components/cart/cart-item";
import { VoucherInput } from "@/components/cart/voucher-input";
import { CartRecommendations } from "@/components/cart/cart-recommendations";
import { CartStickyBar } from "@/components/cart/cart-sticky-bar";

export default function CartPage() {
  const { items, updateQty, removeItem, subtotal: getSubtotal, totalItems } = useCartStore();
  const [discount, setDiscount] = useState(0);

  const sub = getSubtotal();
  const ongkir = sub >= 200000 ? 0 : 15000;
  const total = sub + ongkir - discount;

  const related = PRODUCTS.filter(
    (p) => !items.find((c) => c.id === p.id)
  ).slice(0, 3);

  const steps = [
    { label: "Keranjang", status: "active" as const },
    { label: "Pengiriman", status: "pending" as const },
    { label: "Pembayaran", status: "pending" as const },
    { label: "Selesai", status: "pending" as const },
  ];

  return (
    <div className="min-h-screen pt-[72px] animate-fade-up">
      <Navbar />

      {/* Header */}
      <div className="bg-cream py-6 border-b border-site-border">
        <div className="container-site">
          <h1 className="font-serif font-normal text-[28px]">
            Keranjang Belanja{" "}
            {items.length > 0 && `(${items.length})`}
          </h1>
        </div>
      </div>

      {/* Steps */}
      <div className="bg-white border-b border-site-border py-4">
        <div className="container-site">
          <div className="max-w-[500px]">
            <StepBar steps={steps} />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container-site py-10 px-10 pb-[120px]">
        {items.length === 0 ? (
          <div className="text-center py-20">
            <div className="font-serif text-[28px] mb-3">Keranjang kosong</div>
            <p className="text-site-gray mb-7">
              Yuk, mulai belanja dan temukan koleksi favoritmu!
            </p>
            <Link href="/catalog">
              <Button variant="primary">Mulai Belanja</Button>
            </Link>
          </div>
        ) : (
          <div>
            {/* Items */}
            <div className="mb-8">
              {items.map((item, idx) => (
                <CartItem
                  key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}
                  item={item}
                  index={idx}
                  onUpdateQty={updateQty}
                  onRemove={removeItem}
                />
              ))}
            </div>

            <VoucherInput subtotal={sub} onApplyDiscount={setDiscount} />
            <CartRecommendations products={related} />
          </div>
        )}
      </div>

      {/* Sticky bar */}
      {items.length > 0 && (
        <CartStickyBar
          totalItems={totalItems()}
          ongkir={ongkir}
          total={total}
          discount={discount}
        />
      )}

      <Toast />
    </div>
  );
}
```

- [ ] **Step 6: Commit**

```bash
git add src/components/cart src/app/cart
git commit -m "feat: implement cart page with items, voucher, recommendations, and sticky bar"
```

---

## Task 11: Checkout Page

**Files:**
- Create: `src/components/checkout/address-section.tsx`
- Create: `src/components/checkout/shipping-section.tsx`
- Create: `src/components/checkout/payment-section.tsx`
- Create: `src/components/checkout/order-summary.tsx`
- Create: `src/components/checkout/order-success.tsx`
- Create: `src/app/checkout/page.tsx`

- [ ] **Step 1: Create AddressSection component**

Create `src/components/checkout/address-section.tsx`:

```tsx
"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AddressForm {
  nama: string;
  telp: string;
  alamat: string;
  provinsi: string;
  kota: string;
  kodepos: string;
}

interface AddressSectionProps {
  isOpen: boolean;
  isDone: boolean;
  form: AddressForm;
  onToggle: () => void;
  onUpdate: (key: keyof AddressForm, value: string) => void;
  onSave: () => void;
}

export function AddressSection({
  isOpen,
  isDone,
  form,
  onToggle,
  onUpdate,
  onSave,
}: AddressSectionProps) {
  return (
    <div className="border-[1.5px] border-site-border mb-4">
      <div
        className={`flex items-center justify-between px-5 py-4 cursor-pointer border-b border-site-border transition-colors ${
          isOpen ? "bg-navy text-white" : "bg-white hover:bg-cream"
        }`}
        onClick={onToggle}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold border-2 ${
              isDone
                ? "bg-gold text-white border-gold"
                : isOpen
                ? "bg-navy text-white border-white"
                : "bg-white text-site-gray border-site-border"
            }`}
          >
            {isDone ? "✓" : "1"}
          </div>
          <span className="font-semibold text-sm">Alamat Pengiriman</span>
        </div>
        {isDone && !isOpen ? (
          <div className="text-xs text-gold">{form.kota || "Sudah diisi ✓"}</div>
        ) : (
          <span>{isOpen ? "▲" : "▼"}</span>
        )}
      </div>
      {isOpen && (
        <div className="p-5 border-b border-site-border bg-site-white">
          <div className="grid grid-cols-2 gap-3.5">
            {[
              { k: "nama" as const, label: "Nama Lengkap", ph: "Ahmad Fauzi", full: true },
              { k: "telp" as const, label: "No. Telepon", ph: "08xx-xxxx-xxxx", full: false },
              { k: "alamat" as const, label: "Alamat Lengkap", ph: "Jl. Merdeka No. 1, RT 01/RW 02", full: true },
              { k: "provinsi" as const, label: "Provinsi", ph: "DKI Jakarta", full: false },
              { k: "kota" as const, label: "Kota / Kabupaten", ph: "Jakarta Selatan", full: false },
              { k: "kodepos" as const, label: "Kode Pos", ph: "12345", full: false },
            ].map((f) => (
              <div key={f.k} className={f.full ? "col-span-2" : ""}>
                <Input
                  label={f.label}
                  placeholder={f.ph}
                  value={form[f.k]}
                  onChange={(e) => onUpdate(f.k, e.target.value)}
                />
              </div>
            ))}
          </div>
          <Button variant="primary" className="mt-4" onClick={onSave}>
            Simpan & Lanjutkan →
          </Button>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Create ShippingSection component**

Create `src/components/checkout/shipping-section.tsx`:

```tsx
"use client";

import { SHIPPING_OPTIONS } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ShippingSectionProps {
  isOpen: boolean;
  isDone: boolean;
  selected: string;
  isFreeShipping: boolean;
  onToggle: () => void;
  onSelect: (id: string) => void;
  onSave: () => void;
}

export function ShippingSection({
  isOpen,
  isDone,
  selected,
  isFreeShipping,
  onToggle,
  onSelect,
  onSave,
}: ShippingSectionProps) {
  return (
    <div className="border-[1.5px] border-site-border mb-4">
      <div
        className={`flex items-center justify-between px-5 py-4 cursor-pointer border-b border-site-border transition-colors ${
          isOpen ? "bg-navy text-white" : "bg-white hover:bg-cream"
        }`}
        onClick={onToggle}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold border-2 ${
              isDone
                ? "bg-gold text-white border-gold"
                : isOpen
                ? "bg-navy text-white border-white"
                : "bg-white text-site-gray border-site-border"
            }`}
          >
            {isDone ? "✓" : "2"}
          </div>
          <span className="font-semibold text-sm">Metode Pengiriman</span>
        </div>
        {isDone && !isOpen ? (
          <span className="text-xs text-gold">
            {SHIPPING_OPTIONS.find((o) => o.id === selected)?.label} ✓
          </span>
        ) : (
          <span>{isOpen ? "▲" : "▼"}</span>
        )}
      </div>
      {isOpen && (
        <div className="p-5 border-b border-site-border bg-site-white">
          <div className="flex flex-col gap-2.5">
            {SHIPPING_OPTIONS.map((opt) => (
              <label
                key={opt.id}
                className={`flex items-center gap-3.5 p-3.5 border-[1.5px] cursor-pointer ${
                  selected === opt.id
                    ? "border-navy bg-cream"
                    : "border-site-border bg-white"
                }`}
              >
                <input
                  type="radio"
                  name="shipping"
                  value={opt.id}
                  checked={selected === opt.id}
                  onChange={() => onSelect(opt.id)}
                  className="accent-navy"
                />
                <div className="flex-1">
                  <div className="font-semibold text-sm">{opt.label}</div>
                  <div className="text-xs text-site-gray">{opt.description}</div>
                </div>
                <div
                  className={`font-semibold text-sm ${
                    isFreeShipping ? "text-gold" : "text-navy"
                  }`}
                >
                  {isFreeShipping ? "FREE" : formatPrice(opt.price)}
                </div>
              </label>
            ))}
          </div>
          <Button variant="primary" className="mt-4" onClick={onSave}>
            Simpan & Lanjutkan →
          </Button>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Create PaymentSection component**

Create `src/components/checkout/payment-section.tsx`:

```tsx
"use client";

import { PAYMENT_OPTIONS } from "@/lib/constants";
import { Button } from "@/components/ui/button";

interface PaymentSectionProps {
  isOpen: boolean;
  isDone: boolean;
  selected: string;
  onToggle: () => void;
  onSelect: (id: string) => void;
  onSave: () => void;
}

export function PaymentSection({
  isOpen,
  isDone,
  selected,
  onToggle,
  onSelect,
  onSave,
}: PaymentSectionProps) {
  return (
    <div className="border-[1.5px] border-site-border mb-4">
      <div
        className={`flex items-center justify-between px-5 py-4 cursor-pointer border-b border-site-border transition-colors ${
          isOpen ? "bg-navy text-white" : "bg-white hover:bg-cream"
        }`}
        onClick={onToggle}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold border-2 ${
              isDone
                ? "bg-gold text-white border-gold"
                : isOpen
                ? "bg-navy text-white border-white"
                : "bg-white text-site-gray border-site-border"
            }`}
          >
            {isDone ? "✓" : "3"}
          </div>
          <span className="font-semibold text-sm">Metode Pembayaran</span>
        </div>
        <span>{isOpen ? "▲" : "▼"}</span>
      </div>
      {isOpen && (
        <div className="p-5 border-b border-site-border bg-site-white">
          <div className="grid grid-cols-2 gap-2.5">
            {PAYMENT_OPTIONS.map((opt) => (
              <label
                key={opt.id}
                className={`flex items-start gap-2.5 p-3.5 border-[1.5px] cursor-pointer ${
                  selected === opt.id
                    ? "border-navy bg-cream"
                    : "border-site-border bg-white"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value={opt.id}
                  checked={selected === opt.id}
                  onChange={() => onSelect(opt.id)}
                  className="accent-navy mt-0.5"
                />
                <div>
                  <div className="flex gap-1.5 items-center font-semibold text-[13px] mb-0.5">
                    <span>{opt.icon}</span>
                    {opt.label}
                  </div>
                  <div className="text-[11px] text-site-gray">
                    {opt.description}
                  </div>
                </div>
              </label>
            ))}
          </div>
          <Button variant="primary" className="mt-4" onClick={onSave}>
            Konfirmasi Pembayaran
          </Button>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Create OrderSummary component**

Create `src/components/checkout/order-summary.tsx`:

```tsx
import { CartItem } from "@/types";
import { formatPrice } from "@/lib/utils";
import { PlaceholderImage } from "@/components/ui/placeholder-image";

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  ongkir: number;
  isFreeShipping: boolean;
  total: number;
}

export function OrderSummary({
  items,
  subtotal,
  ongkir,
  isFreeShipping,
  total,
}: OrderSummaryProps) {
  return (
    <div className="sticky top-[90px] self-start">
      <div className="border-[1.5px] border-site-border bg-white">
        <div className="px-5 py-4 border-b border-site-border bg-navy text-white">
          <div className="font-semibold tracking-[0.06em] text-[13px]">
            RINGKASAN PESANAN
          </div>
        </div>
        <div className="p-5">
          {items.slice(0, 3).map((item, i) => (
            <div key={i} className="flex gap-3 mb-3.5 items-center">
              <PlaceholderImage
                label={item.label}
                className="w-[50px] h-[60px] shrink-0"
              />
              <div className="flex-1">
                <div className="font-serif text-[13px] mb-0.5">
                  {item.name}
                </div>
                <div className="text-[11px] text-site-gray">
                  {item.selectedSize} · {item.selectedColor} · ×{item.qty}
                </div>
              </div>
              <div className="text-[13px] font-semibold text-navy">
                {formatPrice(item.price * item.qty)}
              </div>
            </div>
          ))}
          {items.length > 3 && (
            <div className="text-xs text-site-gray mb-3.5">
              +{items.length - 3} produk lainnya
            </div>
          )}

          <hr className="border-none border-t border-site-border my-5" />

          {[
            ["Subtotal", formatPrice(subtotal)],
            [
              "Ongkos Kirim",
              isFreeShipping ? "FREE ✓" : formatPrice(ongkir),
            ],
          ].map(([label, value]) => (
            <div
              key={label}
              className={`flex justify-between text-[13px] mb-2 ${
                value.includes("FREE") ? "text-gold" : "text-site-gray-dark"
              }`}
            >
              <span>{label}</span>
              <span>{value}</span>
            </div>
          ))}

          <hr className="border-none border-t border-site-border my-5" />

          <div className="flex justify-between font-serif text-xl font-semibold">
            <span>Total</span>
            <span className="text-navy">{formatPrice(total)}</span>
          </div>
        </div>
      </div>

      <div className="p-4 bg-cream mt-3 text-xs text-site-gray leading-[2]">
        <div>🔒 Transaksi dienkripsi SSL</div>
        <div>↩ Retur gratis dalam 14 hari</div>
        <div>🚚 Gratis ongkir min. Rp 200.000</div>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Create OrderSuccess component**

Create `src/components/checkout/order-success.tsx`:

```tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function OrderSuccess() {
  const orderNumber = `#VST-2026-${Math.floor(Math.random() * 10000)}`;

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-10">
      <div className="w-20 h-20 bg-gold rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
        ✓
      </div>
      <h2 className="font-serif font-normal text-[32px] mb-2.5">
        Pesanan Berhasil!
      </h2>
      <p className="text-site-gray text-[15px] mb-2">
        Nomor pesanan: {orderNumber}
      </p>
      <p className="text-site-gray text-[13px] max-w-[400px] leading-[1.8] mb-8">
        Terima kasih! Pesananmu sedang kami proses. Kamu akan mendapat
        konfirmasi via WhatsApp & email.
      </p>
      <Link href="/">
        <Button variant="primary">Kembali ke Beranda</Button>
      </Link>
    </div>
  );
}
```

- [ ] **Step 6: Create Checkout page**

Create `src/app/checkout/page.tsx`:

```tsx
"use client";

import { useState } from "react";
import { useCartStore } from "@/stores/cart-store";
import { formatPrice } from "@/lib/utils";
import { Navbar } from "@/components/layout/navbar";
import { Toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { AddressSection } from "@/components/checkout/address-section";
import { ShippingSection } from "@/components/checkout/shipping-section";
import { PaymentSection } from "@/components/checkout/payment-section";
import { OrderSummary } from "@/components/checkout/order-summary";
import { OrderSuccess } from "@/components/checkout/order-success";

export default function CheckoutPage() {
  const { items, subtotal: getSubtotal } = useCartStore();
  const [open, setOpen] = useState("address");
  const [done, setDone] = useState({ address: false, shipping: false, payment: false });
  const [form, setForm] = useState({
    nama: "", telp: "", alamat: "", provinsi: "", kota: "", kodepos: "",
  });
  const [shipping, setShipping] = useState("jne");
  const [payment, setPayment] = useState("transfer");
  const [placing, setPlacing] = useState(false);
  const [placed, setPlaced] = useState(false);

  const sub = getSubtotal();
  const shippingPrices: Record<string, number> = {
    jne: 15000, jnt: 12000, sicepat: 9000, gosend: 35000,
  };
  const ongkir = shippingPrices[shipping] || 15000;
  const isFreeShipping = sub >= 200000;
  const total = sub + (isFreeShipping ? 0 : ongkir);

  const toggle = (section: string) =>
    setOpen(open === section ? "" : section);

  const handlePlace = () => {
    setPlacing(true);
    setTimeout(() => {
      setPlacing(false);
      setPlaced(true);
    }, 1800);
  };

  if (placed) {
    return (
      <div className="min-h-screen pt-[72px] animate-fade-up">
        <Navbar />
        <OrderSuccess />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-[72px] animate-fade-up">
      <Navbar />

      {/* Header */}
      <div className="bg-cream py-6 border-b border-site-border">
        <div className="container-site">
          <div className="flex items-center justify-between">
            <h1 className="font-serif font-normal text-[28px]">Checkout</h1>
            <div className="text-xs text-site-gray flex items-center gap-1.5">
              <span>🔒</span> Pembayaran Aman & Terenkripsi
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container-site py-10 px-10 pb-[60px]">
        <div className="grid grid-cols-[1fr_360px] gap-12">
          {/* Left: Accordion */}
          <div>
            <AddressSection
              isOpen={open === "address"}
              isDone={done.address}
              form={form}
              onToggle={() => toggle("address")}
              onUpdate={(k, v) => setForm((f) => ({ ...f, [k]: v }))}
              onSave={() => {
                setDone((d) => ({ ...d, address: true }));
                setOpen("shipping");
              }}
            />

            <ShippingSection
              isOpen={open === "shipping"}
              isDone={done.shipping}
              selected={shipping}
              isFreeShipping={isFreeShipping}
              onToggle={() => toggle("shipping")}
              onSelect={setShipping}
              onSave={() => {
                setDone((d) => ({ ...d, shipping: true }));
                setOpen("payment");
              }}
            />

            <PaymentSection
              isOpen={open === "payment"}
              isDone={done.payment}
              selected={payment}
              onToggle={() => toggle("payment")}
              onSelect={setPayment}
              onSave={() => setDone((d) => ({ ...d, payment: true }))}
            />

            {/* Place Order */}
            <Button
              variant="gold"
              fullWidth
              className={`py-4 text-[15px] mt-2 ${
                !(done.address && done.shipping)
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              onClick={done.address && done.shipping ? handlePlace : undefined}
              disabled={!(done.address && done.shipping)}
            >
              {placing
                ? "⏳ Memproses..."
                : `🔒 Bayar Sekarang — ${formatPrice(total)}`}
            </Button>
          </div>

          {/* Right: Order Summary */}
          <OrderSummary
            items={items}
            subtotal={sub}
            ongkir={ongkir}
            isFreeShipping={isFreeShipping}
            total={total}
          />
        </div>
      </div>

      <Toast />
    </div>
  );
}
```

- [ ] **Step 7: Commit**

```bash
git add src/components/checkout src/app/checkout
git commit -m "feat: implement checkout page with accordion, order summary, and success screen"
```

---

## Task 12: Login/Register Page

**Files:**
- Create: `src/components/login/brand-panel.tsx`
- Create: `src/components/login/login-form.tsx`
- Create: `src/components/login/register-form.tsx`
- Create: `src/app/login/page.tsx`

- [ ] **Step 1: Create BrandPanel component**

Create `src/components/login/brand-panel.tsx`:

```tsx
import Link from "next/link";
import { PlaceholderImage } from "@/components/ui/placeholder-image";

export function BrandPanel() {
  return (
    <div className="bg-navy-dark text-white flex flex-col justify-between p-[clamp(40px,6vw,80px)] relative overflow-hidden min-h-screen">
      {/* Logo */}
      <Link
        href="/"
        className="font-serif text-[28px] font-bold text-gold tracking-[0.06em] no-underline"
      >
        VESTIRE
      </Link>

      {/* Center */}
      <div>
        <div className="text-[11px] tracking-[0.2em] uppercase text-gold mb-5">
          Selamat Datang
        </div>
        <h2 className="font-serif font-light text-[clamp(2rem,4vw,3.5rem)] leading-[1.15] mb-5">
          &ldquo;Gaya kamu,
          <br />
          <em className="text-gold">cerita</em> kamu.&rdquo;
        </h2>
        <p className="text-sm text-white/60 max-w-[340px] leading-[1.9] mb-9">
          Bergabunglah dengan 50.000+ pelanggan VESTIRE dan nikmati akses
          eksklusif ke koleksi terbaru, penawaran spesial, dan pengalaman
          berbelanja yang menyenangkan.
        </p>
        <div className="flex flex-col gap-3">
          {[
            "Akses early ke koleksi baru",
            "Voucher selamat datang Rp 50.000",
            "Lacak pesanan real-time",
            "Program loyalitas & poin reward",
          ].map((text) => (
            <div
              key={text}
              className="flex gap-2.5 items-center text-[13px] text-white/75"
            >
              <span className="text-gold text-[10px]">✦</span>
              {text}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom */}
      <div>
        <PlaceholderImage
          label={"campaign image\nlookbook foto"}
          className="w-full h-[180px] opacity-70"
        />
        <div className="text-[11px] text-white/35 mt-3 tracking-[0.06em]">
          New Season 2026 – Now Available
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create LoginForm component**

Create `src/components/login/login-form.tsx`:

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface LoginFormProps {
  onSwitchTab: () => void;
}

export function LoginForm({ onSwitchTab }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push("/");
    }, 1200);
  };

  return (
    <div>
      <div className="font-serif text-[22px] mb-1.5">
        Selamat datang kembali
      </div>
      <div className="text-[13px] text-site-gray mb-7">
        Masuk ke akun VESTIRE kamu
      </div>

      <div className="mb-4">
        <Input
          label="Email"
          type="email"
          placeholder="nama@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block text-xs font-medium tracking-[0.06em] text-site-gray uppercase mb-1.5">
          Password
        </label>
        <div className="relative">
          <input
            type={showPass ? "text" : "password"}
            placeholder="••••••••"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            className="w-full px-4 py-3 pr-11 border-[1.5px] border-site-border bg-white font-sans text-sm text-site-text outline-none focus:border-navy placeholder:text-site-gray-light"
          />
          <button
            onClick={() => setShowPass(!showPass)}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-none border-none cursor-pointer text-sm text-site-gray"
            type="button"
          >
            {showPass ? "🙈" : "👁"}
          </button>
        </div>
      </div>

      <div className="text-right mb-5">
        <span className="text-xs text-gold cursor-pointer underline underline-offset-[3px]">
          Lupa password?
        </span>
      </div>

      <Button
        variant="primary"
        fullWidth
        className="py-3.5 text-sm mb-4"
        onClick={handleLogin}
      >
        {loading ? "⏳ Memproses..." : "Masuk ke Akun"}
      </Button>

      {/* Divider */}
      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-site-border" />
        <span className="text-xs text-site-gray">atau masuk dengan</span>
        <div className="flex-1 h-px bg-site-border" />
      </div>

      {/* Social */}
      <div className="grid grid-cols-2 gap-2.5">
        <Button variant="outline" className="text-[13px]">
          G Google
        </Button>
        <Button variant="outline" className="text-[13px]">
          f Facebook
        </Button>
      </div>

      <div className="text-center mt-6 text-[13px] text-site-gray">
        Belum punya akun?{" "}
        <span
          className="text-navy font-semibold cursor-pointer underline underline-offset-[3px]"
          onClick={onSwitchTab}
        >
          Daftar sekarang
        </span>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create RegisterForm component**

Create `src/components/login/register-form.tsx`:

```tsx
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface RegisterFormProps {
  onSwitchTab: () => void;
  onSuccess: () => void;
}

export function RegisterForm({ onSwitchTab, onSuccess }: RegisterFormProps) {
  const [form, setForm] = useState({
    nama: "", namaAkhir: "", email: "", telp: "", pass: "", confirm: "",
  });
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const upd = (k: string, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleRegister = () => {
    if (!agree) {
      setMsg("Harap setujui syarat & ketentuan");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSuccess();
    }, 1200);
  };

  return (
    <div>
      <div className="font-serif text-[22px] mb-1.5">Buat akun baru</div>
      <div className="text-[13px] text-site-gray mb-6">
        Bergabunglah dengan komunitas VESTIRE
      </div>

      {msg && (
        <div
          className={`px-3.5 py-2.5 text-[13px] mb-4 border ${
            msg.includes("berhasil")
              ? "bg-[#f0fdf4] text-[#166534] border-[#bbf7d0]"
              : "bg-[#fef2f2] text-[#991b1b] border-[#fecaca]"
          }`}
        >
          {msg}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Nama Depan"
          placeholder="Ahmad"
          value={form.nama}
          onChange={(e) => upd("nama", e.target.value)}
        />
        <Input
          label="Nama Belakang"
          placeholder="Fauzi"
          value={form.namaAkhir}
          onChange={(e) => upd("namaAkhir", e.target.value)}
        />
      </div>

      <div className="mt-3">
        <Input
          label="Email"
          type="email"
          placeholder="nama@email.com"
          value={form.email}
          onChange={(e) => upd("email", e.target.value)}
        />
      </div>
      <div className="mt-4">
        <Input
          label="No. HP (opsional)"
          type="tel"
          placeholder="08xx-xxxx-xxxx"
          value={form.telp}
          onChange={(e) => upd("telp", e.target.value)}
        />
      </div>
      <div className="mt-4">
        <Input
          label="Password"
          type="password"
          placeholder="Min. 8 karakter"
          value={form.pass}
          onChange={(e) => upd("pass", e.target.value)}
        />
      </div>
      <div className="mt-4">
        <Input
          label="Konfirmasi Password"
          type="password"
          placeholder="Ulangi password"
          value={form.confirm}
          onChange={(e) => upd("confirm", e.target.value)}
        />
      </div>

      <label className="flex gap-2.5 items-start my-5 cursor-pointer text-[13px] text-site-gray-dark">
        <input
          type="checkbox"
          checked={agree}
          onChange={(e) => setAgree(e.target.checked)}
          className="mt-0.5 accent-navy"
        />
        <span>
          Saya menyetujui{" "}
          <span className="text-navy underline cursor-pointer underline-offset-[3px]">
            Syarat & Ketentuan
          </span>{" "}
          dan{" "}
          <span className="text-navy underline cursor-pointer underline-offset-[3px]">
            Kebijakan Privasi
          </span>
        </span>
      </label>

      <Button
        variant="gold"
        fullWidth
        className="py-3.5 text-sm"
        onClick={handleRegister}
      >
        {loading ? "⏳ Membuat akun..." : "Buat Akun Gratis →"}
      </Button>

      <div className="text-center mt-5 text-[13px] text-site-gray">
        Sudah punya akun?{" "}
        <span
          className="text-navy font-semibold cursor-pointer underline underline-offset-[3px]"
          onClick={onSwitchTab}
        >
          Masuk
        </span>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Create Login page**

Create `src/app/login/page.tsx`:

```tsx
"use client";

import { useState } from "react";
import { BrandPanel } from "@/components/login/brand-panel";
import { LoginForm } from "@/components/login/login-form";
import { RegisterForm } from "@/components/login/register-form";

export default function LoginPage() {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [msg, setMsg] = useState("");

  return (
    <div className="min-h-screen grid grid-cols-2">
      <BrandPanel />

      <div className="bg-site-white flex flex-col justify-center p-[clamp(40px,6vw,80px)] min-h-screen">
        <div className="max-w-[400px] w-full">
          {/* Tab toggle */}
          <div className="flex border-[1.5px] border-site-border mb-8">
            {[
              ["login", "Masuk"],
              ["register", "Daftar"],
            ].map(([id, label]) => (
              <div
                key={id}
                onClick={() => {
                  setTab(id as "login" | "register");
                  setMsg("");
                }}
                className={`flex-1 text-center py-3 text-[13px] font-semibold tracking-[0.08em] uppercase cursor-pointer transition-all ${
                  tab === id
                    ? "bg-navy text-white"
                    : "bg-white text-site-gray"
                }`}
              >
                {label}
              </div>
            ))}
          </div>

          {/* Message */}
          {msg && (
            <div className="px-3.5 py-2.5 text-[13px] mb-4 bg-[#f0fdf4] text-[#166534] border border-[#bbf7d0]">
              {msg}
            </div>
          )}

          {tab === "login" ? (
            <LoginForm onSwitchTab={() => setTab("register")} />
          ) : (
            <RegisterForm
              onSwitchTab={() => setTab("login")}
              onSuccess={() => {
                setTab("login");
                setMsg("Akun berhasil dibuat! Silakan masuk.");
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add src/components/login src/app/login
git commit -m "feat: implement login/register page with split screen layout"
```

---

## Task 13: Final Integration & Verification

**Files:**
- Modify: `src/app/layout.tsx` (if needed)

- [ ] **Step 1: Run build to check for TypeScript errors**

```bash
npm run build
```

Fix any errors that appear.

- [ ] **Step 2: Test all page navigation**

```bash
npm run dev
```

Open browser and verify:
- `http://localhost:3000` — Homepage with all sections
- `http://localhost:3000/catalog` — Catalog with filters working
- `http://localhost:3000/catalog?cat=Men` — Filtered catalog
- `http://localhost:3000/product/1` — Product detail page
- `http://localhost:3000/cart` — Cart page (empty state)
- Add items from product detail, verify cart updates
- `http://localhost:3000/checkout` — Checkout accordion flow
- `http://localhost:3000/login` — Login/Register split screen

- [ ] **Step 3: Commit final state**

```bash
git add -A
git commit -m "feat: complete VESTIRE online shop with all 6 pages"
```
