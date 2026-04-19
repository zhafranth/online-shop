import Link from "next/link";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import { PlaceholderImage } from "@/components/ui/placeholder-image";

interface RelatedProductsProps { products: Product[]; }

export function RelatedProducts({ products }: RelatedProductsProps) {
  return (
    <div className="bg-cream py-[60px]">
      <div className="container-site">
        <h3 className="font-serif font-normal text-2xl mb-8 text-center">Mungkin Kamu Suka</h3>
        <div className="grid grid-cols-4 gap-5">
          {products.map((rp) => (
            <Link key={rp.id} href={`/product/${rp.id}`} className="group cursor-pointer block no-underline text-site-text">
              <div className="overflow-hidden">
                <PlaceholderImage label={rp.label} className="w-full h-[200px] transition-transform duration-400 group-hover:scale-[1.04]" />
              </div>
              <div className="pt-3">
                <div className="font-serif text-[0.9rem] font-medium mb-1">{rp.name}</div>
                <div className="text-[13px] text-site-gray"><span className="text-navy font-semibold">{formatPrice(rp.price)}</span></div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
