import Link from "next/link";
import Image from "next/image";
import { Instagram, Facebook, MapPin, Mail, Phone } from "lucide-react";
import WhatsAppIcon from "./WhatsAppIcon";
import type { SiteSettings } from "@/types";

export default function Footer({ settings }: { settings?: Partial<SiteSettings> | null }) {
  const whatsappNumber = settings?.whatsapp_number || "923001234567";
  const whatsappNumber2 = settings?.whatsapp_number_2;
  const mapSrc =
    settings?.google_map_embed_url ||
    "https://www.google.com/maps?q=Karachi,Pakistan&z=13&output=embed";

  return (
    <footer className="bg-black-soft border-t border-gold/15 mt-24">
      <div className="container py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        <div>
          <div className="relative h-14 w-44 mb-4">
            <Image src={settings?.logo_url || "/logo.png"} alt={settings?.store_name || "Foggy Nook"} fill className="object-contain object-left" />
          </div>
          <p className="text-gray-muted text-sm leading-relaxed mb-6">
            Curated premium smoke &amp; vape collections. Discreet packaging, authentic brands, cash on delivery.
          </p>
          <div className="flex gap-4">
            <a href={settings?.social_links?.instagram || "#"} target="_blank" rel="noopener noreferrer" className="text-gray-muted hover:text-gold transition-colors" aria-label="Instagram">
              <Instagram size={18} />
            </a>
            <a href={settings?.social_links?.facebook || "#"} target="_blank" rel="noopener noreferrer" className="text-gray-muted hover:text-gold transition-colors" aria-label="Facebook">
              <Facebook size={18} />
            </a>
            <a
              href={`https://wa.me/${whatsappNumber}?text=Hello%20I%20want%20to%20know%20about%20your%20products`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-muted hover:text-gold transition-colors"
              aria-label="WhatsApp"
            >
              <WhatsAppIcon size={18} />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-gold text-xs uppercase tracking-[0.25em] mb-5">Shop</h4>
          <ul className="space-y-3 text-sm text-gray-muted">
            <li><Link href="/shop" className="hover:text-gold">All Products</Link></li>
            <li><Link href="/categories" className="hover:text-gold">Categories</Link></li>
            <li><Link href="/shop?filter=new" className="hover:text-gold">New Arrivals</Link></li>
            <li><Link href="/shop?filter=flash-sale" className="hover:text-gold">Flash Sale</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-gold text-xs uppercase tracking-[0.25em] mb-5">Company</h4>
          <ul className="space-y-3 text-sm text-gray-muted">
            <li><Link href="/about" className="hover:text-gold">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-gold">Contact</Link></li>
            <li><Link href="/faqs" className="hover:text-gold">FAQs</Link></li>
            <li><Link href="/return-policy" className="hover:text-gold">Return Policy</Link></li>
            <li><Link href="/privacy-policy" className="hover:text-gold">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-gold">Terms &amp; Conditions</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-gold text-xs uppercase tracking-[0.25em] mb-5">Get in Touch</h4>
          <ul className="space-y-3 text-sm text-gray-muted">
            <li className="flex items-center gap-2"><MapPin size={16} className="text-gold shrink-0" /> {settings?.store_address || "Karachi, Pakistan"}</li>
            <li className="flex items-center gap-2"><Phone size={16} className="text-gold shrink-0" /> {settings?.store_phone || "+92 300 1234567"}</li>
            <li className="flex items-center gap-2"><Mail size={16} className="text-gold shrink-0" /> {settings?.store_email || "hello@foggynook.com"}</li>
            <li className="flex items-center gap-2">
              <WhatsAppIcon size={16} className="text-gold shrink-0" />
              <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="hover:text-gold">
                {settings?.whatsapp_label || "Sales"}: +{whatsappNumber}
              </a>
            </li>
            {whatsappNumber2 && (
              <li className="flex items-center gap-2">
                <WhatsAppIcon size={16} className="text-gold shrink-0" />
                <a href={`https://wa.me/${whatsappNumber2}`} target="_blank" rel="noopener noreferrer" className="hover:text-gold">
                  {settings?.whatsapp_label_2 || "Support"}: +{whatsappNumber2}
                </a>
              </li>
            )}
          </ul>
          <div className="mt-5 rounded-xl overflow-hidden border border-gold/15 h-32">
            <iframe
              title="store-location"
              src={mapSrc}
              width="100%"
              height="100%"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="grayscale invert-[0.9] contrast-125"
            />
          </div>
        </div>
      </div>

      <div className="border-t border-gold/10 py-6 text-center text-xs text-gray-muted">
        © {new Date().getFullYear()} {settings?.store_name || "Foggy Nook"}. All rights reserved.
      </div>
    </footer>
  );
}
