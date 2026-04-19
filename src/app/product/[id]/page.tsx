"use client";
import { use } from "react";
import Link from "next/link";
import { PRODUCTS } from "@/lib/constants";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Toast } from "@/components/ui/toast";
import { ImageGallery } from "@/components/product/image-gallery";
import { ProductInfo } from "@/components/product/product-info";
import { ProductTabs } from "@/components/product/product-tabs";
import { RelatedProducts } from "@/components/product/related-products";

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const product = PRODUCTS.find((p) => p.id === Number(id)) || PRODUCTS[0];
  const related = PRODUCTS.filter((x) => x.id !== product.id && (x.category === product.category || x.category === "Unisex")).slice(0, 4);

  return (
    <div className="min-h-screen pt-[72px] animate-fade-up">
      <Navbar />
      <div className="bg-cream py-3.5 border-b border-site-border">
        <div className="container-site">
          <div className="text-xs text-site-gray">
            <Link href="/" className="cursor-pointer hover:text-navy no-underline text-site-gray">Home</Link>
            {" › "}
            <Link href="/catalog" className="cursor-pointer hover:text-navy no-underline text-site-gray">Katalog</Link>
            {` › ${product.name}`}
          </div>
        </div>
      </div>
      <div className="container-site py-12 px-10">
        <div className="grid grid-cols-[1fr_440px] gap-[60px] items-start">
          <ImageGallery label={product.label} selectedColor={product.colors[0]} />
          <ProductInfo product={product} />
        </div>
      </div>
      <ProductTabs product={product} />
      <RelatedProducts products={related} />
      <Footer />
      <Toast />
    </div>
  );
}
