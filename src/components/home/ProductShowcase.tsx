import ProductCard from "./ProductCard";
import type { Product } from "@/types";

export default function ProductShowcase({
  title,
  eyebrow,
  products,
}: {
  title: string;
  eyebrow: string;
  products: Product[];
}) {
  if (!products?.length) return null;

  return (
    <section className="container py-20">
      <div className="flex items-end justify-between mb-14">
        <div>
          <p className="section-eyebrow">{eyebrow}</p>
          <h2 className="section-title">{title}</h2>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
