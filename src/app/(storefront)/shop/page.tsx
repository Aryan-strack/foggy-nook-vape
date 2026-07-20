import { createClient } from "@/lib/supabase/server";
import ShopFilters from "@/components/shop/ShopFilters";
import ShopToolbar from "@/components/shop/ShopToolbar";
import ShopSearchBar from "@/components/shop/ShopSearchBar";
import Pagination from "@/components/shop/Pagination";
import ProductCard from "@/components/home/ProductCard";
import ProductRow from "@/components/shop/ProductRow";
import type { Product } from "@/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop All Products",
  description: "Browse our full curated collection of premium smoke & vape products.",
};

const PAGE_SIZE = 12;

interface SearchParams {
  category?: string;
  brand?: string;
  min?: string;
  max?: string;
  rating?: string;
  in_stock?: string;
  sort?: string;
  view?: string;
  q?: string;
  page?: string;
}

async function getShopData(searchParams: SearchParams) {
  const supabase = await createClient();
  const page = Math.max(1, Number(searchParams.page) || 1);
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let query = supabase
    .from("products")
    .select("*, brand:brands(*), category:categories(*), images:product_images(*)", { count: "exact" })
    .eq("status", "active");

  if (searchParams.q) query = query.ilike("name", `%${searchParams.q}%`);
  if (searchParams.min) query = query.gte("price", Number(searchParams.min));
  if (searchParams.max) query = query.lte("price", Number(searchParams.max));
  if (searchParams.rating) query = query.gte("avg_rating", Number(searchParams.rating));
  if (searchParams.in_stock === "1") query = query.gt("stock_quantity", 0);

  if (searchParams.category) {
    const { data: cat } = await supabase.from("categories").select("id").eq("slug", searchParams.category).single();
    if (cat) query = query.eq("category_id", cat.id);
  }
  if (searchParams.brand) {
    const { data: brand } = await supabase.from("brands").select("id").eq("slug", searchParams.brand).single();
    if (brand) query = query.eq("brand_id", brand.id);
  }

  switch (searchParams.sort) {
    case "price_asc":
      query = query.order("price", { ascending: true });
      break;
    case "price_desc":
      query = query.order("price", { ascending: false });
      break;
    case "rating":
      query = query.order("avg_rating", { ascending: false });
      break;
    case "bestselling":
      query = query.order("review_count", { ascending: false });
      break;
    default:
      query = query.order("created_at", { ascending: false });
  }

  const [{ data: products, count }, { data: categories }, { data: brands }] = await Promise.all([
    query.range(from, to),
    supabase.from("categories").select("*").eq("is_active", true).order("sort_order"),
    supabase.from("brands").select("*").eq("is_active", true).order("name"),
  ]);

  return {
    products: (products as Product[]) || [],
    total: count || 0,
    categories: categories || [],
    brands: brands || [],
    page,
    totalPages: Math.max(1, Math.ceil((count || 0) / PAGE_SIZE)),
  };
}

export default async function ShopPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const resolvedSearchParams = await searchParams;
  const { products, total, categories, brands, page, totalPages } = await getShopData(resolvedSearchParams);
  const view = resolvedSearchParams.view === "list" ? "list" : "grid";

  return (
    <div className="container py-16">
      <div className="text-center mb-12">
        <p className="section-eyebrow">Full Collection</p>
        <h1 className="section-title">Shop All Products</h1>
      </div>

      <div className="flex justify-center mb-10">
        <ShopSearchBar />
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        <ShopFilters categories={categories as any} brands={brands as any} />

        <div className="flex-1">
          <ShopToolbar total={total} />

          {products.length === 0 ? (
            <div className="glass-card p-16 text-center">
              <p className="text-gray-muted">No products match your filters. Try clearing some filters.</p>
            </div>
          ) : view === "grid" ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {products.map((p) => (
                <ProductRow key={p.id} product={p} />
              ))}
            </div>
          )}

          <Pagination currentPage={page} totalPages={totalPages} />
        </div>
      </div>
    </div>
  );
}
