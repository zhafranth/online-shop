"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useOrderStore } from "@/stores/order-store";
import { useMemo } from "react";

type MonthlyPoint = { month: string; revenue: number };

const MONTH_LABELS = ["Nov", "Des", "Jan", "Feb", "Mar", "Apr"];
const MONTH_KEYS: { year: number; month: number }[] = [
  { year: 2025, month: 10 }, // November (0-indexed)
  { year: 2025, month: 11 }, // December
  { year: 2026, month: 0 },  // January
  { year: 2026, month: 1 },  // February
  { year: 2026, month: 2 },  // March
  { year: 2026, month: 3 },  // April
];

export function SalesChart() {
  const orders = useOrderStore((s) => s.orders);

  const data: MonthlyPoint[] = useMemo(() => {
    return MONTH_KEYS.map(({ year, month }, i) => {
      const revenue = orders
        .filter((o) => {
          const d = new Date(o.createdAt);
          return d.getFullYear() === year && d.getMonth() === month && o.status !== "cancelled";
        })
        .reduce((sum, o) => sum + o.total, 0);
      return { month: MONTH_LABELS[i], revenue };
    });
  }, [orders]);

  return (
    <div className="bg-white border border-site-border p-6">
      <h3 className="font-serif text-[20px] font-semibold text-navy mb-5">Penjualan 6 Bulan Terakhir</h3>
      <div className="w-full h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="#e2ddd4" vertical={false} />
            <XAxis dataKey="month" stroke="#888" fontSize={12} />
            <YAxis stroke="#888" fontSize={12} tickFormatter={(v: number) => `${(v / 1000000).toFixed(1)}M`} />
            <Tooltip
              formatter={(v: number) => [`Rp ${v.toLocaleString("id-ID")}`, "Revenue"]}
              contentStyle={{ borderRadius: 0, border: "1px solid #e2ddd4", fontSize: 12 }}
            />
            <Bar dataKey="revenue" fill="#c9a84c" radius={[0, 0, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
