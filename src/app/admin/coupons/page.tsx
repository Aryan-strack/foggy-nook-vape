import { createClient } from "@/lib/supabase/server";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import CouponsManager from "@/components/admin/CouponsManager";

export default async function AdminCouponsPage() {
  const supabase = await createClient();
  const { data: coupons } = await supabase.from("coupons").select("*").order("created_at", { ascending: false });

  return (
    <div>
      <AdminPageHeader title="Coupons" description="Create and manage discount codes" />
      <CouponsManager coupons={(coupons as any) || []} />
    </div>
  );
}
