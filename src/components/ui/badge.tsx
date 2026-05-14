import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "navy";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span className={cn(
      "inline-block text-[10px] font-semibold tracking-[0.16em] uppercase px-2.5 py-[3px]",
      variant === "navy"
        ? "bg-site-text text-white border border-site-text"
        : "border border-site-text text-site-text bg-white/90",
      className
    )}>
      {children}
    </span>
  );
}
