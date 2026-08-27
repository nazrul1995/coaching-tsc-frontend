import React from "react";
import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  message?: string;
  minHeight?: string;
}

export default function LoadingState({
  message = "Loading...",
  minHeight = "min-h-[50vh]",
}: LoadingStateProps) {
  return (
    <div className={`flex ${minHeight} items-center justify-center`}>
      <div className="flex flex-col items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-500/10 bg-blue-500/5">
          <Loader2 className="h-5 w-5 animate-spin text-blue-400" />
        </div>
        <p className="text-xs text-white/30">{message}</p>
      </div>
    </div>
  );
}
