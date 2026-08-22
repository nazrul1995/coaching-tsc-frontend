"use client";

import React from "react";

interface GlassCardProps {
  icon?: React.ReactNode;
  iconBg?: string;
  title: string;
  value: string;
  subtitle?: string;
  children?: React.ReactNode;
  className?: string;
}

export function GlassCard({ icon, iconBg = "bg-[#adc6ff]/10", title, value, subtitle, children, className = "" }: GlassCardProps) {
  return (
    <div className={`rounded-3xl border border-white/10 bg-[#0b1326]/60 p-6 backdrop-blur-2xl shadow-xl ${className}`}>
      <div className="flex items-center gap-3">
        {icon && <div className={`flex size-10 items-center justify-center rounded-2xl ${iconBg}`}>{icon}</div>}
        <div>
          <p className="text-xs font-semibold text-[#adc6ff]">{title}</p>
          <h2 className="text-2xl font-bold text-white mt-0.5">{value}</h2>
        </div>
      </div>
      {subtitle && <p className="mt-2 text-xs text-white/50">{subtitle}</p>}
      {children}
    </div>
  );
}