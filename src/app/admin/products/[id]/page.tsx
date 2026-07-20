import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import ProductForm from "@/components/admin/ProductForm";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: product }, { data: brands }, { data: categories }] = await Promise.all([
    supabase.from("products").select("*, images:product_images(*)").eq("id", id).single(),
    supabase.from("brands").select("*").order("name"),
    supabase.from("categories").select("*").order("name"),
  ]);

  if (!product) notFound();

  const sortedImages = [...(product.images || [])].sort((a: any, b: any) => a.sort_order - b.sort_order);

  return (
    <div>
      <AdminPageHeader title="Edit Product" description={product.name} />
      <ProductForm
        brands={brands || []}
        categories={categories || []}
        productId={product.id}
        initialValues={{
          ...product,
          image_urls: sortedImages.map((i: any) => i.image_url),
        }}
      />
    </div>
  );
}
