"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Send } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast.success("Subscribed! Welcome to Foggy Nook.");
    setEmail("");
  };

  return (
    <section className="container py-24">
      <div className="glass-card relative overflow-hidden px-8 py-16 md:px-16 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.1),transparent_60%)]" />
        <p className="section-eyebrow relative">Stay Golden</p>
        <h2 className="section-title relative mb-4">Join the Inner Circle</h2>
        <p className="text-gray-muted max-w-md mx-auto mb-8 relative">
          Get early access to new arrivals, flash sales, and exclusive offers.
        </p>
        <form onSubmit={handleSubmit} className="relative flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            className="flex-1 bg-white/5 border border-gold/20 rounded-full px-6 py-3.5 text-white placeholder:text-gray-muted focus:outline-none focus:border-gold"
          />
          <button type="submit" className="btn-gold whitespace-nowrap">
            Subscribe <Send size={16} />
          </button>
        </form>
      </div>
    </section>
  );
}
