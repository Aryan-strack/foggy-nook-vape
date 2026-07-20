import { createClient } from "@/lib/supabase/server";
import AdminPageHeader from "@/components/admin/AdminPageHeader";

export default async function AdminCustomersPage() {
  const supabase = await createClient();
  const { data: customers } = await supabase.from("customers").select("*").order("created_at", { ascending: false });

  return (
    <div>
      <AdminPageHeader title="Customers" description="Everyone who has placed an order or created an account" />

      <div className="glass-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gold/10 text-left text-gray-muted uppercase text-xs tracking-widest">
              <th className="p-4">Name</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Email</th>
              <th className="p-4">City</th>
              <th className="p-4">Joined</th>
            </tr>
          </thead>
          <tbody>
            {customers?.map((c) => (
              <tr key={c.id} className="border-b border-gold/5 hover:bg-white/[0.02]">
                <td className="p-4 text-white font-medium">{c.full_name}</td>
                <td className="p-4 text-gray-muted">{c.phone}</td>
                <td className="p-4 text-gray-muted">{c.email || "—"}</td>
                <td className="p-4 text-gray-muted">{c.city || "—"}</td>
                <td className="p-4 text-gray-muted">{new Date(c.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
            {!customers?.length && (
              <tr><td colSpan={5} className="p-10 text-center text-gray-muted">No customers yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
