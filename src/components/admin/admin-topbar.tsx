"use client";

import { usePathname } from "next/navigation";

const TITLES: Record<string, string> = {
  "/admin/dashboard": "Dashboard",
  "/admin/products": "Produk",
  "/admin/products/new": "Tambah Produk",
  "/admin/categories": "Kategori",
  "/admin/magazine": "Magazine",
  "/admin/membership": "Membership",
  "/admin/home": "Home & Banner",
  "/admin/orders": "Order",
  "/admin/promo": "Promo",
  "/admin/shipping": "Shipping",
  "/admin/payment": "Payment",
  "/admin/size-guide": "Size Guide",
  "/admin/users": "Customer",
  "/admin/admins": "Admin Users",
  "/admin/settings": "Settings",
};

const SECTION_LABELS: Record<string, string> = {
  "/admin/dashboard": "Overview",
  "/admin/products": "Catalog",
  "/admin/categories": "Catalog",
  "/admin/magazine": "Content",
  "/admin/membership": "Content",
  "/admin/home": "Content",
  "/admin/orders": "Sales",
  "/admin/promo": "Sales",
  "/admin/shipping": "Configuration",
  "/admin/payment": "Configuration",
  "/admin/size-guide": "Configuration",
  "/admin/users": "People",
  "/admin/admins": "People",
  "/admin/settings": "System",
};

function deriveTitle(pathname: string): string {
  if (TITLES[pathname]) return TITLES[pathname];
  if (pathname.startsWith("/admin/products/") && pathname.endsWith("/edit")) return "Edit Produk";
  if (pathname.startsWith("/admin/membership/") && pathname.endsWith("/edit")) return "Edit Membership";
  if (pathname.startsWith("/admin/orders/")) return "Detail Order";
  return "Admin";
}

function deriveSection(pathname: string): string | null {
  const exact = SECTION_LABELS[pathname];
  if (exact) return exact;
  const matchKey = Object.keys(SECTION_LABELS).find((k) => pathname.startsWith(k + "/"));
  return matchKey ? SECTION_LABELS[matchKey] : null;
}

export function AdminTopbar() {
  const pathname = usePathname();
  const title = deriveTitle(pathname);
  const section = deriveSection(pathname);

  return (
    <header className="h-[64px] bg-white border-b border-site-border flex items-center px-8">
      <div className="flex flex-col">
        {section && (
          <span className="text-[10px] font-semibold tracking-[0.18em] uppercase text-site-gray">
            {section}
          </span>
        )}
        <h1 className="text-[20px] font-semibold tracking-tight text-site-text leading-tight mt-0.5">
          {title}
        </h1>
      </div>
    </header>
  );
}
