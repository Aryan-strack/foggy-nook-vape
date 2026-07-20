"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, Share2, Minus, Plus, ShoppingBag, Zap, Star, Check } from "lucide-react";
import WhatsAppIcon from "@/components/layout/WhatsAppIcon";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import { toggleWishlist } from "@/lib/actions/wishlist";
import type { Product } from "@/types";
import { toast } from "sonner";

export default function ProductInfo({ product, whatsappNumber = "923001234567" }: { product: Product; whatsappNumber?: string }) {
  const [qty, setQty] = useState(1);
  const addItem = useCartStore((s) => s.addItem);
  const router = useRouter();
  const primaryImage = product.images?.find((i) => i.is_primary)?.image_url || product.images?.[0]?.image_url;
  const inStock = product.stock_quantity > 0;

  const discount =
    product.compare_at_price && product.compare_at_price > product.price
      ? Math.round(100 - (product.price / product.compare_at_price) * 100)
      : null;

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: primaryImage || "/placeholder-product.jpg",
      quantity: qty,
      stock: product.stock_quantity,
    });
    toast.success(`${qty} × ${product.name} added to cart`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/checkout");
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: product.name, url: window.location.href });
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    }
  };

  const handleWishlist = async () => {
    const result = await toggleWishlist(product.id);
    if (!result.success && result.error === "auth_required") {
      toast.error("Please login to save items to your wishlist");
      router.push("/login?redirect=/wishlist");
      return;
    }
    if (result.success) toast.success(result.added ? "Added to wishlist" : "Removed from wishlist");
  };

  return (
    <div>
      {product.brand && <p className="text-sm text-gold uppercase tracking-widest mb-2">{product.brand.name}</p>}
      <h1 className="font-display text-4xl text-white mb-3">{product.name}</h1>

      <div className="flex items-center gap-3 mb-5">
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={16} className={i < Math.round(product.avg_rating) ? "fill-gold text-gold" : "text-gray-muted"} />
          ))}
        </div>
        <span className="text-sm text-gray-muted">
          {product.avg_rating.toFixed(1)} ({product.review_count} reviews)
        </span>
      </div>

      <div className="flex items-baseline gap-3 mb-6">
        <span className="font-display text-3xl text-gold">{formatPrice(product.price)}</span>
        {product.compare_at_price && (
          <>
            <span className="text-gray-muted line-through text-lg">{formatPrice(product.compare_at_price)}</span>
            <span className="bg-gold/15 text-gold text-xs font-semibold px-3 py-1 rounded-full">-{discount}%</span>
          </>
        )}
      </div>

      <p className="text-gray-muted leading-relaxed mb-6">{product.description}</p>

      <div className="grid grid-cols-2 gap-3 text-sm mb-6">
        <div className="flex items-center gap-2 text-gray-muted">
          <span className="text-white">SKU:</span> {product.sku}
        </div>
        <div className="flex items-center gap-2">
          {inStock ? (
            <span className="flex items-center gap-1 text-green-400"><Check size={14} /> In Stock ({product.stock_quantity})</span>
          ) : (
            <span className="text-red-400">Out of Stock</span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center border border-gold/20 rounded-full">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="h-11 w-11 flex items-center justify-center text-gray-muted hover:text-gold"
            aria-label="Decrease quantity"
          >
            <Minus size={14} />
          </button>
          <span className="w-10 text-center text-white">{qty}</span>
          <button
            onClick={() => setQty((q) => Math.min(product.stock_quantity, q + 1))}
            className="h-11 w-11 flex items-center justify-center text-gray-muted hover:text-gold"
            aria-label="Increase quantity"
          >
            <Plus size={14} />
          </button>
        </div>

        <button
          onClick={handleWishlist}
          className="h-11 w-11 rounded-full border border-gold/20 flex items-center justify-center text-gray-muted hover:text-gold hover:border-gold transition-colors"
          aria-label="Add to wishlist"
        >
          <Heart size={16} />
        </button>
        <button
          onClick={handleShare}
          className="h-11 w-11 rounded-full border border-gold/20 flex items-center justify-center text-gray-muted hover:text-gold hover:border-gold transition-colors"
          aria-label="Share product"
        >
          <Share2 size={16} />
        </button>
      </div>

      <div className="flex flex-wrap gap-4">
        <button onClick={handleAddToCart} disabled={!inStock} className="btn-outline-gold flex-1 disabled:opacity-30">
          <ShoppingBag size={16} /> Add To Cart
        </button>
        <button onClick={handleBuyNow} disabled={!inStock} className="btn-gold flex-1 disabled:opacity-30">
          <Zap size={16} /> Buy Now
        </button>
      </div>

      <a
        href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hello, I want to know about ${product.name}.`)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-muted hover:text-gold transition-colors"
      >
        <WhatsAppIcon size={16} /> Have a question? Ask us on WhatsApp
      </a>
    </div>
  );
}
