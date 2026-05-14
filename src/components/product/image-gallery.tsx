"use client";
import { useState } from "react";
import { PlaceholderImage } from "@/components/ui/placeholder-image";

interface ImageGalleryProps {
  label: string;
  selectedColor: string;
  image: string;
}

const ALT_IMAGES = [
  "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80",
];

export function ImageGallery({ label, selectedColor, image }: ImageGalleryProps) {
  const gallery = [image, ...ALT_IMAGES];
  const [activeImg, setActiveImg] = useState(0);
  return (
    <div>
      <PlaceholderImage
        src={gallery[activeImg]}
        alt={`${label} – ${selectedColor}`}
        label={`${label}\nfoto utama – ${selectedColor}`}
        sizes="(max-width: 1024px) 100vw, 60vw"
        priority
        className="w-full h-[380px] sm:h-[460px] md:h-[540px]"
      />
      <div className="grid grid-cols-4 gap-2 mt-2.5">
        {gallery.map((src, i) => (
          <div
            key={i}
            onClick={() => setActiveImg(i)}
            className="cursor-pointer"
            style={{ outline: activeImg === i ? "2px solid #1a2744" : "2px solid transparent", outlineOffset: 1 }}
          >
            <PlaceholderImage src={src} alt={`foto ${i + 1}`} label={`foto ${i + 1}`} sizes="120px" className="w-full h-[70px] sm:h-[90px]" />
          </div>
        ))}
      </div>
    </div>
  );
}
