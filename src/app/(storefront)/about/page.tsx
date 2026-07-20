import type { Metadata } from "next";
import Image from "next/image";
import { Shield, Truck, Award, Headphones } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Foggy Nook — our story, values, and commitment to premium quality.",
};

const VALUES = [
  { icon: Award, title: "Authentic Products", text: "Every item is sourced directly from authorized distributors and verified brands." },
  { icon: Shield, title: "Discreet Packaging", text: "Your privacy matters. All orders ship in plain, unbranded packaging." },
  { icon: Truck, title: "Reliable Delivery", text: "Fast, tracked cash-on-delivery shipping across the country." },
  { icon: Headphones, title: "Dedicated Support", text: "Our team is available on WhatsApp to answer any questions." },
];

// Placeholder lifestyle imagery — swap these for your own product/store photography.
const GALLERY = [
  "/store1.jpeg",
  "/store2.jpeg",
  "/store3.jpeg",
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[420px] flex items-end overflow-hidden">
        <Image
          src="/vape.jpg"
          alt="Foggy Nook store"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/20" />
        <div className="container relative z-10 pb-16">
          <p className="section-eyebrow">Our Story</p>
          <h1 className="font-display text-5xl md:text-6xl text-white max-w-2xl">Crafted for the Connoisseur</h1>
        </div>
      </section>

      <div className="container py-20">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <p className="text-gray-muted leading-relaxed">
            Foggy Nook was founded with a simple mission — to bring a premium, trustworthy
            shopping experience to the smoke &amp; vape community. We believe quality shouldn't
            be compromised, and every customer deserves authenticity, discretion, and care
            in every order.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {VALUES.map((v) => (
            <div key={v.title} className="glass-card p-8 text-center gold-hover">
              <div className="h-12 w-12 rounded-xl bg-gold/10 flex items-center justify-center text-gold mx-auto mb-4">
                <v.icon size={22} />
              </div>
              <h3 className="font-display text-lg text-white mb-2">{v.title}</h3>
              <p className="text-gray-muted text-sm leading-relaxed">{v.text}</p>
            </div>
          ))}
        </div>

        {/* Lifestyle gallery */}
        <div className="grid sm:grid-cols-3 gap-6 mb-20">
          {GALLERY.map((src, i) => (
            <div key={i} className="relative aspect-[4/5] rounded-2xl overflow-hidden gold-hover border border-gold/10">
              <Image src={src} alt="Foggy Nook lifestyle" fill className="object-cover" />
            </div>
          ))}
        </div>

        <div className="glass-card p-10 md:p-16 text-center">
          <p className="section-eyebrow">Our Promise</p>
          <h2 className="font-display text-3xl text-white mb-4">Quality Without Compromise</h2>
          <p className="text-gray-muted max-w-xl mx-auto leading-relaxed">
            From the moment you browse our collection to the moment your order arrives,
            we're committed to making your experience feel as premium as the products themselves.
          </p>
        </div>
      </div>
    </div>
  );
}
