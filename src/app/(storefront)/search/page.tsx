import { createClient } from "@/lib/supabase/server";
import ProductCard from "@/components/home/ProductCard";
import { Search as SearchIcon } from "lucide-react";
import type { Product } from "@/types";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Search Products" };

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const supabase = await createClient();
  const { q: rawQ } = await searchParams;
  const q = rawQ?.trim() || "";

  let products: Product[] = [];
  if (q) {
    const { data } = await supabase
      .from("products")
      .select("*, brand:brands(*), images:product_images(*)")
      .eq("status", "active")
      .or(`name.ilike.%${q}%,description.ilike.%${q}%`)
      .limit(24);
    products = (data as Product[]) || [];
  }

  return (
    <div className="container py-16">
      <div className="text-center mb-12">
        <p className="section-eyebrow">Find What You Need</p>
        <h1 className="section-title mb-8">Search</h1>

        <form action="/search" className="max-w-lg mx-auto relative">
          <SearchIcon size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-muted" />
          <input
            name="q"
            defaultValue={q}
            placeholder="Search for products, brands, categories..."
            autoFocus
            className="w-full bg-white/5 border border-gold/20 rounded-full pl-12 pr-4 py-4 text-white placeholder:text-gray-muted focus:outline-none focus:border-gold"
          />
        </form>
      </div>

      {q && (
        <p className="text-gray-muted text-center mb-8">
          {products.length} result{products.length !== 1 ? "s" : ""} for "<span className="text-gold">{q}</span>"
        </p>
      )}

      {q && products.length === 0 && (
        <div className="glass-card p-16 text-center max-w-lg mx-auto">
          <p className="text-gray-muted">No products found matching your search. Try a different keyword.</p>
        </div>
      )}

      {products.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
