import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ProductCard from "@/components/home/ProductCard";
import { Heart } from "lucide-react";
import Link from "next/link";
import type { Product } from "@/types";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "My Wishlist" };

export default async function WishlistPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirect=/wishlist");

  const { data: items } = await supabase
    .from("wishlist_items")
    .select("product:products(*, brand:brands(*), images:product_images(*))")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const products = (items?.map((i: any) => i.product).filter(Boolean) as Product[]) || [];

  return (
    <div className="container py-16">
      <h1 className="section-title mb-12">My Wishlist</h1>

      {products.length === 0 ? (
        <div className="text-center py-20">
          <Heart size={56} className="text-gold mx-auto mb-6" />
          <p className="text-gray-muted mb-8">Your wishlist is empty. Save products you love to find them here later.</p>
          <Link href="/shop" className="btn-gold">Browse Products</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
