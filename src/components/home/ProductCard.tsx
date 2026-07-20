"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { formatPrice, cn } from "@/lib/utils";
import type { Product } from "@/types";
import { useCartStore } from "@/store/cart-store";
import { toggleWishlist } from "@/lib/actions/wishlist";
import { toast } from "sonner";

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const router = useRouter();
  const primaryImage = product.images?.find((i) => i.is_primary)?.image_url || product.images?.[0]?.image_url;
  const discount =
    product.compare_at_price && product.compare_at_price > product.price
      ? Math.round(100 - (product.price / product.compare_at_price) * 100)
      : null;

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    const result = await toggleWishlist(product.id);
    if (!result.success && result.error === "auth_required") {
      toast.error("Please login to save items to your wishlist");
      router.push("/login?redirect=/wishlist");
      return;
    }
    if (result.success) toast.success(result.added ? "Added to wishlist" : "Removed from wishlist");
  };

  return (
    <div className="group relative glass-card gold-hover overflow-hidden">
      <Link href={`/product/${product.slug}`} className="block relative aspect-square overflow-hidden">
        <Image
          src={primaryImage || "/placeholder-product.jpg"}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {discount && (
          <span className="absolute top-3 left-3 bg-gold text-black text-xs font-bold px-3 py-1 rounded-full">
            -{discount}%
          </span>
        )}
        {product.stock_quantity === 0 && (
          <span className="absolute inset-0 bg-black/70 flex items-center justify-center text-white text-sm uppercase tracking-widest">
            Out of Stock
          </span>
        )}
        <button
          onClick={handleWishlist}
          className="absolute top-3 right-3 h-9 w-9 rounded-full bg-black/50 backdrop-blur flex items-center justify-center text-white hover:text-gold transition-colors"
          aria-label="Add to wishlist"
        >
          <Heart size={16} />
        </button>
      </Link>

      <div className="p-5">
        {product.brand && <p className="text-xs text-gray-muted uppercase tracking-widest mb-1">{product.brand.name}</p>}
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-display text-lg text-white group-hover:text-gold transition-colors truncate">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-1 mt-1">
          <Star size={13} className="fill-gold text-gold" />
          <span className="text-xs text-gray-muted">
            {product.avg_rating.toFixed(1)} ({product.review_count})
          </span>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-baseline gap-2">
            <span className="text-gold font-semibold text-lg">{formatPrice(product.price)}</span>
            {product.compare_at_price && (
              <span className="text-gray-muted text-sm line-through">{formatPrice(product.compare_at_price)}</span>
            )}
          </div>
          <button
            disabled={product.stock_quantity === 0}
            onClick={() => {
              addItem({
                productId: product.id,
                name: product.name,
                slug: product.slug,
                price: product.price,
                image: primaryImage || "/placeholder-product.jpg",
                quantity: 1,
                stock: product.stock_quantity,
              });
              toast.success(`${product.name} added to cart`);
            }}
            className={cn(
              "h-10 w-10 rounded-full flex items-center justify-center transition-all duration-300",
              "bg-white/5 text-gold hover:bg-gold hover:text-black disabled:opacity-30 disabled:pointer-events-none"
            )}
            aria-label="Add to cart"
          >
            <ShoppingBag size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
