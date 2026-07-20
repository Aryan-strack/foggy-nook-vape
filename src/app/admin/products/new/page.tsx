import { createClient } from "@/lib/supabase/server";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import ProductForm from "@/components/admin/ProductForm";

export default async function NewProductPage() {
  const supabase = await createClient();
  const [{ data: brands }, { data: categories }] = await Promise.all([
    supabase.from("brands").select("*").order("name"),
    supabase.from("categories").select("*").order("name"),
  ]);

  return (
    <div>
      <AdminPageHeader title="Add Product" description="Create a new product in your catalog" />
      <ProductForm brands={brands || []} categories={categories || []} />
    </div>
  );
}
