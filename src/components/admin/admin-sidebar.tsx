"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Package, ShoppingBag, Users, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdminAuthStore } from "@/stores/admin-auth-store";

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/users", label: "Users", icon: Users },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAdminAuthStore((s) => s.logout);

  const handleLogout = () => {
    logout();
    router.replace("/admin/login");
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-[240px] bg-navy-dark text-white flex flex-col">
      <div className="px-6 py-7 border-b border-white/10">
        <Link href="/admin/dashboard" className="font-serif text-[22px] font-semibold tracking-[0.06em] text-white no-underline block">
          VESTIRE <span className="text-gold text-[13px] tracking-[0.12em] uppercase block mt-0.5">Admin</span>
        </Link>
      </div>

      <nav className="flex-1 py-5">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-6 py-3 text-[13px] font-medium tracking-[0.04em] uppercase transition-colors border-l-[3px]",
                active
                  ? "border-gold text-gold bg-white/5"
                  : "border-transparent text-white/70 hover:text-white hover:bg-white/5"
              )}
            >
              <Icon size={18} strokeWidth={1.8} />
              {label}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-6 py-4 text-[13px] font-medium tracking-[0.04em] uppercase text-white/70 hover:text-white hover:bg-white/5 border-t border-white/10"
      >
        <LogOut size={18} strokeWidth={1.8} />
        Logout
      </button>
    </aside>
  );
}
