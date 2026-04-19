import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "gold" | "outline" | "outline-white";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: "default" | "sm";
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-navy text-white hover:bg-navy-dark",
  gold: "bg-gold text-white hover:bg-[#b8963e]",
  outline: "bg-transparent border-[1.5px] border-navy text-navy hover:bg-navy hover:text-white",
  "outline-white": "bg-transparent border-[1.5px] border-white/60 text-white hover:border-white",
};

export function Button({ variant = "primary", size = "default", fullWidth = false, className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 font-sans font-medium uppercase tracking-[0.08em] cursor-pointer transition-all duration-200",
        size === "default" ? "px-7 py-3 text-[13px]" : "px-[18px] py-2 text-xs",
        fullWidth && "w-full",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}
