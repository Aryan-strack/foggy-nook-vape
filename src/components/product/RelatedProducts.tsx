import ProductCard from "@/components/home/ProductCard";
import type { Product } from "@/types";

export default function RelatedProducts({ products }: { products: Product[] }) {
  if (!products?.length) return null;

  return (
    <section className="mt-24">
      <p className="section-eyebrow">You May Also Like</p>
      <h2 className="section-title mb-10">Related Products</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
