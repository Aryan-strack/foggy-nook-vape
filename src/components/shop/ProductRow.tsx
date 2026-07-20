import Link from "next/link";
import Image from "next/image";
import { Star, ShoppingBag } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

export default function ProductRow({ product }: { product: Product }) {
  const primaryImage = product.images?.find((i) => i.is_primary)?.image_url || product.images?.[0]?.image_url;

  return (
    <Link href={`/product/${product.slug}`} className="glass-card gold-hover flex gap-5 p-5">
      <div className="relative h-32 w-32 shrink-0 rounded-xl overflow-hidden">
        <Image src={primaryImage || "/placeholder-product.jpg"} alt={product.name} fill className="object-cover" />
      </div>
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {product.brand && <p className="text-xs text-gray-muted uppercase tracking-widest mb-1">{product.brand.name}</p>}
          <h3 className="font-display text-xl text-white">{product.name}</h3>
          <div className="flex items-center gap-1 mt-1">
            <Star size={13} className="fill-gold text-gold" />
            <span className="text-xs text-gray-muted">
              {product.avg_rating.toFixed(1)} ({product.review_count} reviews)
            </span>
          </div>
          <p className="text-gray-muted text-sm mt-2 line-clamp-2">{product.description}</p>
        </div>
        <div className="flex items-center justify-between mt-3">
          <span className="text-gold font-semibold text-lg">{formatPrice(product.price)}</span>
          <span className="btn-outline-gold !px-5 !py-2 text-sm">
            View <ShoppingBag size={14} />
          </span>
        </div>
      </div>
    </Link>
  );
}
