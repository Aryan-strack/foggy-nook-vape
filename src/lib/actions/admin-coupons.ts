"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface CouponInput {
  code: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  min_order_amount?: number;
  usage_limit?: number | null;
  is_active?: boolean;
  starts_at?: string | null;
  expires_at?: string | null;
}

export async function upsertCoupon(input: CouponInput, id?: string) {
  const admin = createAdminClient();
  const payload = {
    code: input.code.toUpperCase(),
    discount_type: input.discount_type,
    discount_value: input.discount_value,
    min_order_amount: input.min_order_amount || 0,
    usage_limit: input.usage_limit || null,
    is_active: input.is_active ?? true,
    starts_at: input.starts_at || null,
    expires_at: input.expires_at || null,
  };

  const { error } = id ? await admin.from("coupons").update(payload).eq("id", id) : await admin.from("coupons").insert(payload);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/coupons");
  return { success: true };
}

export async function deleteCoupon(id: string) {
  const admin = createAdminClient();
  const { error } = await admin.from("coupons").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/coupons");
  return { success: true };
}
