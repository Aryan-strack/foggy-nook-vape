"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Search, Heart, ShoppingBag, User, Menu, X } from "lucide-react";
import WhatsAppIcon from "./WhatsAppIcon";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import type { SiteSettings } from "@/types";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Categories", href: "/categories" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar({ settings }: { settings?: Partial<SiteSettings> | null }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const cartCount = useCartStore((s) => s.items.reduce((n, i) => n + i.quantity, 0));
  const whatsappNumber = settings?.whatsapp_number || "923001234567";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-500",
        scrolled ? "bg-black/80 backdrop-blur-xl border-b border-gold/15 shadow-soft" : "bg-transparent"
      )}
    >
      <div className="container flex items-center justify-between h-20">
        <Link href="/" className="relative h-12 w-40 md:h-14 md:w-48 shrink-0">
          <Image src={settings?.logo_url || "/logo.png"} alt={settings?.store_name || "Foggy Nook"} fill className="object-contain object-left" priority />
        </Link>

        <nav className="hidden lg:flex items-center gap-10">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm uppercase tracking-widest text-gray-muted hover:text-gold transition-colors duration-300"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-5">
          <a
            href={`https://wa.me/${whatsappNumber}?text=Hello%20I%20want%20to%20know%20about%20your%20products`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex text-gray-muted hover:text-gold transition-colors"
            aria-label="Chat on WhatsApp"
          >
            <WhatsAppIcon size={20} />
          </a>
          <Link href="/search" className="text-gray-muted hover:text-gold transition-colors" aria-label="Search">
            <Search size={20} />
          </Link>
          <Link href="/wishlist" className="text-gray-muted hover:text-gold transition-colors" aria-label="Wishlist">
            <Heart size={20} />
          </Link>
          <Link href="/cart" className="relative text-gray-muted hover:text-gold transition-colors" aria-label="Cart">
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-gold text-black text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
          <Link href="/account" className="inline-flex text-gray-muted hover:text-gold transition-colors" aria-label="Account">
            <User size={20} />
          </Link>
          <button
            className="lg:hidden text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="lg:hidden glass-card mx-4 mb-4 p-6 flex flex-col gap-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-sm uppercase tracking-widest text-gray-muted hover:text-gold"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
