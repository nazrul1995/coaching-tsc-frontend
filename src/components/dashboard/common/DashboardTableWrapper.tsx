import React from "react";

interface DashboardTableWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export default function DashboardTableWrapper({
  children,
  className = "",
}: DashboardTableWrapperProps) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl ${className}`}
    >
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}
