import React from 'react';
import { LucideIcon } from 'lucide-react';

interface DashboardStatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color?: string;

  accent?: 'blue' | 'green' | 'amber' | 'rose' | 'purple';

  className?: string;
  valueClassName?: string;
}

const accents = {
  blue: {
    icon: 'text-blue-400',
    bg: 'bg-blue-500/10',
  },
  green: {
    icon: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
  },
  amber: {
    icon: 'text-amber-400',
    bg: 'bg-amber-500/10',
  },
  rose: {
    icon: 'text-rose-400',
    bg: 'bg-rose-500/10',
  },
  purple: {
    icon: 'text-purple-400',
    bg: 'bg-purple-500/10',
  },
};

export default function DashboardStatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  accent = 'blue',
  className = '',
  valueClassName = '',
}: DashboardStatCardProps) {
  const theme = accents[accent];

  return (
    <div
      className={`rounded-2xl border border-white/10 bg-white/[0.025] p-5 backdrop-blur-xl ${className}`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-medium text-white/40">
          {title}
        </span>

        <div
          className={`rounded-xl p-2.5 ${theme.bg}`}
        >
          <Icon
            className={`h-5 w-5 ${theme.icon}`}
          />
        </div>
      </div>

      <h3
        className={`mt-3 text-2xl font-black text-white ${valueClassName}`}
      >
        {value}
      </h3>

      {subtitle && (
        <p className="mt-1 text-[10px] text-white/30">
          {subtitle}
        </p>
      )}
    </div>
  );
}
