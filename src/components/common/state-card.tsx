"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  variant?: "default" | "success" | "warning" | "danger";
  icon: LucideIcon;
  accent?: "top" | "bottom" | "none";
  className?: string;
}

export function StatCard({ label, value, variant = "default", icon: Icon, className = "" }: StatCardProps) {
  const variantStyles = {
    default: "border-white/10 text-[#adc6ff]",
    success: "border-[#6ffbbe]/20 text-[#6ffbbe]",
    warning: "border-amber-500/20 text-amber-300",
    danger: "border-rose-500/20 text-rose-400",
  };

  return (
    <div className={`flex items-center justify-between rounded-3xl border bg-[#0b1326]/80 p-5 shadow-lg backdrop-blur-xl ${variantStyles[variant]} ${className}`}>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-white/50">{label}</p>
        <p className="mt-1 text-2xl font-bold text-white">{value}</p>
      </div>
      <div className="flex size-12 items-center justify-center rounded-2xl bg-white/5 border border-white/10">
        <Icon className="size-6" />
      </div>
    </div>
  );
}