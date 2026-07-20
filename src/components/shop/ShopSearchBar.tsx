"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";

export default function ShopSearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") || "");

  useEffect(() => {
    const timeout = setTimeout(() => {
      const next = new URLSearchParams(params.toString());
      if (q) next.set("q", q);
      else next.delete("q");
      next.delete("page");
      router.push(`${pathname}?${next.toString()}`);
    }, 400);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  return (
    <div className="relative max-w-md w-full">
      <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-muted" />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search products, brands..."
        className="w-full bg-white/5 border border-gold/20 rounded-full pl-11 pr-4 py-3 text-sm text-white placeholder:text-gray-muted focus:outline-none focus:border-gold"
      />
    </div>
  );
}
