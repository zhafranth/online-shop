import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "gold" | "outline" | "outline-white";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: "default" | "sm";
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-site-text text-white hover:bg-site-gray-dark",
  // "gold" kept as alias for legacy usage — now identical to primary in the neutral palette
  gold: "bg-site-text text-white hover:bg-site-gray-dark",
  outline: "bg-transparent border-[1.5px] border-site-text text-site-text hover:bg-site-text hover:text-white",
  "outline-white": "bg-transparent border-[1.5px] border-white/70 text-white hover:bg-white hover:text-site-text",
};

export function Button({ variant = "primary", size = "default", fullWidth = false, className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 font-sans font-medium uppercase tracking-[0.12em] cursor-pointer transition-all duration-200",
        size === "default" ? "px-7 py-3 text-[12px]" : "px-[18px] py-2 text-[11px]",
        fullWidth && "w-full",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}
