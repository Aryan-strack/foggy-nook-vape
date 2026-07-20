import { createClient } from "@/lib/supabase/server";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import SettingsForm from "@/components/admin/SettingsForm";

export default async function AdminSettingsPage() {
  const supabase = await createClient();
  const { data: settings } = await supabase.from("settings").select("*").eq("id", 1).single();

  return (
    <div>
      <AdminPageHeader title="Website Settings" description="Control your storefront's global configuration" />
      <SettingsForm
        initial={{
          store_name: settings?.store_name || "Foggy Nook",
          store_email: settings?.store_email || "",
          store_phone: settings?.store_phone || "",
          whatsapp_number: settings?.whatsapp_number || "",
          whatsapp_label: settings?.whatsapp_label || "Sales",
          whatsapp_number_2: settings?.whatsapp_number_2 || "",
          whatsapp_label_2: settings?.whatsapp_label_2 || "Support",
          store_address: settings?.store_address || "",
          google_map_embed_url: settings?.google_map_embed_url || "",
          logo_url: settings?.logo_url || "",
          favicon_url: settings?.favicon_url || "",
          social_links: settings?.social_links || {},
          meta_title: settings?.meta_title || "",
          meta_description: settings?.meta_description || "",
          analytics_id: settings?.analytics_id || "",
          hero_slides: settings?.hero_slides || [],
        }}
      />
    </div>
  );
}
