"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAdminAuthStore } from "@/stores/admin-auth-store";

interface AdminGuardProps {
  children: React.ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const admin = useAdminAuthStore((s) => s.admin);

  useEffect(() => {
    const onLogin = pathname === "/admin/login";
    if (!admin && !onLogin) {
      router.replace("/admin/login");
    } else if (admin && onLogin) {
      router.replace("/admin/dashboard");
    }
  }, [admin, pathname, router]);

  return <>{children}</>;
}
