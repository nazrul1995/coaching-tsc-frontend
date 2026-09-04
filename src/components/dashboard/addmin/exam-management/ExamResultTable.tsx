'use client';

import React from 'react';
import { UserX, UserCheck, ShieldCheck } from 'lucide-react';
import { DashboardTableWrapper, EmptyState } from '@/components/dashboard/common';
import ResultStatusBadge from './ResultStatusBadge';
import { ExamResultRecord } from './result.types';
import { formatPercentage } from './result.helpers';

export default function ExamResultTable({ results }: { results: ExamResultRecord[] }) {
  return (
    <DashboardTableWrapper>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[850px] border-collapse">
          <thead>
            <tr className="border-b border-white/[0.06] bg-white/[0.015]">
              <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-white/40">
                Student
              </th>
              <th className="px-5 py-3 text-center text-[10px] font-bold uppercase tracking-wider text-white/40">
                Group
              </th>
              <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-white/40">
                Marks
              </th>
              <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-white/40">
                Percentage
              </th>
              <th className="px-5 py-3 text-center text-[10px] font-bold uppercase tracking-wider text-white/40">
                Grade
              </th>
              <th className="px-5 py-3 text-center text-[10px] font-bold uppercase tracking-wider text-white/40">
                Attendance
              </th>
              <th className="px-5 py-3 text-center text-[10px] font-bold uppercase tracking-wider text-white/40">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.045]">
            {results.map((r) => {
              // JSON Data Extracted Fields
              const studentName = r.student?.name || 'Unknown Student';
              const className = r.student?.className ? `Class ${r.student.className}` : '—';
              const batch = r.student?.batch ? ` · ${r.student.batch}` : '';
              const group = r.student?.group || '—';
              
              // Marks Logic: `marks` = Obtained, `totalMarks` = Full Marks
              const obtainedMarks = r.marks ?? 0;
              const fullMarks = r.totalMarks ?? 0;

              return (
                <tr key={r._id} className="transition-colors hover:bg-white/[0.025]">
                  {/* Student Details */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white/5 border border-white/10 text-xs font-black text-[#adc6ff]">
                        {r.student?.photo ? (
                          <img
                            src={r.student.photo}
                            alt={studentName}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          studentName.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">{studentName}</p>
                        <p className="text-[10px] text-white/40">
                          {className}
                          {batch}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Group */}
                  <td className="px-5 py-4 text-center">
                    <span className="inline-block rounded-md bg-white/5 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-white/60 border border-white/5">
                      {group}
                    </span>
                  </td>

                  {/* Marks */}
                  <td className="px-5 py-4 text-right font-mono text-xs font-bold text-white">
                    {r.isAbsent ? (
                      <span className="text-white/30">—</span>
                    ) : (
                      <>
                        <span>{obtainedMarks}</span>
                        <span className="text-white/30 font-normal"> / {fullMarks}</span>
                      </>
                    )}
                  </td>

                  {/* Percentage */}
                  <td className="px-5 py-4 text-right font-mono text-xs font-bold text-[#adc6ff]">
                    {r.isAbsent ? '0%' : formatPercentage(r.percentage)}
                  </td>

                  {/* Grade */}
                  <td className="px-5 py-4 text-center">
                    <ResultStatusBadge grade={r.grade} isAbsent={r.isAbsent} />
                  </td>

                  {/* Attendance */}
                  <td className="px-5 py-4 text-center text-xs">
                    {r.isAbsent ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-2.5 py-1 text-[10px] font-semibold text-rose-400 border border-rose-500/20">
                        <UserX size={12} /> Absent
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#6ffbbe]/10 px-2.5 py-1 text-[10px] font-semibold text-[#6ffbbe] border border-[#6ffbbe]/20">
                        <UserCheck size={12} /> Present
                      </span>
                    )}
                  </td>

                  {/* Result Status */}
                  <td className="px-5 py-4 text-center">
                    <span className="inline-flex items-center gap-1 rounded-md bg-blue-500/10 px-2 py-0.5 text-[10px] font-medium capitalize text-blue-300 border border-blue-500/20">
                      <ShieldCheck size={11} />
                      {r.status || 'published'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {!results.length && (
        <EmptyState
          title="No results found"
          description="There are no result records for the selected exam."
        />
      )}
    </DashboardTableWrapper>
  );
}