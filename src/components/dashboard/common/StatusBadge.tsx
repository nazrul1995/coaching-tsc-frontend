import React from "react";

interface StatusBadgeProps {
  status: string;
  label?: string;
}

const styles: Record<string, string> = {
  paid: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  partial: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  unpaid: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  overdue: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  draft: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  published: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  present: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  absent: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

export default function StatusBadge({
  status,
  label,
}: StatusBadgeProps) {
  const normalized = String(status || "").toLowerCase();

  return (
    <span
      className={`inline-flex rounded-lg border px-2.5 py-1 text-xs font-medium ${
        styles[normalized] ||
        "border-white/10 bg-white/5 text-white/60"
      }`}
    >
      {label || status}
    </span>
  );
}
