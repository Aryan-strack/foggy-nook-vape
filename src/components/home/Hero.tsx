"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";

interface HeroSlide {
  image: string;
  title: string;
  subtitle: string;
  cta_label: string;
  cta_link: string;
}

const DEFAULT_HERO_IMAGE = "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1600";

export default function Hero({ slides }: { slides?: HeroSlide[] }) {
  const hasSlides = slides && slides.length > 0;
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!hasSlides || slides!.length < 2) return;
    const interval = setInterval(() => setActive((i) => (i + 1) % slides!.length), 6000);
    return () => clearInterval(interval);
  }, [hasSlides, slides]);

  const slide = hasSlides ? slides![active] : null;
  const backgroundImage = slide?.image || DEFAULT_HERO_IMAGE;

  return (
    <section className="relative h-[92vh] min-h-[640px] flex items-center overflow-hidden bg-black">
      <AnimatePresence mode="wait">
        <motion.div
          key={backgroundImage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <Image src={backgroundImage} alt={slide?.title || "Foggy Nook"} fill priority className="object-cover opacity-40" />
        </motion.div>
      </AnimatePresence>

      {/* Ambient smoke layers */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white/10 blur-3xl animate-smoke"
            style={{
              width: `${180 + i * 60}px`,
              height: `${180 + i * 60}px`,
              left: `${10 + i * 18}%`,
              bottom: "-100px",
              animationDelay: `${i * 1.2}s`,
            }}
          />
        ))}
      </div>

      {/* Radial gold glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.08),transparent_60%)]" />

      <div className="container relative z-10">
        <motion.p
          key={`eyebrow-${active}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="section-eyebrow"
        >
          {slide?.subtitle || "Stay High"}
        </motion.p>

        <motion.h1
          key={`title-${active}`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="font-display text-5xl md:text-7xl lg:text-8xl font-medium text-white max-w-3xl leading-[1.05] text-balance"
        >
          {slide?.title || (
            <>Welcome to <span className="text-gold">Foggy</span> Nook</>
          )}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-6 text-gray-muted max-w-lg text-lg"
        >
          Discover an exclusive collection of premium smoke &amp; vape essentials — authentic, discreet, delivered.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="mt-10 flex flex-wrap gap-4"
        >
          <Link href={slide?.cta_link || "/shop"} className="btn-gold">
            {slide?.cta_label || "Shop Now"}
          </Link>
          <Link href="/categories" className="btn-outline-gold">
            Explore Collection
          </Link>
        </motion.div>

        {hasSlides && slides!.length > 1 && (
          <div className="flex gap-2 mt-12">
            {slides!.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`h-1.5 rounded-full transition-all ${i === active ? "w-8 bg-gold" : "w-4 bg-white/20"}`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
