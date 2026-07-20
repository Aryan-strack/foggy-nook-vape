"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface CustomerProfileInput {
  full_name: string;
  phone: string;
  city?: string;
  address?: string;
  postal_code?: string;
}

export async function updateCustomerProfile(input: CustomerProfileInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Not authenticated" };

  const { data: existing } = await supabase.from("customers").select("id").eq("user_id", user.id).maybeSingle();

  const payload = { ...input, user_id: user.id, email: user.email };

  const { error } = existing
    ? await supabase.from("customers").update(payload).eq("id", existing.id)
    : await supabase.from("customers").insert(payload);

  if (error) return { success: false, error: error.message };

  await supabase.from("users").update({ full_name: input.full_name, phone: input.phone }).eq("id", user.id);

  revalidatePath("/account");
  return { success: true };
}
