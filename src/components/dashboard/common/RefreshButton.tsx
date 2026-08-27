import React from "react";
import { RefreshCw } from "lucide-react";

interface RefreshButtonProps {
  loading?: boolean;
  onClick: () => void;
  title?: string;
}

export default function RefreshButton({
  loading = false,
  onClick,
  title = "Refresh",
}: RefreshButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      title={title}
      className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-white/70 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
    >
      <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
    </button>
  );
}
