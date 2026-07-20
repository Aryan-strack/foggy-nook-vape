import { cn } from "@/lib/utils";

const COLORS: Record<string, string> = {
  active: "bg-green-500/15 text-green-400",
  draft: "bg-gray-500/15 text-gray-muted",
  archived: "bg-red-500/15 text-red-400",
  pending: "bg-yellow-500/15 text-yellow-400",
  confirmed: "bg-blue-500/15 text-blue-400",
  processing: "bg-purple-500/15 text-purple-400",
  shipped: "bg-cyan-500/15 text-cyan-400",
  delivered: "bg-green-500/15 text-green-400",
  cancelled: "bg-red-500/15 text-red-400",
  approved: "bg-green-500/15 text-green-400",
  in_stock: "bg-green-500/15 text-green-400",
  low_stock: "bg-yellow-500/15 text-yellow-400",
  out_of_stock: "bg-red-500/15 text-red-400",
};

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span className={cn("px-3 py-1 rounded-full text-xs font-medium capitalize", COLORS[status] || "bg-gold/15 text-gold")}>
      {status.replace(/_/g, " ")}
    </span>
  );
}
