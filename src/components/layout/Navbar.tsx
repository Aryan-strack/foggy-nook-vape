"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Menu,
  X,
} from "lucide-react";
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

export default function Navbar({
  settings,
}: {
  settings?: Partial<SiteSettings> | null;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const cartCount = useCartStore((s) =>
    s.items.reduce((n, i) => n + i.quantity, 0)
  );

  const whatsappNumber =
    settings?.whatsapp_number || "923001234567";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Prevent body scrolling when menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-500",
          scrolled
            ? "bg-black/80 backdrop-blur-xl border-b border-gold/20 shadow-soft"
            : "bg-transparent"
        )}
      >
        <div className="container flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            href="/"
            className="relative h-12 w-40 md:h-14 md:w-48 shrink-0"
          >
            <Image
              src={settings?.logo_url || "/logo.png"}
              alt={settings?.store_name || "Foggy Nook"}
              fill
              priority
              className="object-contain object-left"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-10">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm uppercase tracking-widest text-gray-muted hover:text-gold transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Icons */}
          <div className="flex items-center gap-5">
            <a
              href={`https://wa.me/${whatsappNumber}?text=Hello%20I%20want%20to%20know%20about%20your%20products`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex text-gray-muted hover:text-gold"
            >
              <WhatsAppIcon size={20} />
            </a>

            <Link
              href="/search"
              className="text-gray-muted hover:text-gold"
            >
              <Search size={20} />
            </Link>

            <Link
              href="/wishlist"
              className="text-gray-muted hover:text-gold"
            >
              <Heart size={20} />
            </Link>

            <Link
              href="/cart"
              className="relative text-gray-muted hover:text-gold"
            >
              <ShoppingBag size={20} />

              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gold text-black text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            <Link
              href="/account"
              className="hidden md:flex text-gray-muted hover:text-gold"
            >
              <User size={20} />
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden flex items-center justify-center w-12 h-12 text-white"
            >
              <Menu size={34} />
            </button>
          </div>
        </div>
      </header>

      {/* Full Screen Mobile Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[999] bg-black/95 backdrop-blur-xl">
          {/* Top */}
          <div className="flex items-center justify-between px-6 h-20 border-b border-white/10">
            <Image
              src={settings?.logo_url || "/logo.png"}
              alt="Logo"
              width={150}
              height={50}
              className="object-contain"
            />

            <button
              onClick={() => setMobileOpen(false)}
              className="text-white"
            >
              <X size={36} />
            </button>
          </div>

          {/* Menu */}
          <nav className="flex flex-col px-8 pt-10">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="py-5 text-2xl font-semibold uppercase tracking-wider text-white hover:text-gold border-b border-white/10 transition"
              >
                {link.label}
              </Link>
            ))}

            <Link
              href="/account"
              onClick={() => setMobileOpen(false)}
              className="py-5 text-2xl font-semibold uppercase tracking-wider text-white hover:text-gold border-b border-white/10"
            >
              Account
            </Link>

            <Link
              href="/wishlist"
              onClick={() => setMobileOpen(false)}
              className="py-5 text-2xl font-semibold uppercase tracking-wider text-white hover:text-gold border-b border-white/10"
            >
              Wishlist
            </Link>

            <Link
              href="/cart"
              onClick={() => setMobileOpen(false)}
              className="py-5 text-2xl font-semibold uppercase tracking-wider text-white hover:text-gold border-b border-white/10"
            >
              Cart ({cartCount})
            </Link>

            <a
              href={`https://wa.me/${whatsappNumber}?text=Hello%20I%20want%20to%20know%20about%20your%20products`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-5 text-2xl font-semibold uppercase tracking-wider text-white hover:text-gold"
            >
              WhatsApp
            </a>
          </nav>
        </div>
      )}
    </>
  );
}