"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { OrderStatus } from "@/types";

export async function updateOrderStatus(orderId: string, status: OrderStatus, note?: string) {
  const admin = createAdminClient();

  const { error } = await admin.from("orders").update({ status }).eq("id", orderId);
  if (error) return { success: false, error: error.message };

  await admin.from("order_status_history").insert({ order_id: orderId, status, note: note || null });

  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin/orders");
  return { success: true };
}
