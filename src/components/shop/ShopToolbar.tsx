"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { LayoutGrid, List } from "lucide-react";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
  { value: "bestselling", label: "Best Selling" },
];

export default function ShopToolbar({ total }: { total: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const sort = params.get("sort") || "newest";
  const view = params.get("view") || "grid";

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(params.toString());
    next.set(key, value);
    router.push(`${pathname}?${next.toString()}`);
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
      <p className="text-sm text-gray-muted">{total} products found</p>

      <div className="flex items-center gap-4">
        <select
          value={sort}
          onChange={(e) => setParam("sort", e.target.value)}
          className="bg-white/5 border border-gold/20 rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:border-gold"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value} className="bg-black-soft">
              {o.label}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-1 bg-white/5 rounded-full p-1 border border-gold/20">
          <button
            onClick={() => setParam("view", "grid")}
            className={`h-8 w-8 rounded-full flex items-center justify-center ${view === "grid" ? "bg-gold text-black" : "text-gray-muted"}`}
            aria-label="Grid view"
          >
            <LayoutGrid size={14} />
          </button>
          <button
            onClick={() => setParam("view", "list")}
            className={`h-8 w-8 rounded-full flex items-center justify-center ${view === "list" ? "bg-gold text-black" : "text-gray-muted"}`}
            aria-label="List view"
          >
            <List size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
