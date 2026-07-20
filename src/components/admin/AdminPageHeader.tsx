import type { ReactNode } from "react";

export default function AdminPageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
      <div>
        <h1 className="font-display text-3xl text-white">{title}</h1>
        {description && <p className="text-gray-muted text-sm mt-1">{description}</p>}
      </div>
      {action}
    </div>
  );
}
