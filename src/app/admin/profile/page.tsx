import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import ProfileForm from "@/components/admin/ProfileForm";

export default async function AdminProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("users").select("*").eq("id", user.id).single();

  return (
    <div>
      <AdminPageHeader title="My Profile" description="Manage your admin account details" />
      <ProfileForm userId={user.id} initialName={profile?.full_name || ""} email={user.email || ""} />
    </div>
  );
}
