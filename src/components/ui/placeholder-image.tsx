import Image from "next/image";
import { cn } from "@/lib/utils";

interface PlaceholderImageProps {
  label?: string;
  src?: string;
  alt?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

export function PlaceholderImage({
  label = "foto produk",
  src,
  alt,
  className,
  sizes = "(max-width: 768px) 50vw, 33vw",
  priority,
}: PlaceholderImageProps) {
  if (src) {
    return (
      <div className={cn("relative overflow-hidden bg-cream", className)}>
        <Image
          src={src}
          alt={alt ?? label}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      </div>
    );
  }
  return (
    <div
      className={cn(
        "flex items-center justify-center relative overflow-hidden",
        "bg-[repeating-linear-gradient(45deg,#e8e4da,#e8e4da_4px,#edeae2_4px,#edeae2_16px)]",
        className
      )}
    >
      <span className="font-mono text-[11px] text-[#999] text-center p-2 leading-relaxed whitespace-pre-line">
        {label}
      </span>
    </div>
  );
}
