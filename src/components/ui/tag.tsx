"use client";
import { cn } from "@/lib/utils";

interface TagProps {
  children: React.ReactNode;
  active?: boolean;
  activeVariant?: "navy" | "gold";
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

export function Tag({ children, active = false, activeVariant = "navy", disabled = false, onClick, className }: TagProps) {
  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      className={cn(
        "inline-flex items-center px-3 py-[5px] text-xs font-medium border-[1.5px] border-site-border cursor-pointer transition-all duration-150 select-none tracking-[0.04em]",
        "hover:border-navy",
        active && activeVariant === "navy" && "bg-navy text-white border-navy",
        active && activeVariant === "gold" && "bg-gold text-white border-gold",
        disabled && "opacity-35 cursor-not-allowed line-through",
        className
      )}
    >
      {children}
    </button>
  );
}
