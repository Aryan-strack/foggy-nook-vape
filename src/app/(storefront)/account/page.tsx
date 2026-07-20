import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import CustomerProfileForm from "@/components/account/CustomerProfileForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "My Profile" };

export default async function AccountProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirect=/account");

  const { data: customer } = await supabase.from("customers").select("*").eq("user_id", user.id).maybeSingle();

  return (
    <CustomerProfileForm
      email={user.email || ""}
      initial={{
        full_name: customer?.full_name || "",
        phone: customer?.phone || "",
        city: customer?.city || "",
        address: customer?.address || "",
        postal_code: customer?.postal_code || "",
      }}
    />
  );
}
