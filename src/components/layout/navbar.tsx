"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Heart, ShoppingBag, Menu, X } from "lucide-react";
import { useCartStore } from "@/stores/cart-store";

const NAV_LINKS = [
  { label: "Men", href: "/catalog?cat=Men" },
  { label: "Women", href: "/catalog?cat=Women" },
  { label: "Unisex", href: "/catalog?cat=Unisex" },
  { label: "Sale", href: "/catalog?cat=Sale" },
];

export function Navbar() {
  const totalItems = useCartStore((state) => state.totalItems());
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[1000] bg-navy-dark border-b border-white/[0.08]">
        <div className="max-w-[1280px] mx-auto px-4 md:px-10 flex items-center h-[72px]">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="md:hidden text-white/90 mr-3 p-1 -ml-1"
            aria-label="Open menu"
          >
            <Menu size={22} strokeWidth={1.8} />
          </button>
          <Link href="/" className="font-serif text-[20px] md:text-[22px] font-bold text-gold tracking-[0.06em] md:mr-12 shrink-0 no-underline">
            VESTIRE
          </Link>
          <div className="hidden md:flex gap-8 flex-1">
            {NAV_LINKS.map((link) => (
              <Link key={link.label} href={link.href} className="text-white/75 text-[13px] font-medium tracking-[0.1em] uppercase no-underline transition-colors duration-200 pb-0.5 border-b-[1.5px] border-transparent hover:text-white hover:border-gold">
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex gap-4 md:gap-5 items-center ml-auto">
            <Search size={20} className="text-white/75 cursor-pointer hover:text-white transition-colors hidden sm:block" strokeWidth={1.8} />
            <Heart size={20} className="text-white/75 cursor-pointer hover:text-white transition-colors hidden sm:block" strokeWidth={1.8} />
            <Link href="/cart" className="relative">
              <ShoppingBag size={20} className="text-white/75 hover:text-white transition-colors" strokeWidth={1.8} />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-gold text-white w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            <Link href="/login" className="hidden sm:inline-block text-white/75 text-xs tracking-[0.08em] uppercase font-medium no-underline hover:text-white transition-colors">
              Masuk
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div
        className={`md:hidden fixed inset-0 z-[1001] transition-opacity duration-200 ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      >
        <div className="absolute inset-0 bg-black/50" onClick={() => setMenuOpen(false)} />
        <aside
          className={`absolute top-0 left-0 bottom-0 w-[82%] max-w-[320px] bg-navy-dark text-white flex flex-col transition-transform duration-300 ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="flex items-center justify-between px-5 h-[72px] border-b border-white/[0.08]">
            <Link href="/" onClick={() => setMenuOpen(false)} className="font-serif text-[22px] font-bold text-gold tracking-[0.06em] no-underline">
              VESTIRE
            </Link>
            <button type="button" onClick={() => setMenuOpen(false)} aria-label="Close menu" className="p-1">
              <X size={22} strokeWidth={1.8} />
            </button>
          </div>
          <div className="flex flex-col py-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="px-5 py-3.5 text-white/85 text-sm font-medium tracking-[0.1em] uppercase no-underline border-b border-white/[0.06] hover:bg-white/[0.04] hover:text-gold"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="mt-auto border-t border-white/[0.08] p-5 flex flex-col gap-3">
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2.5 text-white/85 text-[13px] tracking-[0.08em] uppercase no-underline hover:text-gold"
            >
              Masuk / Daftar
            </Link>
            <div className="flex items-center gap-5 text-white/70">
              <Search size={20} strokeWidth={1.8} />
              <Heart size={20} strokeWidth={1.8} />
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
