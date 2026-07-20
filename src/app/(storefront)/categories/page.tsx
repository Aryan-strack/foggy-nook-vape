import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop by Category",
  description: "Browse all product categories at Foggy Nook.",
};

export default async function CategoriesPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase.from("categories").select("*").eq("is_active", true).order("sort_order");

  return (
    <div className="container py-20">
      <div className="text-center mb-14">
        <p className="section-eyebrow">Explore</p>
        <h1 className="section-title">Shop by Category</h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {categories?.map((cat) => (
          <Link
            key={cat.id}
            href={`/shop?category=${cat.slug}`}
            className="group relative aspect-[4/3] rounded-2xl overflow-hidden gold-hover border border-gold/10"
          >
            <Image
              src={cat.image_url || "/placeholder-category.jpg"}
              alt={cat.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6">
              <h3 className="font-display text-2xl text-white group-hover:text-gold transition-colors">{cat.name}</h3>
              {cat.description && <p className="text-gray-muted text-sm mt-1 line-clamp-1">{cat.description}</p>}
            </div>
          </Link>
        ))}
        {!categories?.length && <p className="col-span-full text-center text-gray-muted py-10">No categories available yet.</p>}
      </div>
    </div>
  );
}
