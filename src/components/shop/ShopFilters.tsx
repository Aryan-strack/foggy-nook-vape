"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown, X } from "lucide-react";
import type { Category, Brand } from "@/types";

interface Props {
  categories: Category[];
  brands: Brand[];
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-gold/10 pb-5 mb-5">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-sm uppercase tracking-widest text-white mb-4"
      >
        {title}
        <ChevronDown size={16} className={`text-gold transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && children}
    </div>
  );
}

export default function ShopFilters({ categories, brands }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const setParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(params.toString());
    if (value === null) next.delete(key);
    else next.set(key, value);
    next.delete("page");
    router.push(`${pathname}?${next.toString()}`);
  };

  const activeCategory = params.get("category");
  const activeBrand = params.get("brand");
  const activeRating = params.get("rating");
  const inStockOnly = params.get("in_stock") === "1";
  const minPrice = params.get("min") || "";
  const maxPrice = params.get("max") || "";

  const hasActiveFilters = activeCategory || activeBrand || activeRating || inStockOnly || minPrice || maxPrice;

  return (
    <aside className="w-full lg:w-64 shrink-0">
      <div className="glass-card p-6 sticky top-24">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-xl text-white">Filters</h3>
          {hasActiveFilters && (
            <button
              onClick={() => router.push(pathname)}
              className="text-xs text-gold flex items-center gap-1 hover:underline"
            >
              <X size={12} /> Clear
            </button>
          )}
        </div>

        <FilterGroup title="Category">
          <div className="space-y-2">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setParam("category", activeCategory === c.slug ? null : c.slug)}
                className={`block w-full text-left text-sm py-1 transition-colors ${
                  activeCategory === c.slug ? "text-gold" : "text-gray-muted hover:text-white"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </FilterGroup>

        <FilterGroup title="Brand">
          <div className="space-y-2">
            {brands.map((b) => (
              <button
                key={b.id}
                onClick={() => setParam("brand", activeBrand === b.slug ? null : b.slug)}
                className={`block w-full text-left text-sm py-1 transition-colors ${
                  activeBrand === b.slug ? "text-gold" : "text-gray-muted hover:text-white"
                }`}
              >
                {b.name}
              </button>
            ))}
          </div>
        </FilterGroup>

        <FilterGroup title="Price Range">
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              defaultValue={minPrice}
              onBlur={(e) => setParam("min", e.target.value || null)}
              className="w-full bg-white/5 border border-gold/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-gold"
            />
            <span className="text-gray-muted">-</span>
            <input
              type="number"
              placeholder="Max"
              defaultValue={maxPrice}
              onBlur={(e) => setParam("max", e.target.value || null)}
              className="w-full bg-white/5 border border-gold/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-gold"
            />
          </div>
        </FilterGroup>

        <FilterGroup title="Rating">
          <div className="space-y-2">
            {[4, 3, 2, 1].map((r) => (
              <button
                key={r}
                onClick={() => setParam("rating", activeRating === String(r) ? null : String(r))}
                className={`block w-full text-left text-sm py-1 ${
                  activeRating === String(r) ? "text-gold" : "text-gray-muted hover:text-white"
                }`}
              >
                {r}★ &amp; up
              </button>
            ))}
          </div>
        </FilterGroup>

        <FilterGroup title="Availability">
          <label className="flex items-center gap-2 text-sm text-gray-muted cursor-pointer">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setParam("in_stock", e.target.checked ? "1" : null)}
              className="accent-gold h-4 w-4"
            />
            In Stock Only
          </label>
        </FilterGroup>
      </div>
    </aside>
  );
}
