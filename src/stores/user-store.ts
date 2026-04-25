"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types/admin";
import { SEED_USERS } from "@/lib/admin-seeds";

interface UserStore {
  users: User[];
  deleteUser: (id: number) => void;
  getById: (id: number) => User | undefined;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      users: SEED_USERS,

      deleteUser: (id) => {
        set({ users: get().users.filter((u) => u.id !== id) });
      },

      getById: (id) => get().users.find((u) => u.id === id),
    }),
    {
      name: "vestire-users",
      partialize: (state) => ({ users: state.users }),
    }
  )
);
