"use server";

import { createAdminClient } from "@/lib/supabase/server";

export interface ContactFormInput {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export async function submitContactForm(input: ContactFormInput) {
  const admin = createAdminClient();

  const { error } = await admin.from("notifications").insert({
    type: "contact_message",
    title: `New contact message from ${input.name}`,
    message: `${input.subject}: ${input.message.slice(0, 140)}`,
    link: null,
  });

  if (error) return { success: false, error: error.message };
  return { success: true };
}
