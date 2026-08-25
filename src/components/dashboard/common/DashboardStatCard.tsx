import React from "react";
import { LucideIcon } from "lucide-react";

interface DashboardStatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  accent?: "blue" | "green" | "amber" | "rose" | "purple";
}

const accents = {
  blue: { icon: "text-blue-400", bg: "bg-blue-500/10" },
  green: { icon: "text-emerald-400", bg: "bg-emerald-500/10" },
  amber: { icon: "text-amber-400", bg: "bg-amber-500/10" },
  rose: { icon: "text-rose-400", bg: "bg-rose-500/10" },
  purple: { icon: "text-purple-400", bg: "bg-purple-500/10" },
};

export default function DashboardStatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  accent = "blue",
}: DashboardStatCardProps) {
  const theme = accents[accent];

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-white/60">{title}</span>
        <div className={`rounded-xl p-2.5 ${theme.bg}`}>
          <Icon className={`h-5 w-5 ${theme.icon}`} />
        </div>
      </div>

      <h3 className="mt-2 text-2xl font-bold text-white">{value}</h3>

      {subtitle && (
        <p className="mt-1 text-xs text-white/35">{subtitle}</p>
      )}
    </div>
  );
}
