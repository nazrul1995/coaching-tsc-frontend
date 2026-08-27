'use client';

import { Result } from '@/types/student';
import React from 'react';
interface StudentResultsTableProps {
  results: Result[];
}

export default function StudentResultsTable({
  results,
}: StudentResultsTableProps) {
  if (!results.length) {
    return (
      <div className="p-10 text-center">
        <p className="text-sm text-white/30">
          No published exam results found.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[850px] text-left">

        <thead className="border-b border-white/10 bg-white/[0.02]">
          <tr>

            <th className="px-5 py-4 text-[9px] uppercase tracking-wider text-white/30">
              Exam
            </th>

            <th className="px-5 py-4 text-[9px] uppercase tracking-wider text-white/30">
              Date
            </th>

            <th className="px-5 py-4 text-right text-[9px] uppercase tracking-wider text-white/30">
              Marks
            </th>

            <th className="px-5 py-4 text-right text-[9px] uppercase tracking-wider text-white/30">
              Percentage
            </th>

            <th className="px-5 py-4 text-right text-[9px] uppercase tracking-wider text-white/30">
              Grade
            </th>

            <th className="px-5 py-4 text-right text-[9px] uppercase tracking-wider text-white/30">
              Status
            </th>

          </tr>
        </thead>

        <tbody className="divide-y divide-white/5">

          {results.map((result) => (
            <tr
              key={result._id}
              className="transition hover:bg-white/[0.025]"
            >

              {/* Exam */}
              <td className="px-5 py-4">

                <p className="text-xs font-bold text-white">
                  {result.exam?.title || 'Exam'}
                </p>

                <p className="mt-1 text-[9px] capitalize text-white/30">
                  {result.exam?.type?.replace('_', ' ') || '—'}
                </p>

              </td>

              {/* Date */}
              <td className="px-5 py-4 text-xs text-white/50">
                {formatDate(result.exam?.examDate)}
              </td>

              {/* Marks */}
              <td className="px-5 py-4 text-right text-xs font-bold">
                {result.isAbsent
                  ? '—'
                  : `${result.marks} / ${result.totalMarks}`}
              </td>

              {/* Percentage */}
              <td className="px-5 py-4 text-right">

                {result.isAbsent ? (
                  <span className="text-xs text-rose-400">
                    Absent
                  </span>
                ) : (
                  <span className="text-xs font-black text-[#6ffbbe]">
                    {result.percentage}%
                  </span>
                )}

              </td>

              {/* Grade */}
              <td className="px-5 py-4 text-right">

                <span className="rounded-lg bg-[#adc6ff]/10 px-2.5 py-1 text-xs font-black text-[#adc6ff]">
                  {result.grade || '—'}
                </span>

              </td>

              {/* Status */}
              <td className="px-5 py-4 text-right">

                <span
                  className={`rounded-full px-2.5 py-1 text-[9px] font-bold capitalize ${
                    result.isAbsent
                      ? 'bg-rose-500/10 text-rose-400'
                      : 'bg-emerald-500/10 text-emerald-400'
                  }`}
                >
                  {result.isAbsent
                    ? 'Absent'
                    : result.status}
                </span>

              </td>

            </tr>
          ))}

        </tbody>

      </table>
    </div>
  );
}

function formatDate(date?: string) {
  if (!date) return '—';

  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}
