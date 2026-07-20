"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface SettingsInput {
  store_name: string;
  store_email?: string;
  store_phone?: string;
  whatsapp_number?: string;
  whatsapp_label?: string;
  whatsapp_number_2?: string;
  whatsapp_label_2?: string;
  store_address?: string;
  google_map_embed_url?: string;
  logo_url?: string;
  favicon_url?: string;
  social_links?: Record<string, string>;
  meta_title?: string;
  meta_description?: string;
  analytics_id?: string;
  hero_slides?: { image: string; title: string; subtitle: string; cta_label: string; cta_link: string }[];
}

export async function updateSettings(input: SettingsInput) {
  const admin = createAdminClient();
  const { error } = await admin.from("settings").update(input).eq("id", 1);
  if (error) return { success: false, error: error.message };
  revalidatePath("/", "layout");
  return { success: true };
}
