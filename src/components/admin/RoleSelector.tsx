"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateUserRole } from "@/lib/actions/admin-users";
import type { UserRole } from "@/types";

export default function RoleSelector({ userId, currentRole }: { userId: string; currentRole: UserRole }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const handleChange = async (role: UserRole) => {
    setSaving(true);
    const result = await updateUserRole(userId, role);
    setSaving(false);
    if (result.success) {
      toast.success("Role updated");
      router.refresh();
    } else {
      toast.error(result.error || "Failed to update role");
    }
  };

  return (
    <select
      defaultValue={currentRole}
      disabled={saving}
      onChange={(e) => handleChange(e.target.value as UserRole)}
      className="bg-white/5 border border-gold/20 rounded-full px-4 py-1.5 text-xs text-white focus:outline-none focus:border-gold disabled:opacity-50"
    >
      <option value="admin" className="bg-black-soft">Admin</option>
      <option value="staff" className="bg-black-soft">Staff</option>
      <option value="customer" className="bg-black-soft">Customer</option>
    </select>
  );
}
