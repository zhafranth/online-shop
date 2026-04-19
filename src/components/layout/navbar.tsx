"use client";
import Link from "next/link";
import { Search, Heart, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/stores/cart-store";

const NAV_LINKS = [
  { label: "Men", href: "/catalog?cat=Men" },
  { label: "Women", href: "/catalog?cat=Women" },
  { label: "Unisex", href: "/catalog?cat=Unisex" },
  { label: "Sale", href: "/catalog?cat=Sale" },
];

export function Navbar() {
  const totalItems = useCartStore((state) => state.totalItems());
  return (
    <nav className="fixed top-0 left-0 right-0 z-[1000] bg-navy-dark border-b border-white/[0.08]">
      <div className="max-w-[1280px] mx-auto px-10 flex items-center h-[72px]">
        <Link href="/" className="font-serif text-[22px] font-bold text-gold tracking-[0.06em] mr-12 shrink-0 no-underline">
          VESTIRE
        </Link>
        <div className="flex gap-8 flex-1">
          {NAV_LINKS.map((link) => (
            <Link key={link.label} href={link.href} className="text-white/75 text-[13px] font-medium tracking-[0.1em] uppercase no-underline transition-colors duration-200 pb-0.5 border-b-[1.5px] border-transparent hover:text-white hover:border-gold">
              {link.label}
            </Link>
          ))}
        </div>
        <div className="flex gap-5 items-center">
          <Search size={20} className="text-white/75 cursor-pointer hover:text-white transition-colors" strokeWidth={1.8} />
          <Heart size={20} className="text-white/75 cursor-pointer hover:text-white transition-colors" strokeWidth={1.8} />
          <Link href="/cart" className="relative">
            <ShoppingBag size={20} className="text-white/75 hover:text-white transition-colors" strokeWidth={1.8} />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-gold text-white w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
          <Link href="/login" className="text-white/75 text-xs tracking-[0.08em] uppercase font-medium no-underline hover:text-white transition-colors">
            Masuk
          </Link>
        </div>
      </div>
    </nav>
  );
}
