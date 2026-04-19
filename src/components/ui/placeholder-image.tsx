import { cn } from "@/lib/utils";

interface PlaceholderImageProps {
  label?: string;
  className?: string;
}

export function PlaceholderImage({ label = "foto produk", className }: PlaceholderImageProps) {
  return (
    <div className={cn(
      "flex items-center justify-center relative overflow-hidden",
      "bg-[repeating-linear-gradient(45deg,#e8e4da,#e8e4da_4px,#edeae2_4px,#edeae2_16px)]",
      className
    )}>
      <span className="font-mono text-[11px] text-[#999] text-center p-2 leading-relaxed whitespace-pre-line">
        {label}
      </span>
    </div>
  );
}
