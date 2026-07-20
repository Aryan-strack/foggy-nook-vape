import { createClient } from "@/lib/supabase/server";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import BrandsManager from "@/components/admin/BrandsManager";

export default async function AdminBrandsPage() {
  const supabase = await createClient();
  const { data: brands } = await supabase.from("brands").select("*").order("name");

  return (
    <div>
      <AdminPageHeader title="Brands" description="Manage the brands carried in your store" />
      <BrandsManager brands={brands || []} />
    </div>
  );
}
