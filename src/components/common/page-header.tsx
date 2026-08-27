"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

interface PageHeaderProps {
  title: string;
  description: string;
  icon: LucideIcon;
  actions?: React.ReactNode;
}

export function PageHeader({ title, description, icon: Icon, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-white/10 pb-6 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-4">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-[#adc6ff]/20 to-[#6ffbbe]/10 text-[#6ffbbe] shadow-lg">
          <Icon className="size-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">{title}</h1>
          <p className="text-xs text-[#adc6ff]/80 md:text-sm">{description}</p>
        </div>
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}