"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export interface CategoryInput {
  name: string;
  parent_id?: string | null;
  image_url?: string | null;
  description?: string;
  sort_order?: number;
  is_active?: boolean;
}

export async function upsertCategory(input: CategoryInput, id?: string) {
  const admin = createAdminClient();
  const payload = {
    name: input.name,
    slug: slugify(input.name),
    parent_id: input.parent_id || null,
    image_url: input.image_url || null,
    description: input.description || null,
    sort_order: input.sort_order ?? 0,
    is_active: input.is_active ?? true,
  };

  const { error } = id
    ? await admin.from("categories").update(payload).eq("id", id)
    : await admin.from("categories").insert(payload);

  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/categories");
  revalidatePath("/");
  return { success: true };
}

export async function deleteCategory(id: string) {
  const admin = createAdminClient();
  const { error } = await admin.from("categories").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/categories");
  return { success: true };
}
