import React from "react";

interface DashboardStatGridProps {
  children: React.ReactNode;
  columns?: string;
}

export default function DashboardStatGrid({
  children,
  columns = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
}: DashboardStatGridProps) {
  return <div className={`grid gap-4 ${columns}`}>{children}</div>;
}
