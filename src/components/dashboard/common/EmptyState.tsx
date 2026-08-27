import React from "react";
import { Search } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ElementType;
}

export default function EmptyState({
  title,
  description,
  icon: Icon = Search,
}: EmptyStateProps) {
  return (
    <div className="flex min-h-[220px] flex-col items-center justify-center px-6 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5">
        <Icon className="h-5 w-5 text-white/25" />
      </div>

      <p className="mt-3 text-sm font-semibold text-white/60">{title}</p>

      {description && (
        <p className="mt-1 text-xs text-white/30">{description}</p>
      )}
    </div>
  );
}
