import { createClient } from "@/lib/supabase/server";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import ReviewItem from "@/components/admin/ReviewItem";

export default async function AdminReviewsPage() {
  const supabase = await createClient();
  const { data: reviews } = await supabase
    .from("reviews")
    .select("*, product:products(name)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <AdminPageHeader title="Reviews" description="Approve, reply to, or remove customer reviews" />
      <div className="grid md:grid-cols-2 gap-5">
        {reviews?.map((r: any) => (
          <ReviewItem key={r.id} review={r} />
        ))}
        {!reviews?.length && <p className="text-gray-muted col-span-2 text-center py-10">No reviews yet.</p>}
      </div>
    </div>
  );
}
