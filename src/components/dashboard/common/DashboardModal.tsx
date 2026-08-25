import React, { useEffect } from "react";
import { X } from "lucide-react";

interface DashboardModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export default function DashboardModal({
  open,
  onClose,
  title,
  description,
  children,
  maxWidth = "sm:max-w-lg",
}: DashboardModalProps) {
  useEffect(() => {
    if (!open) return;

    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/75 p-0 backdrop-blur-md sm:items-center sm:p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className={`max-h-[92vh] w-full overflow-y-auto rounded-t-[2rem] border border-white/10 bg-[#0b1326] shadow-2xl ${maxWidth} sm:rounded-[2rem]`}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/[0.07] bg-[#0b1326]/95 px-5 py-4 backdrop-blur-xl sm:px-6">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-black text-white">
              {title}
            </h3>
            {description && (
              <p className="mt-0.5 text-[9px] text-white/30">
                {description}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="ml-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/50 transition hover:bg-white/10 hover:text-white"
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-5 sm:p-6">{children}</div>
      </div>
    </div>
  );
}
