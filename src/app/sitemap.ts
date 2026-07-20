import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const supabase = await createClient();

  const staticPages = [
    "",
    "/shop",
    "/categories",
    "/about",
    "/contact",
    "/faqs",
    "/privacy-policy",
    "/terms",
    "/return-policy",
    "/login",
    "/signup",
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const { data: products } = await supabase.from("products").select("slug, updated_at").eq("status", "active");

  const productPages = (products || []).map((p) => ({
    url: `${baseUrl}/product/${p.slug}`,
    lastModified: new Date(p.updated_at),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const { data: categories } = await supabase.from("categories").select("slug").eq("is_active", true);
  const categoryPages = (categories || []).map((c) => ({
    url: `${baseUrl}/shop?category=${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...productPages, ...categoryPages];
}
