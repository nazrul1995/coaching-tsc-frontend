import React from "react";
import { LucideIcon } from "lucide-react";

interface DashboardPageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  icon?: LucideIcon;
  actions?: React.ReactNode;
}

export default function DashboardPageHeader({
  eyebrow,
  title,
  description,
  icon: Icon,
  actions,
}: DashboardPageHeaderProps) {
  return (
    <section className="mb-6 sm:mb-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          {eyebrow && (
            <div className="mb-3 flex items-center gap-2">
              {Icon && (
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/15 to-emerald-400/10">
                  <Icon size={15} className="text-blue-400" />
                </span>
              )}
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-400/60">
                {eyebrow}
              </span>
            </div>
          )}

          <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl lg:text-4xl">
            {title}
          </h1>

          {description && (
            <p className="mt-2 max-w-2xl text-xs leading-5 text-white/40 sm:text-sm">
              {description}
            </p>
          )}
        </div>

        {actions && (
          <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">
            {actions}
          </div>
        )}
      </div>
    </section>
  );
}
