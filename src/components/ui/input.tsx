import { cn } from "@/lib/utils";
import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ label, className, id, ...props }: InputProps) {
  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-xs font-medium tracking-[0.06em] text-site-gray uppercase mb-1.5">
          {label}
        </label>
      )}
      <input
        id={id}
        className={cn(
          "w-full px-4 py-3 border-[1.5px] border-site-border bg-white font-sans text-sm text-site-text outline-none transition-colors duration-200",
          "focus:border-navy placeholder:text-site-gray-light",
          className
        )}
        {...props}
      />
    </div>
  );
}
