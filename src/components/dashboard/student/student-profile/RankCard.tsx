import React from 'react';
import { LucideIcon } from 'lucide-react';

interface RankCardProps {
  title: string;
  icon: LucideIcon;
  rank: number | null;
  totalStudents: number;
  rankedStudents: number;
  averagePercentage: number;
}

export default function RankCard({
  title,
  icon: Icon,
  rank,
  totalStudents,
  rankedStudents,
  averagePercentage,
}: RankCardProps) {
  const progress =
    rank && rankedStudents > 0
      ? Math.max(
          5,
          100 -
            ((rank - 1) / rankedStudents) * 100
        )
      : 0;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-white/50">
          {title}
        </span>

        <div className="rounded-xl bg-[#adc6ff]/10 p-2.5 text-[#adc6ff]">
          <Icon className="h-4 w-4" />
        </div>
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <p className="text-3xl font-black text-white">
            {rank ? `#${rank}` : 'N/A'}
          </p>

          <p className="mt-1 text-[10px] text-white/30">
            of {rankedStudents} ranked students
          </p>
        </div>

        <div className="text-right">
          <p className="text-sm font-bold text-[#6ffbbe]">
            {averagePercentage}%
          </p>

          <p className="text-[9px] text-white/30">
            Average
          </p>
        </div>
      </div>

      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/5">
        <div
          className="h-full rounded-full bg-[#6ffbbe] transition-all"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>

      <p className="mt-2 text-[9px] text-white/25">
        {totalStudents} total students
      </p>
    </div>
  );
}
