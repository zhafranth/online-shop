"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Tags,
  Newspaper,
  Crown,
  LayoutTemplate,
  ShoppingBag,
  BadgePercent,
  Truck,
  CreditCard,
  Ruler,
  Users,
  ShieldCheck,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdminAuthStore } from "@/stores/admin-auth-store";

type ItemStatus = "ready" | "soon";

type NavItem = {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  status: ItemStatus;
};

type NavSection = {
  label: string;
  items: NavItem[];
};

const SECTIONS: NavSection[] = [
  {
    label: "Overview",
    items: [
      { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard, status: "ready" },
    ],
  },
  {
    label: "Catalog",
    items: [
      { href: "/admin/products", label: "Products", icon: Package, status: "ready" },
      { href: "/admin/categories", label: "Categories", icon: Tags, status: "ready" },
    ],
  },
  {
    label: "Content",
    items: [
      { href: "/admin/magazine", label: "Magazine", icon: Newspaper, status: "soon" },
      { href: "/admin/membership", label: "Membership", icon: Crown, status: "soon" },
      { href: "/admin/home", label: "Home & Banner", icon: LayoutTemplate, status: "soon" },
    ],
  },
  {
    label: "Sales",
    items: [
      { href: "/admin/orders", label: "Orders", icon: ShoppingBag, status: "ready" },
      { href: "/admin/promo", label: "Promo", icon: BadgePercent, status: "soon" },
    ],
  },
  {
    label: "Configuration",
    items: [
      { href: "/admin/shipping", label: "Shipping", icon: Truck, status: "soon" },
      { href: "/admin/payment", label: "Payment", icon: CreditCard, status: "soon" },
      { href: "/admin/size-guide", label: "Size Guide", icon: Ruler, status: "soon" },
    ],
  },
  {
    label: "People",
    items: [
      { href: "/admin/users", label: "Customers", icon: Users, status: "ready" },
      { href: "/admin/admins", label: "Admins", icon: ShieldCheck, status: "soon" },
    ],
  },
  {
    label: "System",
    items: [
      { href: "/admin/settings", label: "Settings", icon: Settings, status: "soon" },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const admin = useAdminAuthStore((s) => s.admin);
  const logout = useAdminAuthStore((s) => s.logout);

  const handleLogout = () => {
    logout();
    router.replace("/admin/login");
  };

  const initial = admin?.name?.charAt(0).toUpperCase() ?? "A";

  return (
    <aside className="fixed left-0 top-0 h-screen w-[252px] bg-[#0e0e10] text-white flex flex-col border-r border-white/[0.06]">
      <div className="px-5 pt-5 pb-4 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-md bg-white text-[#0e0e10] flex items-center justify-center text-[13px] font-semibold tracking-tight">
          T
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13.5px] font-semibold leading-tight tracking-tight">ThickApparel</p>
          <p className="text-[10.5px] text-white/45 leading-tight mt-0.5 tracking-wide uppercase">Admin Console</p>
        </div>
      </div>

      <div className="mx-5 h-px bg-white/[0.06]" />

      <nav className="flex-1 overflow-y-auto scrollbar-subtle px-3 pt-3 pb-3">
        {SECTIONS.map((section) => (
          <div key={section.label} className="mt-4 first:mt-1">
            <p className="px-2 mb-1.5 text-[10px] font-semibold tracking-[0.18em] uppercase text-white/35">
              {section.label}
            </p>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const active = pathname === item.href || pathname.startsWith(item.href + "/");
                const disabled = item.status === "soon";
                const Icon = item.icon;

                const inner = (
                  <span
                    className={cn(
                      "group relative flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-[13px] font-medium transition-colors",
                      active && "bg-white/[0.08] text-white",
                      !active && !disabled && "text-white/65 hover:text-white hover:bg-white/[0.04]",
                      disabled && "text-white/30 cursor-not-allowed"
                    )}
                  >
                    {active && (
                      <span className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-1 h-4 bg-white rounded-full" />
                    )}
                    <Icon
                      size={15}
                      strokeWidth={1.7}
                      className={cn(
                        active && "text-white",
                        !active && !disabled && "text-white/55 group-hover:text-white",
                        disabled && "text-white/30"
                      )}
                    />
                    <span className="flex-1 truncate">{item.label}</span>
                    {disabled && (
                      <span className="text-[9.5px] font-medium uppercase tracking-[0.12em] text-white/40 bg-white/[0.04] border border-white/[0.05] px-1.5 py-0.5 rounded">
                        Soon
                      </span>
                    )}
                  </span>
                );

                return (
                  <li key={item.href}>
                    {disabled ? (
                      <div aria-disabled="true" className="block select-none">
                        {inner}
                      </div>
                    ) : (
                      <Link href={item.href} className="block no-underline">
                        {inner}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/[0.06] p-3">
        <div className="flex items-center gap-2.5 px-1.5 py-1">
          <span className="w-7 h-7 rounded-full bg-gradient-to-br from-white/25 to-white/[0.06] ring-1 ring-white/10 text-[11.5px] font-semibold flex items-center justify-center">
            {initial}
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-[12.5px] font-medium leading-tight truncate">{admin?.name ?? "Admin"}</p>
            <p className="text-[10.5px] text-white/45 leading-tight mt-0.5 truncate">{admin?.email ?? "—"}</p>
          </div>
          <button
            onClick={handleLogout}
            aria-label="Logout"
            className="p-1.5 rounded-md text-white/55 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <LogOut size={14} strokeWidth={1.8} />
          </button>
        </div>
      </div>
    </aside>
  );
}
