import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import ImageGallery from "@/components/product/ImageGallery";
import ProductInfo from "@/components/product/ProductInfo";
import ProductTabs from "@/components/product/ProductTabs";
import RelatedProducts from "@/components/product/RelatedProducts";
import type { Product, Review } from "@/types";
import type { Metadata } from "next";

async function getProduct(slug: string) {
  const supabase = await createClient();
  const { data: product } = await supabase
    .from("products")
    .select("*, brand:brands(*), category:categories(*), images:product_images(*)")
    .eq("slug", slug)
    .eq("status", "active")
    .single();

  if (!product) return null;

  const [{ data: reviews }, { data: related }, { data: settings }] = await Promise.all([
    supabase.from("reviews").select("*").eq("product_id", product.id).eq("is_approved", true).order("created_at", { ascending: false }),
    supabase
      .from("products")
      .select("*, brand:brands(*), images:product_images(*)")
      .eq("category_id", product.category_id)
      .neq("id", product.id)
      .eq("status", "active")
      .limit(4),
    supabase.from("settings").select("whatsapp_number").eq("id", 1).single(),
  ]);

  return {
    product: product as Product,
    reviews: (reviews as Review[]) || [],
    related: (related as Product[]) || [],
    whatsappNumber: settings?.whatsapp_number || "923001234567",
  };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const data = await getProduct(slug);
  if (!data) return { title: "Product Not Found" };
  const { product } = data;

  return {
    title: product.meta_title || product.name,
    description: product.meta_description || product.description?.slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.description?.slice(0, 160),
      images: product.images?.[0]?.image_url ? [product.images[0].image_url] : [],
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getProduct(slug);
  if (!data) notFound();
  const { product, reviews, related, whatsappNumber } = data;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images?.map((i) => i.image_url),
    description: product.description,
    sku: product.sku,
    brand: product.brand ? { "@type": "Brand", name: product.brand.name } : undefined,
    offers: {
      "@type": "Offer",
      priceCurrency: "PKR",
      price: product.price,
      availability: product.stock_quantity > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
    aggregateRating:
      product.review_count > 0
        ? { "@type": "AggregateRating", ratingValue: product.avg_rating, reviewCount: product.review_count }
        : undefined,
  };

  return (
    <div className="container py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="grid md:grid-cols-2 gap-14">
        <ImageGallery images={product.images || []} productName={product.name} />
        <ProductInfo product={product} whatsappNumber={whatsappNumber} />
      </div>

      <ProductTabs product={product} reviews={reviews} />
      <RelatedProducts products={related} />
    </div>
  );
}
