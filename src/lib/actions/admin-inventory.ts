"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function adjustStock(productId: string, quantityChange: number, note: string) {
  const admin = createAdminClient();

  const { data: product, error: fetchError } = await admin
    .from("products")
    .select("stock_quantity")
    .eq("id", productId)
    .single();

  if (fetchError || !product) return { success: false, error: "Product not found" };

  const newStock = Math.max(0, product.stock_quantity + quantityChange);

  const { error: updateError } = await admin.from("products").update({ stock_quantity: newStock }).eq("id", productId);
  if (updateError) return { success: false, error: updateError.message };

  await admin.from("inventory").insert({
    product_id: productId,
    movement_type: "adjustment",
    quantity_change: quantityChange,
    quantity_after: newStock,
    note: note || "Manual stock adjustment",
  });

  revalidatePath("/admin/inventory");
  revalidatePath("/admin/products");
  return { success: true, newStock };
}
