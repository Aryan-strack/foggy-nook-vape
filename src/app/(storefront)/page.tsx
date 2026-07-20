import { createClient } from "@/lib/supabase/server";
import Hero from "@/components/home/Hero";
import FeaturedCategories from "@/components/home/FeaturedCategories";
import ProductShowcase from "@/components/home/ProductShowcase";
import FlashSale from "@/components/home/FlashSale";
import Testimonials from "@/components/home/Testimonials";
import Newsletter from "@/components/home/Newsletter";
import type { Product, Category } from "@/types";

export const revalidate = 60; // ISR: refresh homepage data every 60s

async function getHomeData() {
  const supabase = await createClient();

  const [{ data: categories }, { data: featured }, { data: newArrivals }, { data: bestSellers }, { data: flashSale }, { data: settings }] =
    await Promise.all([
      supabase.from("categories").select("*").eq("is_active", true).order("sort_order").limit(8),
      supabase
        .from("products")
        .select("*, brand:brands(*), images:product_images(*)")
        .eq("status", "active")
        .eq("is_featured", true)
        .limit(8),
      supabase
        .from("products")
        .select("*, brand:brands(*), images:product_images(*)")
        .eq("status", "active")
        .eq("is_new_arrival", true)
        .limit(8),
      supabase
        .from("products")
        .select("*, brand:brands(*), images:product_images(*)")
        .eq("status", "active")
        .eq("is_best_seller", true)
        .limit(8),
      supabase
        .from("products")
        .select("*, brand:brands(*), images:product_images(*)")
        .eq("status", "active")
        .eq("is_flash_sale", true)
        .limit(8),
      supabase.from("settings").select("hero_slides").eq("id", 1).single(),
    ]);

  return {
    categories: (categories as Category[]) || [],
    featured: (featured as Product[]) || [],
    newArrivals: (newArrivals as Product[]) || [],
    bestSellers: (bestSellers as Product[]) || [],
    flashSale: (flashSale as Product[]) || [],
    flashSaleEndsAt: flashSale?.[0]?.flash_sale_ends_at ?? null,
    heroSlides: settings?.hero_slides || [],
  };
}

export default async function HomePage() {
  const { categories, featured, newArrivals, bestSellers, flashSale, flashSaleEndsAt, heroSlides } = await getHomeData();

  return (
    <>
      <Hero slides={heroSlides} />
      <FeaturedCategories categories={categories} />
      <ProductShowcase eyebrow="Handpicked Selection" title="Featured Products" products={featured} />
      <FlashSale products={flashSale} endsAt={flashSaleEndsAt} />
      <ProductShowcase eyebrow="Just Landed" title="New Arrivals" products={newArrivals} />
      <ProductShowcase eyebrow="Customer Favorites" title="Best Sellers" products={bestSellers} />
      <Testimonials />
      <Newsletter />
    </>
  );
}
