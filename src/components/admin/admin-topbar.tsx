"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, LogOut } from "lucide-react";
import { useAdminAuthStore } from "@/stores/admin-auth-store";

const TITLES: Record<string, string> = {
  "/admin/dashboard": "Dashboard",
  "/admin/products": "Produk",
  "/admin/products/new": "Tambah Produk",
  "/admin/orders": "Order",
  "/admin/users": "Pengguna",
};

function deriveTitle(pathname: string): string {
  if (TITLES[pathname]) return TITLES[pathname];
  if (pathname.startsWith("/admin/products/") && pathname.endsWith("/edit")) return "Edit Produk";
  if (pathname.startsWith("/admin/orders/")) return "Detail Order";
  return "Admin";
}

export function AdminTopbar() {
  const pathname = usePathname();
  const router = useRouter();
  const admin = useAdminAuthStore((s) => s.admin);
  const logout = useAdminAuthStore((s) => s.logout);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const handleLogout = () => {
    logout();
    router.replace("/admin/login");
  };

  const initial = admin?.name?.charAt(0) ?? "A";

  return (
    <header className="h-[68px] bg-site-white border-b border-site-border flex items-center justify-between px-8">
      <h1 className="font-serif text-[26px] font-semibold text-navy">{deriveTitle(pathname)}</h1>

      <div ref={menuRef} className="relative">
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-3 px-3 py-1.5 hover:bg-cream/70 rounded-sm transition-colors"
        >
          <span className="w-9 h-9 rounded-full bg-navy text-white font-serif text-[15px] font-semibold flex items-center justify-center">
            {initial}
          </span>
          <span className="text-sm font-medium text-site-text">{admin?.name ?? "Admin"}</span>
          <ChevronDown size={16} className="text-site-gray" />
        </button>
        {open && (
          <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-site-border shadow-lg">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-3 text-sm text-site-text hover:bg-cream text-left"
            >
              <LogOut size={15} />
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
