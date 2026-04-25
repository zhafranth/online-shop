"use client";

import { usePathname } from "next/navigation";
import { AdminGuard } from "@/components/admin/admin-guard";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminTopbar } from "@/components/admin/admin-topbar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === "/admin/login";

  if (isLogin) {
    return <AdminGuard>{children}</AdminGuard>;
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-cream">
        <AdminSidebar />
        <div className="ml-[240px] flex flex-col min-h-screen">
          <AdminTopbar />
          <main className="flex-1 p-8">{children}</main>
        </div>
      </div>
    </AdminGuard>
  );
}
