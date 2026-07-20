"use client";

import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import type { Product } from "@/types";
import { Zap } from "lucide-react";

function useCountdown(target: string | null) {
  const [remaining, setRemaining] = useState({ h: 0, m: 0, s: 0 });

  useEffect(() => {
    if (!target) return;
    const tick = () => {
      const diff = Math.max(0, new Date(target).getTime() - Date.now());
      setRemaining({
        h: Math.floor(diff / 3_600_000),
        m: Math.floor((diff % 3_600_000) / 60_000),
        s: Math.floor((diff % 60_000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  return remaining;
}

export default function FlashSale({ products, endsAt }: { products: Product[]; endsAt: string | null }) {
  const { h, m, s } = useCountdown(endsAt);
  if (!products?.length) return null;

  return (
    <section className="bg-black-soft py-20 border-y border-gold/10">
      <div className="container">
        <div className="flex flex-wrap items-center justify-between gap-6 mb-14">
          <div>
            <p className="section-eyebrow flex items-center gap-2">
              <Zap size={14} className="fill-gold" /> Limited Time
            </p>
            <h2 className="section-title">Flash Sale</h2>
          </div>

          <div className="flex gap-3">
            {[{ v: h, l: "HRS" }, { v: m, l: "MIN" }, { v: s, l: "SEC" }].map((unit) => (
              <div key={unit.l} className="glass-card px-5 py-3 text-center min-w-[72px]">
                <div className="font-display text-2xl text-gold">{String(unit.v).padStart(2, "0")}</div>
                <div className="text-[10px] text-gray-muted tracking-widest">{unit.l}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
