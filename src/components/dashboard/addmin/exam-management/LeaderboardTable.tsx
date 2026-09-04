'use client';

import React from 'react';
import { Award, Medal, Trophy } from 'lucide-react';
import { DashboardTableWrapper, EmptyState } from '@/components/dashboard/common';
import { LeaderboardRow } from './result.types';
import { formatPercentage } from './result.helpers';

export default function LeaderboardTable({
  rows,
  overall = false,
}: {
  rows: LeaderboardRow[];
  overall?: boolean;
}) {
  console.log('rows', rows);

  // Top 3 Badge Helper
  const renderRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-black shadow-lg shadow-amber-500/10">
          <Trophy size={14} className="mr-0.5 text-amber-400" />1
        </span>
      );
    }
    if (rank === 2) {
      return (
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-slate-300/20 text-slate-200 border border-slate-300/30 text-xs font-black shadow-lg shadow-slate-400/10">
          <Medal size={14} className="mr-0.5 text-slate-300" />2
        </span>
      );
    }
    if (rank === 3) {
      return (
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-amber-700/20 text-amber-500 border border-amber-600/30 text-xs font-black shadow-lg shadow-amber-700/10">
          <Award size={14} className="mr-0.5 text-amber-600" />3
        </span>
      );
    }
    return (
      <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-white/50">
        {rank}
      </span>
    );
  };

  return (
    <DashboardTableWrapper>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[750px] border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.015]">
              <th className="px-5 py-3 text-center text-[10px] font-bold uppercase tracking-wider text-white/30">
                Rank
              </th>
              <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-white/30">
                Student
              </th>
              <th className="px-5 py-3 text-center text-[10px] font-bold uppercase tracking-wider text-white/30">
                Group
              </th>
              <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-white/30">
                {overall ? 'Average' : 'Percentage'}
              </th>
              {!overall && (
                <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-white/30">
                  Marks
                </th>
              )}
              <th className="px-5 py-3 text-center text-[10px] font-bold uppercase tracking-wider text-white/30">
                {overall ? 'Exams' : 'Grade'}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.045]">
            {rows.map((row) => {
              const studentName = row.student?.name?.trim() || 'Unknown Student';
              const className = row.student?.className ? `Class ${row.student.className}` : '—';
              const batch = row.student?.batch ? ` · ${row.student.batch}` : '';
              const group = row.student?.group || '—';

              // JSON Field Mapping: `marks` = Obtained Marks, `totalMarks` = Full Marks
              const obtainedMarks = row.marks ?? row.totalMarks ?? '—';
              const fullMarks = row.totalMarks && row.marks ? row.totalMarks : row.totalFullMarks ?? '—';

              return (
                <tr
                  key={`${row.student?._id}-${row.rank}`}
                  className="transition-colors hover:bg-white/[0.025]"
                >
                  {/* Rank */}
                  <td className="px-5 py-4 text-center">
                    {renderRankBadge(row.rank)}
                  </td>

                  {/* Student Info */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-[#adc6ff]/15 to-[#6ffbbe]/10 text-xs font-black text-[#adc6ff]">
                        {row.student?.photo ? (
                          <img
                            src={row.student.photo}
                            alt={studentName}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          studentName.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">{studentName}</p>
                        <p className="text-[9px] text-white/40">
                          {className}
                          {batch}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Group */}
                  <td className="px-5 py-4 text-center">
                    <span className="inline-block rounded-md bg-white/5 px-2 py-0.5 text-[9px] font-medium uppercase tracking-wider text-white/60 border border-white/5">
                      {group}
                    </span>
                  </td>

                  {/* Percentage / Average */}
                  <td className="px-5 py-4 text-right font-mono text-xs font-black text-[#6ffbbe]">
                    {formatPercentage(overall ? row.averagePercentage : row.percentage)}
                  </td>

                  {/* Marks (Obtained / Total) */}
                  {!overall && (
                    <td className="px-5 py-4 text-right font-mono text-xs font-bold text-white">
                      <span>{obtainedMarks}</span>
                      <span className="text-white/30 font-normal"> / {fullMarks}</span>
                    </td>
                  )}

                  {/* Grade / Total Exams */}
                  <td className="px-5 py-4 text-center">
                    {overall ? (
                      <span className="text-xs font-bold text-white/70">{row.totalExams}</span>
                    ) : (
                      <span className="inline-block rounded-md bg-indigo-500/10 px-2.5 py-0.5 text-xs font-bold text-indigo-300 border border-indigo-500/20">
                        {row.grade || '—'}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {!rows.length && (
        <EmptyState
          title="No leaderboard data"
          description="No published result data is available for this view."
        />
      )}
    </DashboardTableWrapper>
  );
}