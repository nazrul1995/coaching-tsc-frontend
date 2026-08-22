"use client";

import React from "react";

interface DarkCardProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  children?: React.ReactNode;
  className?: string;
}

export function DarkCard({ icon, title, description, children, className = "" }: DarkCardProps) {
  return (
    <div className={`relative overflow-hidden rounded-3xl border border-white/10 bg-[#0b1326] p-6 shadow-2xl ${className}`}>
      {icon && <div className="absolute -right-6 -top-6 opacity-40 pointer-events-none">{icon}</div>}
      <div className="relative z-10">
        <h3 className="text-lg font-bold text-white">{title}</h3>
        <p className="mt-1 text-xs text-[#adc6ff]/70">{description}</p>
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}