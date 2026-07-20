"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { upsertBrand, deleteBrand, type BrandInput } from "@/lib/actions/admin-brands";
import { uploadProductImage } from "@/lib/actions/admin-products";
import type { Brand } from "@/types";

export default function BrandsManager({ brands }: { brands: Brand[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<Brand | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState<BrandInput>({ name: "", description: "", logo_url: "", is_active: true });

  const openNew = () => {
    setEditing(null);
    setForm({ name: "", description: "", logo_url: "", is_active: true });
    setShowForm(true);
  };

  const openEdit = (brand: Brand) => {
    setEditing(brand);
    setForm({ name: brand.name, description: brand.description || "", logo_url: brand.logo_url || "", is_active: brand.is_active });
    setShowForm(true);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    const result = await uploadProductImage(formData);
    setUploading(false);
    if (result.success && result.url) setForm((f) => ({ ...f, logo_url: result.url }));
    else toast.error(result.error || "Upload failed");
  };

  const handleSave = async () => {
    if (!form.name.trim()) return toast.error("Brand name is required");
    setSaving(true);
    const result = await upsertBrand(form, editing?.id);
    setSaving(false);
    if (result.success) {
      toast.success(editing ? "Brand updated" : "Brand created");
      setShowForm(false);
      router.refresh();
    } else {
      toast.error(result.error || "Failed to save");
    }
  };

  const handleDelete = async (brand: Brand) => {
    if (!confirm(`Delete brand "${brand.name}"?`)) return;
    const result = await deleteBrand(brand.id);
    if (result.success) {
      toast.success("Brand deleted");
      router.refresh();
    } else {
      toast.error(result.error || "Failed to delete");
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className={showForm ? "lg:col-span-2" : "lg:col-span-3"}>
        <div className="flex justify-end mb-4">
          <button onClick={openNew} className="btn-gold !px-6 !py-2.5 text-sm">
            <Plus size={16} /> Add Brand
          </button>
        </div>

        <div className="glass-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gold/10 text-left text-gray-muted uppercase text-xs tracking-widest">
                <th className="p-4">Brand</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {brands.map((b) => (
                <tr key={b.id} className="border-b border-gold/5 hover:bg-white/[0.02]">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 rounded-lg overflow-hidden bg-white/5 shrink-0">
                        {b.logo_url && <Image src={b.logo_url} alt={b.name} fill className="object-contain" />}
                      </div>
                      <span className="text-white font-medium">{b.name}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs ${b.is_active ? "bg-green-500/15 text-green-400" : "bg-gray-500/15 text-gray-muted"}`}>
                      {b.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEdit(b)} className="h-9 w-9 rounded-lg border border-gold/20 flex items-center justify-center text-gray-muted hover:text-gold">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => handleDelete(b)} className="h-9 w-9 rounded-lg border border-gold/20 flex items-center justify-center text-gray-muted hover:text-red-400">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!brands.length && (
                <tr><td colSpan={3} className="p-10 text-center text-gray-muted">No brands yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="glass-card p-6 h-fit space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg text-white">{editing ? "Edit Brand" : "New Brand"}</h2>
            <button onClick={() => setShowForm(false)} className="text-gray-muted hover:text-white"><X size={18} /></button>
          </div>

          <div>
            <label className="text-sm text-gray-muted mb-2 block">Name *</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-white/5 border border-gold/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold" />
          </div>

          <div>
            <label className="text-sm text-gray-muted mb-2 block">Description</label>
            <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full bg-white/5 border border-gold/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold" />
          </div>

          <div>
            <label className="text-sm text-gray-muted mb-2 block">Logo</label>
            {form.logo_url ? (
              <div className="relative h-20 w-20 rounded-xl overflow-hidden mb-2 bg-white/5">
                <Image src={form.logo_url} alt="" fill className="object-contain" />
              </div>
            ) : null}
            <label className="flex items-center justify-center gap-2 border-2 border-dashed border-gold/30 rounded-xl py-4 text-sm text-gray-muted hover:text-gold hover:border-gold cursor-pointer">
              {uploading ? <Loader2 size={16} className="animate-spin" /> : "Upload Logo"}
              <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
            </label>
          </div>

          <label className="flex items-center gap-3 text-sm text-gray-muted cursor-pointer">
            <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="accent-gold h-4 w-4" />
            Active (visible on storefront)
          </label>

          <button onClick={handleSave} disabled={saving} className="btn-gold w-full disabled:opacity-60">
            {saving && <Loader2 size={16} className="animate-spin" />}
            {saving ? "Saving..." : "Save Brand"}
          </button>
        </div>
      )}
    </div>
  );
}
