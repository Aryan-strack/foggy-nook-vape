"use client";

import Image from "next/image";
import { useState } from "react";
import type { ProductImage } from "@/types";
import { cn } from "@/lib/utils";

export default function ImageGallery({ images, productName }: { images: ProductImage[]; productName: string }) {
  const sorted = [...(images || [])].sort((a, b) => a.sort_order - b.sort_order);
  const [active, setActive] = useState(sorted[0]?.image_url || "/placeholder-product.jpg");
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [zooming, setZooming] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setZoomPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div
        className="relative aspect-square rounded-2xl overflow-hidden glass-card cursor-zoom-in"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setZooming(true)}
        onMouseLeave={() => setZooming(false)}
      >
        <Image
          src={active}
          alt={productName}
          fill
          className="object-cover transition-transform duration-300"
          style={
            zooming
              ? { transform: "scale(2)", transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` }
              : undefined
          }
          priority
        />
      </div>

      {sorted.length > 1 && (
        <div className="flex gap-3 overflow-x-auto">
          {sorted.map((img) => (
            <button
              key={img.id}
              onClick={() => setActive(img.image_url)}
              className={cn(
                "relative h-20 w-20 shrink-0 rounded-xl overflow-hidden border-2 transition-colors",
                active === img.image_url ? "border-gold" : "border-transparent opacity-60 hover:opacity-100"
              )}
            >
              <Image src={img.image_url} alt={img.alt_text || productName} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
