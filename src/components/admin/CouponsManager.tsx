"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { upsertCoupon, deleteCoupon, type CouponInput } from "@/lib/actions/admin-coupons";

interface Coupon extends CouponInput {
  id: string;
  used_count: number;
}

export default function CouponsManager({ coupons }: { coupons: Coupon[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<CouponInput>({
    code: "",
    discount_type: "percentage",
    discount_value: 10,
    min_order_amount: 0,
    usage_limit: undefined,
    is_active: true,
  });

  const openNew = () => {
    setEditing(null);
    setForm({ code: "", discount_type: "percentage", discount_value: 10, min_order_amount: 0, usage_limit: undefined, is_active: true });
    setShowForm(true);
  };

  const openEdit = (c: Coupon) => {
    setEditing(c);
    setForm({ ...c });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.code.trim()) return toast.error("Coupon code is required");
    setSaving(true);
    const result = await upsertCoupon(form, editing?.id);
    setSaving(false);
    if (result.success) {
      toast.success(editing ? "Coupon updated" : "Coupon created");
      setShowForm(false);
      router.refresh();
    } else toast.error(result.error || "Failed to save");
  };

  const handleDelete = async (c: Coupon) => {
    if (!confirm(`Delete coupon "${c.code}"?`)) return;
    const result = await deleteCoupon(c.id);
    if (result.success) {
      toast.success("Coupon deleted");
      router.refresh();
    } else toast.error(result.error || "Failed to delete");
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className={showForm ? "lg:col-span-2" : "lg:col-span-3"}>
        <div className="flex justify-end mb-4">
          <button onClick={openNew} className="btn-gold !px-6 !py-2.5 text-sm">
            <Plus size={16} /> Add Coupon
          </button>
        </div>

        <div className="glass-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gold/10 text-left text-gray-muted uppercase text-xs tracking-widest">
                <th className="p-4">Code</th>
                <th className="p-4">Discount</th>
                <th className="p-4">Min Order</th>
                <th className="p-4">Used</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c.id} className="border-b border-gold/5 hover:bg-white/[0.02]">
                  <td className="p-4 text-gold font-medium">{c.code}</td>
                  <td className="p-4 text-white">{c.discount_type === "percentage" ? `${c.discount_value}%` : `Rs. ${c.discount_value}`}</td>
                  <td className="p-4 text-gray-muted">{c.min_order_amount ? `Rs. ${c.min_order_amount}` : "—"}</td>
                  <td className="p-4 text-gray-muted">{c.used_count}{c.usage_limit ? ` / ${c.usage_limit}` : ""}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs ${c.is_active ? "bg-green-500/15 text-green-400" : "bg-gray-500/15 text-gray-muted"}`}>
                      {c.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEdit(c)} className="h-9 w-9 rounded-lg border border-gold/20 flex items-center justify-center text-gray-muted hover:text-gold">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => handleDelete(c)} className="h-9 w-9 rounded-lg border border-gold/20 flex items-center justify-center text-gray-muted hover:text-red-400">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!coupons.length && <tr><td colSpan={6} className="p-10 text-center text-gray-muted">No coupons yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="glass-card p-6 h-fit space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg text-white">{editing ? "Edit Coupon" : "New Coupon"}</h2>
            <button onClick={() => setShowForm(false)} className="text-gray-muted hover:text-white"><X size={18} /></button>
          </div>

          <div>
            <label className="text-sm text-gray-muted mb-2 block">Code *</label>
            <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="e.g. GOLD10" className="w-full bg-white/5 border border-gold/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-muted mb-2 block">Type</label>
              <select value={form.discount_type} onChange={(e) => setForm({ ...form, discount_type: e.target.value as any })} className="w-full bg-white/5 border border-gold/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold">
                <option value="percentage" className="bg-black-soft">Percentage</option>
                <option value="fixed" className="bg-black-soft">Fixed Amount</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-muted mb-2 block">Value</label>
              <input type="number" value={form.discount_value} onChange={(e) => setForm({ ...form, discount_value: Number(e.target.value) })} className="w-full bg-white/5 border border-gold/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-muted mb-2 block">Min Order Amount</label>
              <input type="number" value={form.min_order_amount || 0} onChange={(e) => setForm({ ...form, min_order_amount: Number(e.target.value) })} className="w-full bg-white/5 border border-gold/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold" />
            </div>
            <div>
              <label className="text-sm text-gray-muted mb-2 block">Usage Limit</label>
              <input type="number" value={form.usage_limit || ""} onChange={(e) => setForm({ ...form, usage_limit: e.target.value ? Number(e.target.value) : null })} placeholder="Unlimited" className="w-full bg-white/5 border border-gold/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold" />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-muted mb-2 block">Expires At</label>
            <input type="date" value={form.expires_at?.slice(0, 10) || ""} onChange={(e) => setForm({ ...form, expires_at: e.target.value })} className="w-full bg-white/5 border border-gold/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold" />
          </div>

          <label className="flex items-center gap-3 text-sm text-gray-muted cursor-pointer">
            <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="accent-gold h-4 w-4" />
            Active
          </label>

          <button onClick={handleSave} disabled={saving} className="btn-gold w-full disabled:opacity-60">
            {saving && <Loader2 size={16} className="animate-spin" />}
            {saving ? "Saving..." : "Save Coupon"}
          </button>
        </div>
      )}
    </div>
  );
}
