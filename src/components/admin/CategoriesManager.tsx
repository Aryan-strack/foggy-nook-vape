"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { upsertCategory, deleteCategory, type CategoryInput } from "@/lib/actions/admin-categories";
import { uploadProductImage } from "@/lib/actions/admin-products";
import type { Category } from "@/types";

export default function CategoriesManager({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<Category | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState<CategoryInput>({ name: "", description: "", image_url: "", sort_order: 0, is_active: true });

  const openNew = () => {
    setEditing(null);
    setForm({ name: "", description: "", image_url: "", sort_order: 0, is_active: true });
    setShowForm(true);
  };

  const openEdit = (cat: Category) => {
    setEditing(cat);
    setForm({
      name: cat.name,
      description: cat.description || "",
      image_url: cat.image_url || "",
      sort_order: cat.sort_order,
      is_active: cat.is_active,
    });
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
    if (result.success && result.url) setForm((f) => ({ ...f, image_url: result.url }));
    else toast.error(result.error || "Upload failed");
  };

  const handleSave = async () => {
    if (!form.name.trim()) return toast.error("Category name is required");
    setSaving(true);
    const result = await upsertCategory(form, editing?.id);
    setSaving(false);
    if (result.success) {
      toast.success(editing ? "Category updated" : "Category created");
      setShowForm(false);
      router.refresh();
    } else {
      toast.error(result.error || "Failed to save");
    }
  };

  const handleDelete = async (cat: Category) => {
    if (!confirm(`Delete category "${cat.name}"?`)) return;
    const result = await deleteCategory(cat.id);
    if (result.success) {
      toast.success("Category deleted");
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
            <Plus size={16} /> Add Category
          </button>
        </div>

        <div className="glass-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gold/10 text-left text-gray-muted uppercase text-xs tracking-widest">
                <th className="p-4">Category</th>
                <th className="p-4">Order</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id} className="border-b border-gold/5 hover:bg-white/[0.02]">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 rounded-lg overflow-hidden bg-white/5 shrink-0">
                        {cat.image_url && <Image src={cat.image_url} alt={cat.name} fill className="object-cover" />}
                      </div>
                      <span className="text-white font-medium">{cat.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-muted">{cat.sort_order}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs ${cat.is_active ? "bg-green-500/15 text-green-400" : "bg-gray-500/15 text-gray-muted"}`}>
                      {cat.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEdit(cat)} className="h-9 w-9 rounded-lg border border-gold/20 flex items-center justify-center text-gray-muted hover:text-gold">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => handleDelete(cat)} className="h-9 w-9 rounded-lg border border-gold/20 flex items-center justify-center text-gray-muted hover:text-red-400">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!categories.length && (
                <tr><td colSpan={4} className="p-10 text-center text-gray-muted">No categories yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="glass-card p-6 h-fit space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg text-white">{editing ? "Edit Category" : "New Category"}</h2>
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
            <label className="text-sm text-gray-muted mb-2 block">Image</label>
            {form.image_url ? (
              <div className="relative aspect-video rounded-xl overflow-hidden mb-2">
                <Image src={form.image_url} alt="" fill className="object-cover" />
              </div>
            ) : null}
            <label className="flex items-center justify-center gap-2 border-2 border-dashed border-gold/30 rounded-xl py-4 text-sm text-gray-muted hover:text-gold hover:border-gold cursor-pointer">
              {uploading ? <Loader2 size={16} className="animate-spin" /> : "Upload Image"}
              <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
            </label>
          </div>

          <div>
            <label className="text-sm text-gray-muted mb-2 block">Sort Order</label>
            <input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} className="w-full bg-white/5 border border-gold/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold" />
          </div>

          <label className="flex items-center gap-3 text-sm text-gray-muted cursor-pointer">
            <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="accent-gold h-4 w-4" />
            Active (visible on storefront)
          </label>

          <button onClick={handleSave} disabled={saving} className="btn-gold w-full disabled:opacity-60">
            {saving && <Loader2 size={16} className="animate-spin" />}
            {saving ? "Saving..." : "Save Category"}
          </button>
        </div>
      )}
    </div>
  );
}
