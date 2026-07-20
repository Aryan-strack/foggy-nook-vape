"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import type { Product, Review } from "@/types";
import { toast } from "sonner";

const TABS = ["Description", "Specifications", "Reviews"] as const;

export default function ProductTabs({ product, reviews }: { product: Product; reviews: Review[] }) {
  const [active, setActive] = useState<(typeof TABS)[number]>("Description");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Thanks! Your review has been submitted for approval.");
    setComment("");
  };

  return (
    <div className="mt-20">
      <div className="flex gap-8 border-b border-gold/10 mb-10">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`pb-4 text-sm uppercase tracking-widest transition-colors relative ${
              active === tab ? "text-gold" : "text-gray-muted hover:text-white"
            }`}
          >
            {tab}
            {active === tab && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />}
          </button>
        ))}
      </div>

      {active === "Description" && (
        <div className="text-gray-muted leading-relaxed max-w-3xl">{product.description}</div>
      )}

      {active === "Specifications" && (
        <div className="max-w-2xl divide-y divide-gold/10">
          {Object.entries(product.specifications || {}).map(([key, value]) => (
            <div key={key} className="flex justify-between py-3 text-sm">
              <span className="text-gray-muted capitalize">{key.replace(/_/g, " ")}</span>
              <span className="text-white">{value}</span>
            </div>
          ))}
          {Object.keys(product.specifications || {}).length === 0 && (
            <p className="text-gray-muted text-sm py-3">No specifications listed for this product.</p>
          )}
        </div>
      )}

      {active === "Reviews" && (
        <div className="max-w-3xl">
          <div className="space-y-6 mb-10">
            {reviews.length === 0 && <p className="text-gray-muted text-sm">No reviews yet. Be the first to review this product.</p>}
            {reviews.map((r) => (
              <div key={r.id} className="glass-card p-6">
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={13} className={i < r.rating ? "fill-gold text-gold" : "text-gray-muted"} />
                  ))}
                </div>
                {r.title && <h4 className="text-white font-medium mb-1">{r.title}</h4>}
                <p className="text-gray-muted text-sm">{r.comment}</p>
                {r.admin_reply && (
                  <div className="mt-3 pl-4 border-l-2 border-gold/30">
                    <p className="text-xs text-gold mb-1">Store reply</p>
                    <p className="text-gray-muted text-sm">{r.admin_reply}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmitReview} className="glass-card p-6">
            <h4 className="font-display text-lg text-white mb-4">Write a Review</h4>
            <div className="flex gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((n) => (
                <button type="button" key={n} onClick={() => setRating(n)}>
                  <Star size={22} className={n <= rating ? "fill-gold text-gold" : "text-gray-muted"} />
                </button>
              ))}
            </div>
            <textarea
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this product..."
              rows={4}
              className="w-full bg-white/5 border border-gold/20 rounded-xl p-4 text-sm text-white placeholder:text-gray-muted focus:outline-none focus:border-gold mb-4"
            />
            <button type="submit" className="btn-gold">Submit Review</button>
          </form>
        </div>
      )}
    </div>
  );
}
