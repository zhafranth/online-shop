"use client";
import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Heart, ShoppingBag, Menu, X, ChevronDown, ArrowUpRight } from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import { useMembershipStore } from "@/stores/membership-store";
import { useSettingsStore } from "@/stores/settings-store";

type NavLink =
  | { label: string; href: string }
  | {
      label: string;
      eyebrow: string;
      children: { label: string; href: string }[];
    };

export function Navbar() {
  const totalItems = useCartStore((state) => state.totalItems());
  const membershipPrograms = useMembershipStore((s) => s.programs);
  const brandName = useSettingsStore((s) => s.settings.branding.brandName);

  const NAV_LINKS = useMemo<NavLink[]>(() => {
    const links: NavLink[] = [
      { label: "Product", href: "/catalog" },
      {
        label: "Fashiontaiment",
        eyebrow: "Editorial",
        children: [
          { label: "Tips Mix & Match", href: "/magazine?category=tips-mix-match" },
          { label: "Fashion News", href: "/magazine?category=fashion-news" },
          { label: "Education", href: "/magazine?category=education" },
        ],
      },
    ];

    const visiblePrograms = membershipPrograms.filter(
      (p) => p.status !== "inactive",
    );
    if (visiblePrograms.length > 0) {
      links.push({
        label: "Membership",
        eyebrow: "Komunitas",
        children: visiblePrograms.map((p) => ({
          label: `${p.title} ${p.titleAccent}`.trim(),
          href: `/membership/${p.id}`,
        })),
      });
    }

    return links;
  }, [membershipPrograms]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMobile = () => {
    setMenuOpen(false);
    setMobileExpanded(null);
  };

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-[1000] bg-white border-b border-site-border"
        onMouseLeave={() => setHoverIndex(null)}
      >
        <div className="max-w-[1280px] mx-auto px-4 md:px-10 flex items-center h-[72px]">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="md:hidden text-site-text mr-3 p-1 -ml-1"
            aria-label="Open menu"
          >
            <Menu size={22} strokeWidth={1.6} />
          </button>
          <Link
            href="/"
            className="font-serif text-[20px] md:text-[22px] font-semibold text-site-text tracking-[0.18em] md:mr-12 shrink-0 no-underline uppercase flex items-center gap-2"
          >
            <Image
              src="/thickapparel-logo.png"
              alt={`${brandName} logo`}
              width={64}
              height={64}
              className="w-14 h-14 md:w-16 md:h-16 object-contain"
              priority
            />
            {brandName}
          </Link>
          <div className="hidden md:flex gap-8 flex-1">
            {NAV_LINKS.map((link, index) => {
              const hasChildren = "children" in link;
              const isOpen = hoverIndex === index;
              const baseClass =
                "flex items-center gap-1 text-site-text/70 text-[12px] font-medium tracking-[0.14em] uppercase no-underline transition-colors duration-200 pb-0.5 border-b-[1px] hover:text-site-text hover:border-site-text";
              const borderClass = isOpen
                ? "text-site-text border-site-text"
                : "border-transparent";

              if (!hasChildren) {
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    onMouseEnter={() => setHoverIndex(null)}
                    className={`${baseClass} ${borderClass}`}
                  >
                    {link.label}
                  </Link>
                );
              }

              return (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => setHoverIndex(index)}
                >
                  <button
                    type="button"
                    className={`${baseClass} ${borderClass} cursor-default`}
                    aria-expanded={isOpen}
                    aria-haspopup="true"
                  >
                    {link.label}
                    <ChevronDown
                      size={12}
                      strokeWidth={1.8}
                      className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                </div>
              );
            })}
          </div>
          <div className="flex gap-4 md:gap-5 items-center ml-auto">
            <Search
              size={19}
              className="text-site-text/70 cursor-pointer hover:text-site-text transition-colors hidden sm:block"
              strokeWidth={1.6}
            />
            <Heart
              size={19}
              className="text-site-text/70 cursor-pointer hover:text-site-text transition-colors hidden sm:block"
              strokeWidth={1.6}
            />
            <Link href="/cart" className="relative">
              <ShoppingBag
                size={19}
                className="text-site-text/70 hover:text-site-text transition-colors"
                strokeWidth={1.6}
              />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-site-text text-white w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            <Link
              href="/login"
              className="hidden sm:inline-block text-site-text/70 text-[11px] tracking-[0.14em] uppercase font-medium no-underline hover:text-site-text transition-colors"
            >
              Masuk
            </Link>
          </div>
        </div>

        {/* Desktop dropdown panel */}
        {NAV_LINKS.map((link, index) => {
          if (!("children" in link)) return null;
          const isOpen = hoverIndex === index;
          return (
            <div
              key={`panel-${link.label}`}
              className={`hidden md:block absolute left-0 right-0 top-full bg-white border-t border-site-border transition-all duration-200 ${
                isOpen
                  ? "opacity-100 translate-y-0 pointer-events-auto"
                  : "opacity-0 -translate-y-1 pointer-events-none"
              }`}
              onMouseEnter={() => setHoverIndex(index)}
            >
              <div className="max-w-[1280px] mx-auto px-10 py-8">
                <div className="text-[10px] tracking-[0.22em] uppercase text-site-gray mb-5 font-medium">
                  {link.eyebrow}
                </div>
                <div className="grid grid-cols-3 gap-2 max-w-[680px]">
                  {link.children.map((child) => (
                    <Link
                      key={child.label}
                      href={child.href}
                      onClick={() => setHoverIndex(null)}
                      className="group flex items-center justify-between py-3.5 pr-4 pl-2 border-t border-site-border no-underline text-site-text transition-colors hover:bg-cream"
                    >
                      <span className="font-serif text-[18px] leading-tight">
                        {child.label}
                      </span>
                      <ArrowUpRight
                        size={16}
                        strokeWidth={1.4}
                        className="text-site-gray transition-all duration-200 group-hover:text-site-text group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </nav>

      {/* Mobile drawer */}
      <div
        className={`md:hidden fixed inset-0 z-[1001] transition-opacity duration-200 ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="absolute inset-0 bg-black/30" onClick={closeMobile} />
        <aside
          className={`absolute top-0 left-0 bottom-0 w-[82%] max-w-[320px] bg-white text-site-text flex flex-col transition-transform duration-300 ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between px-5 h-[72px] border-b border-site-border">
            <Link
              href="/"
              onClick={closeMobile}
              className="font-serif text-[22px] font-semibold text-site-text tracking-[0.18em] no-underline uppercase flex items-center gap-2"
            >
              <Image
                src="/thickapparel-logo.png"
                alt={`${brandName} logo`}
                width={64}
                height={64}
                className="w-14 h-14 object-contain"
              />
              {brandName}
            </Link>
            <button
              type="button"
              onClick={closeMobile}
              aria-label="Close menu"
              className="p-1"
            >
              <X size={22} strokeWidth={1.6} />
            </button>
          </div>
          <div className="flex flex-col">
            {NAV_LINKS.map((link) => {
              const hasChildren = "children" in link;
              if (!hasChildren) {
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={closeMobile}
                    className="px-5 py-4 text-site-text text-sm font-medium tracking-[0.14em] uppercase no-underline border-b border-site-border hover:bg-cream"
                  >
                    {link.label}
                  </Link>
                );
              }
              const expanded = mobileExpanded === link.label;
              return (
                <div key={link.label} className="border-b border-site-border">
                  <button
                    type="button"
                    onClick={() =>
                      setMobileExpanded(expanded ? null : link.label)
                    }
                    aria-expanded={expanded}
                    className="w-full flex items-center justify-between px-5 py-4 text-site-text text-sm font-medium tracking-[0.14em] uppercase hover:bg-cream"
                  >
                    {link.label}
                    <ChevronDown
                      size={16}
                      strokeWidth={1.6}
                      className={`text-site-gray transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-[max-height] duration-300 ease-out ${expanded ? "max-h-[300px]" : "max-h-0"}`}
                  >
                    <div className="bg-cream/60 py-2">
                      {link.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          onClick={closeMobile}
                          className="block px-8 py-3 text-[13px] text-site-text/85 font-sans no-underline hover:text-site-text"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-auto border-t border-site-border p-5 flex flex-col gap-3">
            <Link
              href="/login"
              onClick={closeMobile}
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
