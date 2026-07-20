"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export interface ProductFormInput {
  name: string;
  sku: string;
  barcode?: string;
  brand_id?: string;
  category_id?: string;
  description?: string;
  specifications?: Record<string, string>;
  price: number;
  compare_at_price?: number;
  purchase_price?: number;
  stock_quantity: number;
  low_stock_threshold?: number;
  is_featured?: boolean;
  is_new_arrival?: boolean;
  is_best_seller?: boolean;
  is_flash_sale?: boolean;
  flash_sale_ends_at?: string;
  status?: "active" | "draft" | "archived";
  meta_title?: string;
  meta_description?: string;
  image_urls?: string[];
}

export async function createProduct(input: ProductFormInput) {
  const admin = createAdminClient();
  const slug = slugify(input.name);

  const { data: product, error } = await admin
    .from("products")
    .insert({
      name: input.name,
      slug,
      sku: input.sku,
      barcode: input.barcode || null,
      brand_id: input.brand_id || null,
      category_id: input.category_id || null,
      description: input.description || null,
      specifications: input.specifications || {},
      price: input.price,
      compare_at_price: input.compare_at_price || null,
      purchase_price: input.purchase_price || null,
      stock_quantity: input.stock_quantity,
      low_stock_threshold: input.low_stock_threshold ?? 5,
      is_featured: !!input.is_featured,
      is_new_arrival: !!input.is_new_arrival,
      is_best_seller: !!input.is_best_seller,
      is_flash_sale: !!input.is_flash_sale,
      flash_sale_ends_at: input.flash_sale_ends_at || null,
      status: input.status || "active",
      meta_title: input.meta_title || null,
      meta_description: input.meta_description || null,
    })
    .select()
    .single();

  if (error || !product) return { success: false, error: error?.message || "Failed to create product" };

  if (input.image_urls?.length) {
    await admin.from("product_images").insert(
      input.image_urls.map((url, i) => ({
        product_id: product.id,
        image_url: url,
        sort_order: i,
        is_primary: i === 0,
      }))
    );
  }

  // Initial stock entry
  if (input.stock_quantity > 0) {
    await admin.from("inventory").insert({
      product_id: product.id,
      movement_type: "purchase",
      quantity_change: input.stock_quantity,
      quantity_after: input.stock_quantity,
      purchase_price: input.purchase_price || null,
      selling_price: input.price,
      note: "Initial stock on product creation",
    });
  }

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  return { success: true, id: product.id };
}

export async function updateProduct(id: string, input: ProductFormInput) {
  const admin = createAdminClient();
  const slug = slugify(input.name);

  const { error } = await admin
    .from("products")
    .update({
      name: input.name,
      slug,
      sku: input.sku,
      barcode: input.barcode || null,
      brand_id: input.brand_id || null,
      category_id: input.category_id || null,
      description: input.description || null,
      specifications: input.specifications || {},
      price: input.price,
      compare_at_price: input.compare_at_price || null,
      purchase_price: input.purchase_price || null,
      low_stock_threshold: input.low_stock_threshold ?? 5,
      is_featured: !!input.is_featured,
      is_new_arrival: !!input.is_new_arrival,
      is_best_seller: !!input.is_best_seller,
      is_flash_sale: !!input.is_flash_sale,
      flash_sale_ends_at: input.flash_sale_ends_at || null,
      status: input.status || "active",
      meta_title: input.meta_title || null,
      meta_description: input.meta_description || null,
    })
    .eq("id", id);

  if (error) return { success: false, error: error.message };

  if (input.image_urls) {
    await admin.from("product_images").delete().eq("product_id", id);
    if (input.image_urls.length) {
      await admin.from("product_images").insert(
        input.image_urls.map((url, i) => ({
          product_id: id,
          image_url: url,
          sort_order: i,
          is_primary: i === 0,
        }))
      );
    }
  }

  revalidatePath("/admin/products");
  revalidatePath(`/product/${slug}`);
  revalidatePath("/shop");
  return { success: true };
}

export async function deleteProduct(id: string) {
  const admin = createAdminClient();
  const { error } = await admin.from("products").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/products");
  revalidatePath("/shop");
  return { success: true };
}

export async function uploadProductImage(formData: FormData) {
  const admin = createAdminClient();
  const file = formData.get("file") as File;
  if (!file) return { success: false, error: "No file provided" };

  const ext = file.name.split(".").pop();
  const path = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await admin.storage.from("product-images").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });

  if (error) return { success: false, error: error.message };

  const { data } = admin.storage.from("product-images").getPublicUrl(path);
  return { success: true, url: data.publicUrl };
}
