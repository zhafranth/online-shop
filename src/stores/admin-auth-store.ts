"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AdminUser } from "@/types/admin";
import { ADMIN_CREDENTIALS } from "@/lib/admin-seeds";

interface AdminAuthStore {
  admin: AdminUser | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

export const useAdminAuthStore = create<AdminAuthStore>()(
  persist(
    (set) => ({
      admin: null,

      login: (email, password) => {
        if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
          set({ admin: { email: ADMIN_CREDENTIALS.email, name: ADMIN_CREDENTIALS.name } });
          return true;
        }
        return false;
      },

      logout: () => set({ admin: null }),
    }),
    {
      name: "vestire-admin-auth",
      partialize: (state) => ({ admin: state.admin }),
    }
  )
);
