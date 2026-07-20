import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";

export default async function StorefrontLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: settings } = await supabase.from("settings").select("*").eq("id", 1).single();

  return (
    <>
      <Navbar settings={settings} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
      <WhatsAppButton
        number={settings?.whatsapp_number}
        label={settings?.whatsapp_label}
        number2={settings?.whatsapp_number_2}
        label2={settings?.whatsapp_label_2}
      />
    </>
  );
}
