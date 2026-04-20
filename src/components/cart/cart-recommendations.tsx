import Link from "next/link";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import { PlaceholderImage } from "@/components/ui/placeholder-image";

interface CartRecommendationsProps { products: Product[]; }

export function CartRecommendations({ products }: CartRecommendationsProps) {
  return (
    <div className="mb-8">
      <div className="font-serif text-lg mb-4">Lengkapi Penampilanmu</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {products.map((rp) => (
          <Link key={rp.id} href={`/product/${rp.id}`} className="flex gap-3 items-center p-3 border border-site-border no-underline text-site-text hover:border-navy transition-colors">
            <PlaceholderImage label={rp.label} className="w-[60px] h-[70px] shrink-0" />
            <div>
              <div className="font-serif text-[13px] mb-0.5">{rp.name}</div>
              <div className="text-xs text-gold font-semibold">{formatPrice(rp.price)}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
