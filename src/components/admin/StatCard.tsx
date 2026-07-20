import type { LucideIcon } from "lucide-react";

export default function StatCard({
  label,
  value,
  icon: Icon,
  trend,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  trend?: string;
}) {
  return (
    <div className="glass-card p-6 gold-hover">
      <div className="flex items-center justify-between mb-4">
        <div className="h-11 w-11 rounded-xl bg-gold/10 flex items-center justify-center text-gold">
          <Icon size={20} />
        </div>
        {trend && <span className="text-xs text-green-400">{trend}</span>}
      </div>
      <p className="font-display text-2xl text-white">{value}</p>
      <p className="text-gray-muted text-sm mt-1">{label}</p>
    </div>
  );
}
