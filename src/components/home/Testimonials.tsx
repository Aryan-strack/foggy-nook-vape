"use client";

import { Star, Quote } from "lucide-react";
import { motion } from "framer-motion";

const TESTIMONIALS = [
  { name: "Ahmed R.", text: "Packaging was so discreet and premium. The quality matched exactly what was shown.", rating: 5 },
  { name: "Bilal K.", text: "Fast COD delivery to Karachi, and the product authenticity is unmatched.", rating: 5 },
  { name: "Fatima S.", text: "Customer support on WhatsApp answered instantly. Great experience overall.", rating: 5 },
];

export default function Testimonials() {
  return (
    <section className="container py-24">
      <p className="section-eyebrow text-center">Trusted By Thousands</p>
      <h2 className="section-title text-center mb-14">What Our Customers Say</h2>

      <div className="grid md:grid-cols-3 gap-6">
        {TESTIMONIALS.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-8"
          >
            <Quote className="text-gold mb-4" size={28} />
            <p className="text-gray-muted leading-relaxed mb-6">{t.text}</p>
            <div className="flex items-center justify-between">
              <span className="text-white font-medium">{t.name}</span>
              <div className="flex gap-0.5">
                {[...Array(t.rating)].map((_, idx) => (
                  <Star key={idx} size={14} className="fill-gold text-gold" />
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
