"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { updateCustomerProfile, type CustomerProfileInput } from "@/lib/actions/customer-profile";

export default function CustomerProfileForm({ email, initial }: { email: string; initial: CustomerProfileInput }) {
  const [values, setValues] = useState(initial);
  const [saving, setSaving] = useState(false);

  const set = (key: keyof CustomerProfileInput, val: string) => setValues((v) => ({ ...v, [key]: val }));

  const handleSave = async () => {
    setSaving(true);
    const result = await updateCustomerProfile(values);
    setSaving(false);
    if (result.success) toast.success("Profile updated");
    else toast.error(result.error || "Failed to update");
  };

  return (
    <div className="glass-card p-8 space-y-5">
      <h2 className="font-display text-xl text-white mb-2">Profile Details</h2>

      <div>
        <label className="text-sm text-gray-muted mb-2 block">Email</label>
        <input value={email} disabled className="w-full bg-white/5 border border-gold/20 rounded-xl px-4 py-3 text-gray-muted opacity-60" />
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="text-sm text-gray-muted mb-2 block">Full Name</label>
          <input value={values.full_name} onChange={(e) => set("full_name", e.target.value)} className="w-full bg-white/5 border border-gold/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold" />
        </div>
        <div>
          <label className="text-sm text-gray-muted mb-2 block">Phone</label>
          <input value={values.phone} onChange={(e) => set("phone", e.target.value)} className="w-full bg-white/5 border border-gold/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold" />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="text-sm text-gray-muted mb-2 block">City</label>
          <input value={values.city} onChange={(e) => set("city", e.target.value)} className="w-full bg-white/5 border border-gold/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold" />
        </div>
        <div>
          <label className="text-sm text-gray-muted mb-2 block">Postal Code</label>
          <input value={values.postal_code} onChange={(e) => set("postal_code", e.target.value)} className="w-full bg-white/5 border border-gold/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold" />
        </div>
      </div>

      <div>
        <label className="text-sm text-gray-muted mb-2 block">Default Address</label>
        <textarea rows={3} value={values.address} onChange={(e) => set("address", e.target.value)} className="w-full bg-white/5 border border-gold/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold" />
      </div>

      <button onClick={handleSave} disabled={saving} className="btn-gold disabled:opacity-60">
        {saving && <Loader2 size={16} className="animate-spin" />} Save Changes
      </button>
    </div>
  );
}
