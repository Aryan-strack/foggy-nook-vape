"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Send } from "lucide-react";
import { submitContactForm } from "@/lib/actions/contact";

export default function ContactForm() {
  const [values, setValues] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const set = (key: keyof typeof values, val: string) => setValues((v) => ({ ...v, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const result = await submitContactForm(values);
    setSubmitting(false);
    if (result.success) {
      toast.success("Message sent! We'll get back to you shortly.");
      setValues({ name: "", email: "", phone: "", subject: "", message: "" });
    } else {
      toast.error(result.error || "Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card p-8 space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="text-sm text-gray-muted mb-2 block">Name *</label>
          <input required value={values.name} onChange={(e) => set("name", e.target.value)} className="w-full bg-white/5 border border-gold/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold" />
        </div>
        <div>
          <label className="text-sm text-gray-muted mb-2 block">Email *</label>
          <input type="email" required value={values.email} onChange={(e) => set("email", e.target.value)} className="w-full bg-white/5 border border-gold/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold" />
        </div>
      </div>
      <div>
        <label className="text-sm text-gray-muted mb-2 block">Phone</label>
        <input value={values.phone} onChange={(e) => set("phone", e.target.value)} className="w-full bg-white/5 border border-gold/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold" />
      </div>
      <div>
        <label className="text-sm text-gray-muted mb-2 block">Subject *</label>
        <input required value={values.subject} onChange={(e) => set("subject", e.target.value)} className="w-full bg-white/5 border border-gold/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold" />
      </div>
      <div>
        <label className="text-sm text-gray-muted mb-2 block">Message *</label>
        <textarea required rows={5} value={values.message} onChange={(e) => set("message", e.target.value)} className="w-full bg-white/5 border border-gold/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold" />
      </div>
      <button type="submit" disabled={submitting} className="btn-gold w-full disabled:opacity-60">
        {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
        {submitting ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
