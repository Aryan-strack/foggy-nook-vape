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

// Image should be in: public/images/hero.jpg
const DEFAULT_HERO_IMAGE = "/vape.jpg";

export default function Hero({ slides }: { slides?: HeroSlide[] }) {
  const hasSlides = slides && slides.length > 0;
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!hasSlides || slides!.length < 2) return;

    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % slides!.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [hasSlides, slides]);

  const slide = hasSlides ? slides![active] : null;
  const backgroundImage = slide?.image || DEFAULT_HERO_IMAGE;

  return (
    <section className="relative flex h-[92vh] min-h-[650px] items-center justify-center overflow-hidden bg-black">
      {/* Background Image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={backgroundImage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <Image
            src={backgroundImage}
            alt={slide?.title || "Foggy Nook"}
            fill
            priority
            className="object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/70" />

      {/* Gold Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.15),transparent_70%)]" />

      {/* Smoke Animation */}
      <div className="pointer-events-none absolute inset-0">
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

      {/* Content */}
      <div className="container relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
        {/* Subtitle */}
        <motion.p
          key={`subtitle-${active}`}
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="section-eyebrow mb-4"
        >
          {slide?.subtitle || "Premium Smoke • Vape • Hookah"}
        </motion.p>

        {/* Title */}
        <motion.h1
          key={`title-${active}`}
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl font-display text-5xl font-bold leading-tight text-white md:text-7xl lg:text-8xl"
        >
          {slide?.title || (
            <>
              Welcome to <span className="text-gold">Foggy Nook</span>
            </>
          )}
        </motion.h1>

        {/* Description */}
        <motion.p
          key={`desc-${active}`}
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-gray-300 md:text-xl"
        >
          Discover authentic vape devices, premium e-liquids, disposable
          vapes, hookah accessories and smoking essentials with fast delivery
          and unbeatable quality.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35 }}
          className="mt-10 flex flex-wrap justify-center gap-5"
        >
          <Link href={slide?.cta_link || "/shop"} className="btn-gold">
            {slide?.cta_label || "Shop Now"}
          </Link>

          <Link href="/categories" className="btn-outline-gold">
            Explore Collection
          </Link>
        </motion.div>

        {/* Slider Indicators */}
        {hasSlides && slides!.length > 1 && (
          <div className="mt-14 flex justify-center gap-3">
            {slides!.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === active
                    ? "w-10 bg-gold"
                    : "w-4 bg-white/30 hover:bg-white/50"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}