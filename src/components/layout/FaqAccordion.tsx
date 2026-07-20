"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function FaqAccordion({ faqs }: { faqs: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="max-w-3xl mx-auto space-y-3">
      {faqs.map((faq, i) => (
        <div key={i} className="glass-card overflow-hidden">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between p-6 text-left"
          >
            <span className="font-display text-lg text-white">{faq.q}</span>
            <ChevronDown size={18} className={`text-gold transition-transform shrink-0 ml-4 ${open === i ? "rotate-180" : ""}`} />
          </button>
          {open === i && <p className="px-6 pb-6 text-gray-muted leading-relaxed">{faq.a}</p>}
        </div>
      ))}
    </div>
  );
}
