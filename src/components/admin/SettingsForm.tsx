"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Loader2, Upload } from "lucide-react";
import { updateSettings, type SettingsInput } from "@/lib/actions/admin-settings";
import { uploadProductImage } from "@/lib/actions/admin-products";

export default function SettingsForm({ initial }: { initial: SettingsInput }) {
  const [values, setValues] = useState<SettingsInput>(initial);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);

  const set = (key: keyof SettingsInput, val: any) => setValues((v) => ({ ...v, [key]: val }));
  const setSocial = (key: string, val: string) =>
    setValues((v) => ({ ...v, social_links: { ...v.social_links, [key]: val } }));

  const handleUpload = async (file: File, key: "logo_url" | "favicon_url", setUploading: (b: boolean) => void) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    const result = await uploadProductImage(formData);
    setUploading(false);
    if (result.success && result.url) set(key, result.url);
    else toast.error(result.error || "Upload failed");
  };

  const handleSave = async () => {
    setSaving(true);
    const result = await updateSettings(values);
    setSaving(false);
    if (result.success) toast.success("Settings saved");
    else toast.error(result.error || "Failed to save settings");
  };

  return (
    <div className="space-y-6">
      <div className="glass-card p-6 space-y-5">
        <h2 className="font-display text-lg text-white">Store Information</h2>
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="text-sm text-gray-muted mb-2 block">Store Name</label>
            <input value={values.store_name} onChange={(e) => set("store_name", e.target.value)} className="w-full bg-white/5 border border-gold/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold" />
          </div>
          <div>
            <label className="text-sm text-gray-muted mb-2 block">Store Email</label>
            <input value={values.store_email || ""} onChange={(e) => set("store_email", e.target.value)} className="w-full bg-white/5 border border-gold/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold" />
          </div>
          <div>
            <label className="text-sm text-gray-muted mb-2 block">Store Phone</label>
            <input value={values.store_phone || ""} onChange={(e) => set("store_phone", e.target.value)} className="w-full bg-white/5 border border-gold/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold" />
          </div>
        </div>
        <div>
          <label className="text-sm text-gray-muted mb-2 block">Store Address</label>
          <textarea rows={2} value={values.store_address || ""} onChange={(e) => set("store_address", e.target.value)} className="w-full bg-white/5 border border-gold/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold" />
        </div>
      </div>

      <div className="glass-card p-6 space-y-5">
        <h2 className="font-display text-lg text-white">WhatsApp Numbers</h2>
        <p className="text-gray-muted text-sm">
          Add a second number if you want, say, separate Sales and Support lines. Leave the
          second number blank to show only one WhatsApp button/link across the site.
        </p>
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="text-sm text-gray-muted mb-2 block">Number 1 (with country code, no +)</label>
            <input value={values.whatsapp_number || ""} onChange={(e) => set("whatsapp_number", e.target.value)} placeholder="923001234567" className="w-full bg-white/5 border border-gold/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold" />
          </div>
          <div>
            <label className="text-sm text-gray-muted mb-2 block">Number 1 Label</label>
            <input value={values.whatsapp_label || ""} onChange={(e) => set("whatsapp_label", e.target.value)} placeholder="Sales" className="w-full bg-white/5 border border-gold/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold" />
          </div>
          <div>
            <label className="text-sm text-gray-muted mb-2 block">Number 2 (optional)</label>
            <input value={values.whatsapp_number_2 || ""} onChange={(e) => set("whatsapp_number_2", e.target.value)} placeholder="923009876543" className="w-full bg-white/5 border border-gold/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold" />
          </div>
          <div>
            <label className="text-sm text-gray-muted mb-2 block">Number 2 Label</label>
            <input value={values.whatsapp_label_2 || ""} onChange={(e) => set("whatsapp_label_2", e.target.value)} placeholder="Support" className="w-full bg-white/5 border border-gold/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold" />
          </div>
        </div>
      </div>

      <div className="glass-card p-6 space-y-5">
        <h2 className="font-display text-lg text-white">Branding</h2>
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label className="text-sm text-gray-muted mb-2 block">Logo</label>
            {values.logo_url && (
              <div className="relative h-16 w-16 rounded-xl overflow-hidden bg-white/5 mb-2">
                <Image src={values.logo_url} alt="Logo" fill className="object-contain" />
              </div>
            )}
            <label className="flex items-center justify-center gap-2 border-2 border-dashed border-gold/30 rounded-xl py-3 text-sm text-gray-muted hover:text-gold hover:border-gold cursor-pointer">
              {uploadingLogo ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
              Upload Logo
              <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], "logo_url", setUploadingLogo)} />
            </label>
          </div>
          <div>
            <label className="text-sm text-gray-muted mb-2 block">Favicon</label>
            {values.favicon_url && (
              <div className="relative h-16 w-16 rounded-xl overflow-hidden bg-white/5 mb-2">
                <Image src={values.favicon_url} alt="Favicon" fill className="object-contain" />
              </div>
            )}
            <label className="flex items-center justify-center gap-2 border-2 border-dashed border-gold/30 rounded-xl py-3 text-sm text-gray-muted hover:text-gold hover:border-gold cursor-pointer">
              {uploadingFavicon ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
              Upload Favicon
              <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], "favicon_url", setUploadingFavicon)} />
            </label>
          </div>
        </div>
      </div>

      <div className="glass-card p-6 space-y-5">
        <h2 className="font-display text-lg text-white">Google Maps</h2>
        <div>
          <label className="text-sm text-gray-muted mb-2 block">
            Embed URL — from Google Maps: Share → Embed a map → copy the <code>src="..."</code> value.
            Or simply use: https://www.google.com/maps?q=YOUR+ADDRESS&z=15&output=embed
          </label>
          <textarea rows={2} value={values.google_map_embed_url || ""} onChange={(e) => set("google_map_embed_url", e.target.value)} placeholder="https://www.google.com/maps/embed?pb=..." className="w-full bg-white/5 border border-gold/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold" />
        </div>
      </div>

      <div className="glass-card p-6 space-y-5">
        <h2 className="font-display text-lg text-white">Social Links</h2>
        <div className="grid sm:grid-cols-2 gap-5">
          {["instagram", "facebook", "tiktok", "twitter"].map((key) => (
            <div key={key}>
              <label className="text-sm text-gray-muted mb-2 block capitalize">{key}</label>
              <input
                value={values.social_links?.[key] || ""}
                onChange={(e) => setSocial(key, e.target.value)}
                placeholder={`https://${key}.com/yourstore`}
                className="w-full bg-white/5 border border-gold/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card p-6 space-y-5">
        <h2 className="font-display text-lg text-white">SEO &amp; Analytics</h2>
        <div>
          <label className="text-sm text-gray-muted mb-2 block">Default Meta Title</label>
          <input value={values.meta_title || ""} onChange={(e) => set("meta_title", e.target.value)} className="w-full bg-white/5 border border-gold/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold" />
        </div>
        <div>
          <label className="text-sm text-gray-muted mb-2 block">Default Meta Description</label>
          <textarea rows={2} value={values.meta_description || ""} onChange={(e) => set("meta_description", e.target.value)} className="w-full bg-white/5 border border-gold/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold" />
        </div>
        <div>
          <label className="text-sm text-gray-muted mb-2 block">Google Analytics ID</label>
          <input value={values.analytics_id || ""} onChange={(e) => set("analytics_id", e.target.value)} placeholder="G-XXXXXXXXXX" className="w-full bg-white/5 border border-gold/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold" />
        </div>
      </div>

      <div className="glass-card p-6 space-y-5">
        <h2 className="font-display text-lg text-white">Homepage Hero Slider</h2>
        <p className="text-gray-muted text-sm">Each slide needs an image URL, title, subtitle, and CTA button.</p>
        {(values.hero_slides || []).map((slide, i) => (
          <div key={i} className="border border-gold/10 rounded-xl p-4 space-y-3 relative">
            <button
              type="button"
              onClick={() => set("hero_slides", (values.hero_slides || []).filter((_, idx) => idx !== i))}
              className="absolute top-3 right-3 text-gray-muted hover:text-red-400 text-xs"
            >
              Remove
            </button>
            <input
              value={slide.image}
              onChange={(e) => {
                const next = [...(values.hero_slides || [])];
                next[i] = { ...next[i], image: e.target.value };
                set("hero_slides", next);
              }}
              placeholder="Image URL"
              className="w-full bg-white/5 border border-gold/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-gold"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                value={slide.title}
                onChange={(e) => {
                  const next = [...(values.hero_slides || [])];
                  next[i] = { ...next[i], title: e.target.value };
                  set("hero_slides", next);
                }}
                placeholder="Title"
                className="bg-white/5 border border-gold/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-gold"
              />
              <input
                value={slide.subtitle}
                onChange={(e) => {
                  const next = [...(values.hero_slides || [])];
                  next[i] = { ...next[i], subtitle: e.target.value };
                  set("hero_slides", next);
                }}
                placeholder="Subtitle"
                className="bg-white/5 border border-gold/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-gold"
              />
              <input
                value={slide.cta_label}
                onChange={(e) => {
                  const next = [...(values.hero_slides || [])];
                  next[i] = { ...next[i], cta_label: e.target.value };
                  set("hero_slides", next);
                }}
                placeholder="Button Label"
                className="bg-white/5 border border-gold/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-gold"
              />
              <input
                value={slide.cta_link}
                onChange={(e) => {
                  const next = [...(values.hero_slides || [])];
                  next[i] = { ...next[i], cta_link: e.target.value };
                  set("hero_slides", next);
                }}
                placeholder="Button Link e.g. /shop"
                className="bg-white/5 border border-gold/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-gold"
              />
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => set("hero_slides", [...(values.hero_slides || []), { image: "", title: "", subtitle: "", cta_label: "Shop Now", cta_link: "/shop" }])}
          className="text-gold text-sm hover:underline"
        >
          + Add Slide
        </button>
      </div>

      <button onClick={handleSave} disabled={saving} className="btn-gold disabled:opacity-60">
        {saving && <Loader2 size={16} className="animate-spin" />}
        {saving ? "Saving..." : "Save Settings"}
      </button>
    </div>
  );
}
