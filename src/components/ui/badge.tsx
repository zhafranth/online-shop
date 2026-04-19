import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "navy";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span className={cn(
      "inline-block text-[10px] font-semibold tracking-[0.12em] uppercase px-2.5 py-[3px]",
      variant === "navy" ? "bg-navy text-white border border-navy" : "border border-gold text-gold",
      className
    )}>
      {children}
    </span>
  );
}
