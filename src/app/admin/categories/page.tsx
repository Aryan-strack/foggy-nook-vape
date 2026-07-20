import { createClient } from "@/lib/supabase/server";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import CategoriesManager from "@/components/admin/CategoriesManager";

export default async function AdminCategoriesPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase.from("categories").select("*").order("sort_order");

  return (
    <div>
      <AdminPageHeader title="Categories" description="Organize your product catalog into categories" />
      <CategoriesManager categories={categories || []} />
    </div>
  );
}
