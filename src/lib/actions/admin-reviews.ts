"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

async function recalculateProductRating(productId: string) {
  const admin = createAdminClient();
  const { data: reviews } = await admin.from("reviews").select("rating").eq("product_id", productId).eq("is_approved", true);
  const count = reviews?.length || 0;
  const avg = count ? reviews!.reduce((sum, r) => sum + r.rating, 0) / count : 0;
  await admin.from("products").update({ avg_rating: avg, review_count: count }).eq("id", productId);
}

export async function approveReview(reviewId: string, productId: string) {
  const admin = createAdminClient();
  const { error } = await admin.from("reviews").update({ is_approved: true }).eq("id", reviewId);
  if (error) return { success: false, error: error.message };
  await recalculateProductRating(productId);
  revalidatePath("/admin/reviews");
  revalidatePath(`/product`);
  return { success: true };
}

export async function deleteReview(reviewId: string, productId: string) {
  const admin = createAdminClient();
  const { error } = await admin.from("reviews").delete().eq("id", reviewId);
  if (error) return { success: false, error: error.message };
  await recalculateProductRating(productId);
  revalidatePath("/admin/reviews");
  return { success: true };
}

export async function replyToReview(reviewId: string, reply: string) {
  const admin = createAdminClient();
  const { error } = await admin.from("reviews").update({ admin_reply: reply }).eq("id", reviewId);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/reviews");
  return { success: true };
}
