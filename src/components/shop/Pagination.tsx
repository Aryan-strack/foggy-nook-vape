"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ currentPage, totalPages }: { currentPage: number; totalPages: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  if (totalPages <= 1) return null;

  const goTo = (page: number) => {
    const next = new URLSearchParams(params.toString());
    next.set("page", String(page));
    router.push(`${pathname}?${next.toString()}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1
  );

  return (
    <div className="flex items-center justify-center gap-2 mt-14">
      <button
        onClick={() => goTo(currentPage - 1)}
        disabled={currentPage === 1}
        className="h-10 w-10 rounded-full border border-gold/20 flex items-center justify-center text-gray-muted hover:text-gold disabled:opacity-30"
        aria-label="Previous page"
      >
        <ChevronLeft size={16} />
      </button>

      {pages.map((p, idx) => (
        <div key={p} className="flex items-center gap-2">
          {idx > 0 && pages[idx - 1] !== p - 1 && <span className="text-gray-muted">…</span>}
          <button
            onClick={() => goTo(p)}
            className={`h-10 w-10 rounded-full flex items-center justify-center text-sm transition-colors ${
              p === currentPage ? "bg-gold text-black font-semibold" : "text-gray-muted hover:text-gold border border-gold/20"
            }`}
          >
            {p}
          </button>
        </div>
      ))}

      <button
        onClick={() => goTo(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="h-10 w-10 rounded-full border border-gold/20 flex items-center justify-center text-gray-muted hover:text-gold disabled:opacity-30"
        aria-label="Next page"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
