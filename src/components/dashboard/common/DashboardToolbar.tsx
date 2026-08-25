import React from "react";

interface DashboardToolbarProps {
  children: React.ReactNode;
  className?: string;
}

export default function DashboardToolbar({
  children,
  className = "",
}: DashboardToolbarProps) {
  return (
    <div
      className={`flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between ${className}`}
    >
      {children}
    </div>
  );
}
