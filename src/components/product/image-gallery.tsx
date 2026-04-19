"use client";
import { useState } from "react";
import { PlaceholderImage } from "@/components/ui/placeholder-image";

interface ImageGalleryProps { label: string; selectedColor: string; }

export function ImageGallery({ label, selectedColor }: ImageGalleryProps) {
  const [activeImg, setActiveImg] = useState(0);
  return (
    <div>
      <PlaceholderImage label={`${label}\nfoto utama – ${selectedColor}`} className="w-full h-[540px]" />
      <div className="grid grid-cols-4 gap-2 mt-2.5">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} onClick={() => setActiveImg(i)} className="cursor-pointer" style={{ outline: activeImg === i ? "2px solid #1a2744" : "2px solid transparent", outlineOffset: 1 }}>
            <PlaceholderImage label={`foto ${i + 1}`} className="w-full h-[90px]" />
          </div>
        ))}
      </div>
    </div>
  );
}
