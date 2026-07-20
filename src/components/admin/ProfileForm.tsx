"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function ProfileForm({ userId, initialName, email }: { userId: string; initialName: string; email: string }) {
  const [name, setName] = useState(initialName);
  const [saving, setSaving] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleSaveProfile = async () => {
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase.from("users").update({ full_name: name }).eq("id", userId);
    setSaving(false);
    if (error) toast.error(error.message);
    else toast.success("Profile updated");
  };

  const handleChangePassword = async () => {
    if (newPassword.length < 6) return toast.error("New password must be at least 6 characters");
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setSaving(false);
    if (error) toast.error(error.message);
    else {
      toast.success("Password updated");
      setCurrentPassword("");
      setNewPassword("");
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="glass-card p-6 space-y-5">
        <h2 className="font-display text-lg text-white">Profile Information</h2>
        <div>
          <label className="text-sm text-gray-muted mb-2 block">Full Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-white/5 border border-gold/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold" />
        </div>
        <div>
          <label className="text-sm text-gray-muted mb-2 block">Email</label>
          <input value={email} disabled className="w-full bg-white/5 border border-gold/20 rounded-xl px-4 py-3 text-gray-muted opacity-60" />
        </div>
        <button onClick={handleSaveProfile} disabled={saving} className="btn-gold disabled:opacity-60">
          {saving && <Loader2 size={16} className="animate-spin" />} Save Changes
        </button>
      </div>

      <div className="glass-card p-6 space-y-5">
        <h2 className="font-display text-lg text-white">Change Password</h2>
        <div>
          <label className="text-sm text-gray-muted mb-2 block">New Password</label>
          <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full bg-white/5 border border-gold/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold" />
        </div>
        <button onClick={handleChangePassword} disabled={saving} className="btn-outline-gold disabled:opacity-60">
          {saving && <Loader2 size={16} className="animate-spin" />} Update Password
        </button>
      </div>
    </div>
  );
}
