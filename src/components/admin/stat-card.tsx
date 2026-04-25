import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  accent?: "navy" | "gold" | "red";
}

const accentColors: Record<NonNullable<StatCardProps["accent"]>, string> = {
  navy: "bg-navy text-white",
  gold: "bg-gold text-white",
  red: "bg-[#b91c1c] text-white",
};

export function StatCard({ label, value, icon: Icon, accent = "navy" }: StatCardProps) {
  return (
    <div className="bg-white border border-site-border p-6 flex items-start justify-between">
      <div>
        <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-site-gray mb-2">{label}</p>
        <p className="font-serif text-[28px] font-semibold text-navy leading-none">{value}</p>
      </div>
      <span className={`w-11 h-11 flex items-center justify-center ${accentColors[accent]}`}>
        <Icon size={20} strokeWidth={1.8} />
      </span>
    </div>
  );
}
