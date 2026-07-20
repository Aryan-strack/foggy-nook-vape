"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export interface BrandInput {
  name: string;
  logo_url?: string | null;
  description?: string;
  is_active?: boolean;
}

export async function upsertBrand(input: BrandInput, id?: string) {
  const admin = createAdminClient();
  const payload = {
    name: input.name,
    slug: slugify(input.name),
    logo_url: input.logo_url || null,
    description: input.description || null,
    is_active: input.is_active ?? true,
  };

  const { error } = id
    ? await admin.from("brands").update(payload).eq("id", id)
    : await admin.from("brands").insert(payload);

  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/brands");
  revalidatePath("/");
  return { success: true };
}

export async function deleteBrand(id: string) {
  const admin = createAdminClient();
  const { error } = await admin.from("brands").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/brands");
  return { success: true };
}
