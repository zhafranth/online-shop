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
      <nav className="fixed top-0 left-0 right-0 z-[1000] bg-white border-b border-site-border">
        <div className="max-w-[1280px] mx-auto px-4 md:px-10 flex items-center h-[72px]">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="md:hidden text-site-text mr-3 p-1 -ml-1"
            aria-label="Open menu"
          >
            <Menu size={22} strokeWidth={1.6} />
          </button>
          <Link href="/" className="font-serif text-[20px] md:text-[22px] font-semibold text-site-text tracking-[0.18em] md:mr-12 shrink-0 no-underline uppercase">
            ThickApparel
          </Link>
          <div className="hidden md:flex gap-8 flex-1">
            {NAV_LINKS.map((link) => (
              <Link key={link.label} href={link.href} className="text-site-text/70 text-[12px] font-medium tracking-[0.14em] uppercase no-underline transition-colors duration-200 pb-0.5 border-b-[1px] border-transparent hover:text-site-text hover:border-site-text">
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex gap-4 md:gap-5 items-center ml-auto">
            <Search size={19} className="text-site-text/70 cursor-pointer hover:text-site-text transition-colors hidden sm:block" strokeWidth={1.6} />
            <Heart size={19} className="text-site-text/70 cursor-pointer hover:text-site-text transition-colors hidden sm:block" strokeWidth={1.6} />
            <Link href="/cart" className="relative">
              <ShoppingBag size={19} className="text-site-text/70 hover:text-site-text transition-colors" strokeWidth={1.6} />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-site-text text-white w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            <Link href="/login" className="hidden sm:inline-block text-site-text/70 text-[11px] tracking-[0.14em] uppercase font-medium no-underline hover:text-site-text transition-colors">
              Masuk
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div
        className={`md:hidden fixed inset-0 z-[1001] transition-opacity duration-200 ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      >
        <div className="absolute inset-0 bg-black/30" onClick={() => setMenuOpen(false)} />
        <aside
          className={`absolute top-0 left-0 bottom-0 w-[82%] max-w-[320px] bg-white text-site-text flex flex-col transition-transform duration-300 ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="flex items-center justify-between px-5 h-[72px] border-b border-site-border">
            <Link href="/" onClick={() => setMenuOpen(false)} className="font-serif text-[22px] font-semibold text-site-text tracking-[0.18em] no-underline uppercase">
              ThickApparel
            </Link>
            <button type="button" onClick={() => setMenuOpen(false)} aria-label="Close menu" className="p-1">
              <X size={22} strokeWidth={1.6} />
            </button>
          </div>
          <div className="flex flex-col py-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="px-5 py-3.5 text-site-text/85 text-sm font-medium tracking-[0.14em] uppercase no-underline border-b border-site-border hover:bg-cream"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="mt-auto border-t border-site-border p-5 flex flex-col gap-3">
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2.5 text-site-text/85 text-[12px] tracking-[0.14em] uppercase no-underline hover:text-site-text"
            >
              Masuk / Daftar
            </Link>
            <div className="flex items-center gap-5 text-site-gray">
              <Search size={20} strokeWidth={1.6} />
              <Heart size={20} strokeWidth={1.6} />
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
