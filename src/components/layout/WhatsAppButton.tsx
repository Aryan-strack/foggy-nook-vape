"use client";

import { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import WhatsAppIcon from "./WhatsAppIcon";

interface Props {
  number?: string | null;
  label?: string | null;
  number2?: string | null;
  label2?: string | null;
  message?: string;
}

export default function WhatsAppButton({
  number,
  label = "Sales",
  number2,
  label2 = "Support",
  message = "Hello, I want to know about your products.",
}: Props) {
  const primaryNumber = number || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "923001234567";
  const hasSecondNumber = !!number2;
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const waLink = (num: string) => `https://wa.me/${num}?text=${encodeURIComponent(message)}`;

  // Single number configured — behave as a simple direct link, no popup needed.
  if (!hasSecondNumber) {
    return (
      <a
        href={waLink(primaryNumber)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center h-14 w-14 rounded-full
          bg-[#25D366] shadow-[0_0_25px_rgba(37,211,102,0.5)] hover:scale-110 transition-transform duration-300"
      >
        <WhatsAppIcon size={30} className="text-white" />
      </a>
    );
  }

  return (
    <div ref={ref} className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="glass-card p-3 flex flex-col gap-2 w-48 animate-fade-up">
          <a
            href={waLink(primaryNumber)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors"
          >
            <span className="h-9 w-9 rounded-full bg-[#25D366] flex items-center justify-center shrink-0">
              <WhatsAppIcon size={18} className="text-white" />
            </span>
            <span className="text-sm text-white">{label || "Sales"}</span>
          </a>
          <a
            href={waLink(number2!)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors"
          >
            <span className="h-9 w-9 rounded-full bg-[#25D366] flex items-center justify-center shrink-0">
              <WhatsAppIcon size={18} className="text-white" />
            </span>
            <span className="text-sm text-white">{label2 || "Support"}</span>
          </a>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        aria-label="Chat with us on WhatsApp"
        className="flex items-center justify-center h-14 w-14 rounded-full
          bg-[#25D366] shadow-[0_0_25px_rgba(37,211,102,0.5)] hover:scale-110 transition-transform duration-300"
      >
        {open ? <X className="text-white" size={26} /> : <WhatsAppIcon size={30} className="text-white" />}
      </button>
    </div>
  );
}
