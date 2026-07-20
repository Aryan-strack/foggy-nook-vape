import { createClient } from "@/lib/supabase/server";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import RoleSelector from "@/components/admin/RoleSelector";

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const { data: users } = await supabase.from("users").select("*").order("created_at", { ascending: false });

  return (
    <div>
      <AdminPageHeader title="Users" description="Manage admin, staff, and customer accounts" />

      <div className="glass-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gold/10 text-left text-gray-muted uppercase text-xs tracking-widest">
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Joined</th>
              <th className="p-4 text-right">Role</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((u) => (
              <tr key={u.id} className="border-b border-gold/5 hover:bg-white/[0.02]">
                <td className="p-4 text-white font-medium">{u.full_name || "—"}</td>
                <td className="p-4 text-gray-muted">{u.email}</td>
                <td className="p-4 text-gray-muted">{new Date(u.created_at).toLocaleDateString()}</td>
                <td className="p-4 text-right">
                  <RoleSelector userId={u.id} currentRole={u.role} />
                </td>
              </tr>
            ))}
            {!users?.length && (
              <tr><td colSpan={4} className="p-10 text-center text-gray-muted">No users yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
