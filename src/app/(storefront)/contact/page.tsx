import { createClient } from "@/lib/supabase/server";
import ContactForm from "@/components/layout/ContactForm";
import { MapPin, Mail, Phone, Clock } from "lucide-react";
import WhatsAppIcon from "@/components/layout/WhatsAppIcon";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Foggy Nook — store address, business hours, and support channels.",
};

export default async function ContactPage() {
  const supabase = await createClient();
  const { data: settings } = await supabase.from("settings").select("*").eq("id", 1).single();

  return (
    <div className="container py-20">
      <div className="text-center mb-16">
        <p className="section-eyebrow">Get In Touch</p>
        <h1 className="section-title">Contact Us</h1>
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
        <ContactForm />

        <div className="space-y-6">
          <div className="glass-card p-6 flex items-start gap-4">
            <MapPin className="text-gold shrink-0 mt-1" size={20} />
            <div>
              <p className="text-white font-medium mb-1">Store Address</p>
              <p className="text-gray-muted text-sm">{settings?.store_address || "Karachi, Pakistan"}</p>
            </div>
          </div>

          <div className="glass-card p-6 flex items-start gap-4">
            <Clock className="text-gold shrink-0 mt-1" size={20} />
            <div>
              <p className="text-white font-medium mb-1">Business Hours</p>
              <p className="text-gray-muted text-sm">Monday – Saturday: 11:00 AM – 10:00 PM</p>
              <p className="text-gray-muted text-sm">Sunday: 2:00 PM – 9:00 PM</p>
            </div>
          </div>

          <div className="glass-card p-6 flex items-start gap-4">
            <Mail className="text-gold shrink-0 mt-1" size={20} />
            <div>
              <p className="text-white font-medium mb-1">Email</p>
              <p className="text-gray-muted text-sm">{settings?.store_email || "hello@foggynook.com"}</p>
            </div>
          </div>

          <div className="glass-card p-6 flex items-start gap-4">
            <Phone className="text-gold shrink-0 mt-1" size={20} />
            <div>
              <p className="text-white font-medium mb-1">Phone</p>
              <p className="text-gray-muted text-sm">{settings?.store_phone || "+92 300 1234567"}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={`https://wa.me/${settings?.whatsapp_number || "923001234567"}?text=Hello%2C%20I%20want%20to%20know%20about%20your%20products`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold flex-1"
            >
              <WhatsAppIcon size={16} /> {settings?.whatsapp_label || "Sales"} on WhatsApp
            </a>
            {settings?.whatsapp_number_2 && (
              <a
                href={`https://wa.me/${settings.whatsapp_number_2}?text=Hello%2C%20I%20need%20some%20help`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline-gold flex-1"
              >
                <WhatsAppIcon size={16} /> {settings?.whatsapp_label_2 || "Support"} on WhatsApp
              </a>
            )}
          </div>

          <div className="rounded-2xl overflow-hidden border border-gold/15 h-64">
            <iframe
              title="store-location"
              src={settings?.google_map_embed_url || "https://www.google.com/maps?q=Karachi,Pakistan&z=13&output=embed"}
              width="100%"
              height="100%"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="grayscale invert-[0.9] contrast-125"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
