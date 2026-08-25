import React from "react";
import { Filter } from "lucide-react";

export interface FilterOption {
  label: string;
  value: string;
}

interface FilterSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: FilterOption[];
  className?: string;
}

export default function FilterSelect({
  value,
  onChange,
  options,
  className = "",
}: FilterSelectProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Filter className="h-4 w-4 shrink-0 text-white/50" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-xl border border-white/10 bg-[#0b1326] px-3 py-2 text-sm text-white outline-none focus:border-blue-500/50"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
