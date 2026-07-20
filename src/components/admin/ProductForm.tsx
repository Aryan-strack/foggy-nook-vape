"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createProduct, updateProduct, uploadProductImage, type ProductFormInput } from "@/lib/actions/admin-products";
import { Loader2, Upload, X, Plus } from "lucide-react";
import { toast } from "sonner";
import type { Brand, Category } from "@/types";

interface Props {
  brands: Brand[];
  categories: Category[];
  productId?: string;
  initialValues?: Partial<ProductFormInput> & { image_urls?: string[] };
}

export default function ProductForm({ brands, categories, productId, initialValues }: Props) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<string[]>(initialValues?.image_urls || []);
  const [specs, setSpecs] = useState<[string, string][]>(
    initialValues?.specifications ? Object.entries(initialValues.specifications) : [["", ""]]
  );
  const [values, setValues] = useState<Partial<ProductFormInput>>({
    status: "active",
    stock_quantity: 0,
    low_stock_threshold: 5,
    ...initialValues,
  });

  const set = (key: keyof ProductFormInput, val: any) => setValues((v) => ({ ...v, [key]: val }));

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);
      const result = await uploadProductImage(formData);
      if (result.success && result.url) {
        setImages((imgs) => [...imgs, result.url!]);
      } else {
        toast.error(result.error || "Upload failed");
      }
    }
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!values.name || !values.sku || !values.price) {
      toast.error("Name, SKU, and Price are required");
      return;
    }
    setSubmitting(true);

    const specifications = Object.fromEntries(specs.filter(([k]) => k.trim()));
    const payload: ProductFormInput = {
      ...(values as ProductFormInput),
      specifications,
      image_urls: images,
    };

    const result = productId ? await updateProduct(productId, payload) : await createProduct(payload);
    setSubmitting(false);

    if (result.success) {
      toast.success(productId ? "Product updated" : "Product created");
      router.push("/admin/products");
      router.refresh();
    } else {
      toast.error(result.error || "Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="glass-card p-6 space-y-5">
          <h2 className="font-display text-lg text-white">Basic Information</h2>

          <div>
            <label className="text-sm text-gray-muted mb-2 block">Product Name *</label>
            <input
              value={values.name || ""}
              onChange={(e) => set("name", e.target.value)}
              className="w-full bg-white/5 border border-gold/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="text-sm text-gray-muted mb-2 block">SKU *</label>
              <input
                value={values.sku || ""}
                onChange={(e) => set("sku", e.target.value)}
                className="w-full bg-white/5 border border-gold/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold"
              />
            </div>
            <div>
              <label className="text-sm text-gray-muted mb-2 block">Barcode</label>
              <input
                value={values.barcode || ""}
                onChange={(e) => set("barcode", e.target.value)}
                className="w-full bg-white/5 border border-gold/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-muted mb-2 block">Description</label>
            <textarea
              rows={5}
              value={values.description || ""}
              onChange={(e) => set("description", e.target.value)}
              className="w-full bg-white/5 border border-gold/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold"
            />
          </div>
        </div>

        <div className="glass-card p-6 space-y-4">
          <h2 className="font-display text-lg text-white">Specifications</h2>
          {specs.map(([key, val], i) => (
            <div key={i} className="flex gap-3">
              <input
                placeholder="e.g. Coil Type"
                value={key}
                onChange={(e) => setSpecs((s) => s.map((row, idx) => (idx === i ? [e.target.value, row[1]] : row)))}
                className="flex-1 bg-white/5 border border-gold/20 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold"
              />
              <input
                placeholder="e.g. Mesh 0.4Ω"
                value={val}
                onChange={(e) => setSpecs((s) => s.map((row, idx) => (idx === i ? [row[0], e.target.value] : row)))}
                className="flex-1 bg-white/5 border border-gold/20 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold"
              />
              <button type="button" onClick={() => setSpecs((s) => s.filter((_, idx) => idx !== i))} className="text-gray-muted hover:text-red-400 px-2">
                <X size={16} />
              </button>
            </div>
          ))}
          <button type="button" onClick={() => setSpecs((s) => [...s, ["", ""]])} className="text-gold text-sm flex items-center gap-1 hover:underline">
            <Plus size={14} /> Add Specification
          </button>
        </div>

        <div className="glass-card p-6 space-y-4">
          <h2 className="font-display text-lg text-white">Product Images</h2>
          <div className="grid grid-cols-4 gap-3">
            {images.map((url, i) => (
              <div key={url} className="relative aspect-square rounded-xl overflow-hidden group">
                <Image src={url} alt="" fill className="object-cover" />
                {i === 0 && <span className="absolute top-1 left-1 bg-gold text-black text-[10px] px-2 py-0.5 rounded-full">Primary</span>}
                <button
                  type="button"
                  onClick={() => setImages((imgs) => imgs.filter((u) => u !== url))}
                  className="absolute top-1 right-1 h-6 w-6 rounded-full bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
            <label className="aspect-square rounded-xl border-2 border-dashed border-gold/30 flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-gold text-gray-muted hover:text-gold">
              {uploading ? <Loader2 size={20} className="animate-spin" /> : <Upload size={20} />}
              <span className="text-xs">Upload</span>
              <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="glass-card p-6 space-y-5">
          <h2 className="font-display text-lg text-white">Pricing &amp; Stock</h2>
          <div>
            <label className="text-sm text-gray-muted mb-2 block">Selling Price *</label>
            <input
              type="number"
              step="0.01"
              value={values.price || ""}
              onChange={(e) => set("price", Number(e.target.value))}
              className="w-full bg-white/5 border border-gold/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold"
            />
          </div>
          <div>
            <label className="text-sm text-gray-muted mb-2 block">Compare-at Price</label>
            <input
              type="number"
              step="0.01"
              value={values.compare_at_price || ""}
              onChange={(e) => set("compare_at_price", Number(e.target.value))}
              className="w-full bg-white/5 border border-gold/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold"
            />
          </div>
          <div>
            <label className="text-sm text-gray-muted mb-2 block">Purchase Price</label>
            <input
              type="number"
              step="0.01"
              value={values.purchase_price || ""}
              onChange={(e) => set("purchase_price", Number(e.target.value))}
              className="w-full bg-white/5 border border-gold/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-muted mb-2 block">Stock Qty *</label>
              <input
                type="number"
                disabled={!!productId}
                value={values.stock_quantity ?? 0}
                onChange={(e) => set("stock_quantity", Number(e.target.value))}
                className="w-full bg-white/5 border border-gold/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold disabled:opacity-40"
              />
              {productId && <p className="text-[11px] text-gray-muted mt-1">Adjust stock from the Inventory page</p>}
            </div>
            <div>
              <label className="text-sm text-gray-muted mb-2 block">Low Stock Alert</label>
              <input
                type="number"
                value={values.low_stock_threshold ?? 5}
                onChange={(e) => set("low_stock_threshold", Number(e.target.value))}
                className="w-full bg-white/5 border border-gold/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold"
              />
            </div>
          </div>
        </div>

        <div className="glass-card p-6 space-y-5">
          <h2 className="font-display text-lg text-white">Organization</h2>
          <div>
            <label className="text-sm text-gray-muted mb-2 block">Category</label>
            <select
              value={values.category_id || ""}
              onChange={(e) => set("category_id", e.target.value)}
              className="w-full bg-white/5 border border-gold/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold"
            >
              <option value="" className="bg-black-soft">Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id} className="bg-black-soft">{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-muted mb-2 block">Brand</label>
            <select
              value={values.brand_id || ""}
              onChange={(e) => set("brand_id", e.target.value)}
              className="w-full bg-white/5 border border-gold/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold"
            >
              <option value="" className="bg-black-soft">Select brand</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id} className="bg-black-soft">{b.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-muted mb-2 block">Status</label>
            <select
              value={values.status || "active"}
              onChange={(e) => set("status", e.target.value)}
              className="w-full bg-white/5 border border-gold/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold"
            >
              <option value="active" className="bg-black-soft">Active</option>
              <option value="draft" className="bg-black-soft">Draft</option>
              <option value="archived" className="bg-black-soft">Archived</option>
            </select>
          </div>
        </div>

        <div className="glass-card p-6 space-y-3">
          <h2 className="font-display text-lg text-white mb-2">Flags</h2>
          {[
            ["is_featured", "Featured Product"],
            ["is_new_arrival", "New Arrival"],
            ["is_best_seller", "Best Seller"],
            ["is_flash_sale", "Flash Sale"],
          ].map(([key, label]) => (
            <label key={key} className="flex items-center gap-3 text-sm text-gray-muted cursor-pointer">
              <input
                type="checkbox"
                checked={!!(values as any)[key]}
                onChange={(e) => set(key as keyof ProductFormInput, e.target.checked)}
                className="accent-gold h-4 w-4"
              />
              {label}
            </label>
          ))}
          {values.is_flash_sale && (
            <div className="pt-2">
              <label className="text-sm text-gray-muted mb-2 block">Flash Sale Ends At</label>
              <input
                type="datetime-local"
                value={values.flash_sale_ends_at || ""}
                onChange={(e) => set("flash_sale_ends_at", e.target.value)}
                className="w-full bg-white/5 border border-gold/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold"
              />
            </div>
          )}
        </div>

        <div className="glass-card p-6 space-y-5">
          <h2 className="font-display text-lg text-white">SEO</h2>
          <div>
            <label className="text-sm text-gray-muted mb-2 block">Meta Title</label>
            <input
              value={values.meta_title || ""}
              onChange={(e) => set("meta_title", e.target.value)}
              className="w-full bg-white/5 border border-gold/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold"
            />
          </div>
          <div>
            <label className="text-sm text-gray-muted mb-2 block">Meta Description</label>
            <textarea
              rows={3}
              value={values.meta_description || ""}
              onChange={(e) => set("meta_description", e.target.value)}
              className="w-full bg-white/5 border border-gold/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold"
            />
          </div>
        </div>

        <button type="submit" disabled={submitting} className="btn-gold w-full disabled:opacity-60">
          {submitting && <Loader2 size={16} className="animate-spin" />}
          {submitting ? "Saving..." : productId ? "Update Product" : "Create Product"}
        </button>
      </div>
    </form>
  );
}
