import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminSidebar from "@/components/admin/Sidebar";
import AdminTopbar from "@/components/admin/Topbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Admin Panel", template: "%s | Admin — Foggy Nook" },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirect=/admin");

  const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single();

  if (!profile || !["admin", "staff"].includes(profile.role)) {
    redirect("/");
  }

  return (
    <div className="flex bg-black min-h-screen">
      <AdminSidebar />
      <div className="flex-1 min-w-0">
        <AdminTopbar />
        <main className="p-6 lg:p-10">{children}</main>
      </div>
    </div>
  );
}
