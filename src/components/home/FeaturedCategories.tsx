import Link from "next/link";
import Image from "next/image";
import type { Category } from "@/types";

export default function FeaturedCategories({ categories }: { categories: Category[] }) {
  if (!categories?.length) return null;

  return (
    <section className="container py-24">
      <p className="section-eyebrow text-center">Shop by</p>
      <h2 className="section-title text-center mb-14">Featured Categories</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/shop?category=${cat.slug}`}
            className="group relative aspect-[3/4] rounded-2xl overflow-hidden gold-hover border border-gold/10"
          >
            <Image
              src={cat.image_url || "/placeholder-category.jpg"}
              alt={cat.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 p-5">
              <h3 className="font-display text-xl text-white group-hover:text-gold transition-colors">
                {cat.name}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
