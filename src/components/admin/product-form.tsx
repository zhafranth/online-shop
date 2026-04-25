"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, X } from "lucide-react";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useProductStore } from "@/stores/product-store";

const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "2XL", "3XL", "28", "30", "32", "34", "36", "One Size"];
const CATEGORIES: Product["category"][] = ["Men", "Women", "Unisex", "Aksesoris"];
const BADGES: ("NEW" | "BEST SELLER" | "SALE")[] = ["NEW", "BEST SELLER", "SALE"];

interface ProductFormProps {
  mode: "create" | "edit";
  product?: Product;
}

export function ProductForm({ mode, product }: ProductFormProps) {
  const router = useRouter();
  const addProduct = useProductStore((s) => s.addProduct);
  const updateProduct = useProductStore((s) => s.updateProduct);

  const [image, setImage] = useState(product?.image ?? "");
  const [name, setName] = useState(product?.name ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [price, setPrice] = useState<number | "">(product?.price ?? "");
  const [originalPrice, setOriginalPrice] = useState<number | "">(product?.originalPrice ?? "");
  const [category, setCategory] = useState<Product["category"]>(product?.category ?? "Unisex");
  const [sizes, setSizes] = useState<string[]>(product?.sizes ?? []);
  const [colors, setColors] = useState<string[]>(product?.colors ?? []);
  const [colorInput, setColorInput] = useState("");
  const [badge, setBadge] = useState<Product["badge"]>(product?.badge ?? null);
  const [stock, setStock] = useState<number | "">(product?.stock ?? "");
  const [error, setError] = useState("");

  const toggleSize = (s: string) => {
    setSizes((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  };

  const addColor = () => {
    const c = colorInput.trim();
    if (c && !colors.includes(c)) setColors((prev) => [...prev, c]);
    setColorInput("");
  };

  const removeColor = (c: string) => setColors((prev) => prev.filter((x) => x !== c));

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!image.trim()) return setError("URL gambar wajib diisi.");
    if (!name.trim()) return setError("Nama produk wajib diisi.");
    if (!description.trim()) return setError("Deskripsi wajib diisi.");
    if (price === "" || price <= 0) return setError("Harga harus lebih dari 0.");
    if (sizes.length === 0) return setError("Pilih minimal satu ukuran.");
    if (colors.length === 0) return setError("Tambahkan minimal satu warna.");
    if (stock === "" || stock < 0) return setError("Stok tidak boleh negatif.");

    const data = {
      image: image.trim(),
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      originalPrice: originalPrice === "" ? null : Number(originalPrice),
      category,
      sizes,
      colors,
      badge,
      stock: Number(stock),
      label: name.trim().toLowerCase(),
    };

    if (mode === "create") {
      addProduct(data);
    } else if (product) {
      updateProduct(product.id, data);
    }
    router.push("/admin/products");
  };

  return (
    <form onSubmit={onSubmit} className="bg-white border border-site-border p-7 max-w-3xl space-y-5">
      <div>
        <label className="block text-xs font-medium tracking-[0.06em] text-site-gray uppercase mb-1.5">
          Gambar Produk (URL)
        </label>
        <div className="flex gap-3">
          <input
            type="url"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="https://..."
            className="flex-1 px-4 py-3 border-[1.5px] border-site-border bg-white font-sans text-sm text-site-text outline-none focus:border-navy"
          />
          <button
            type="button"
            disabled
            title="Coming soon — simpan URL gambar saja"
            className="px-4 py-3 border-[1.5px] border-site-border bg-cream text-site-gray text-sm flex items-center gap-2 cursor-not-allowed"
          >
            <Upload size={15} />
            Upload
          </button>
        </div>
        {image && (
          <img
            src={image}
            alt="Preview"
            className="mt-3 w-32 h-40 object-cover border border-site-border bg-cream"
            onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = "none")}
          />
        )}
      </div>

      <Input id="p-name" label="Nama Produk" value={name} onChange={(e) => setName(e.target.value)} required />

      <div>
        <label htmlFor="p-desc" className="block text-xs font-medium tracking-[0.06em] text-site-gray uppercase mb-1.5">
          Deskripsi
        </label>
        <textarea
          id="p-desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          required
          className="w-full px-4 py-3 border-[1.5px] border-site-border bg-white font-sans text-sm text-site-text outline-none focus:border-navy resize-y"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input id="p-price" label="Harga (Rp)" type="number" min={0} value={price} onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))} required />
        <Input id="p-orig-price" label="Harga Asli (opsional)" type="number" min={0} value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value === "" ? "" : Number(e.target.value))} />
      </div>

      <div>
        <label className="block text-xs font-medium tracking-[0.06em] text-site-gray uppercase mb-1.5">Kategori</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as Product["category"])}
          className="w-full px-4 py-3 border-[1.5px] border-site-border bg-white font-sans text-sm text-site-text outline-none focus:border-navy"
        >
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium tracking-[0.06em] text-site-gray uppercase mb-1.5">Ukuran</label>
        <div className="flex flex-wrap gap-2">
          {SIZE_OPTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => toggleSize(s)}
              className={`px-3 py-1.5 text-[12px] font-medium tracking-[0.06em] border-[1.5px] transition-colors ${
                sizes.includes(s) ? "border-navy bg-navy text-white" : "border-site-border bg-white text-site-gray-dark hover:border-navy/50"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium tracking-[0.06em] text-site-gray uppercase mb-1.5">Warna</label>
        <div className="flex gap-2">
          <input
            value={colorInput}
            onChange={(e) => setColorInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addColor(); } }}
            placeholder="Tambah warna lalu tekan Enter"
            className="flex-1 px-4 py-3 border-[1.5px] border-site-border bg-white font-sans text-sm text-site-text outline-none focus:border-navy"
          />
          <button type="button" onClick={addColor} className="px-4 py-3 border-[1.5px] border-navy bg-navy text-white text-sm font-medium">Tambah</button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {colors.map((c) => (
            <span key={c} className="inline-flex items-center gap-1.5 px-3 py-1 text-[12px] bg-cream border border-site-border">
              {c}
              <button type="button" onClick={() => removeColor(c)} aria-label={`Hapus ${c}`} className="text-site-gray hover:text-[#b91c1c]">
                <X size={13} />
              </button>
            </span>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium tracking-[0.06em] text-site-gray uppercase mb-1.5">Badge</label>
        <select
          value={badge ?? ""}
          onChange={(e) => setBadge(e.target.value === "" ? null : (e.target.value as Product["badge"]))}
          className="w-full px-4 py-3 border-[1.5px] border-site-border bg-white font-sans text-sm text-site-text outline-none focus:border-navy"
        >
          <option value="">— Tanpa badge —</option>
          {BADGES.map((b) => <option key={b} value={b}>{b}</option>)}
        </select>
      </div>

      <Input id="p-stock" label="Stok" type="number" min={0} value={stock} onChange={(e) => setStock(e.target.value === "" ? "" : Number(e.target.value))} required />

      {error && (
        <div className="px-3.5 py-2.5 text-[13px] bg-[#fef2f2] text-[#991b1b] border border-[#fecaca]">
          {error}
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <Button type="submit">{mode === "create" ? "Tambah Produk" : "Simpan Perubahan"}</Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/products")}>
          Batal
        </Button>
      </div>
    </form>
  );
}
