"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function markNotificationRead(id: string) {
  const admin = createAdminClient();
  await admin.from("notifications").update({ is_read: true }).eq("id", id);
  revalidatePath("/admin/notifications");
  return { success: true };
}

export async function markAllNotificationsRead() {
  const admin = createAdminClient();
  await admin.from("notifications").update({ is_read: true }).eq("is_read", false);
  revalidatePath("/admin/notifications");
  return { success: true };
}
