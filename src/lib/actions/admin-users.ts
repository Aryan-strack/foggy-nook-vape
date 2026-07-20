"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { UserRole } from "@/types";

export async function updateUserRole(userId: string, role: UserRole) {
  const admin = createAdminClient();
  const { error } = await admin.from("users").update({ role }).eq("id", userId);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/users");
  return { success: true };
}
