'use client';
import React from 'react';
import { UserX } from 'lucide-react';
import { DashboardTableWrapper, EmptyState } from '@/components/dashboard/common';
import ResultStatusBadge from './ResultStatusBadge';
import { ExamResultRecord } from './result.types';
import { formatPercentage } from './result.helpers';

export default function ExamResultTable({ results }: { results: ExamResultRecord[] }) {
  return <DashboardTableWrapper>
    <div className="overflow-x-auto">
      <table className="w-full min-w-[850px] border-collapse">
        <thead><tr className="border-b border-white/[0.06] bg-white/[0.015]">
          {['Student','Marks','Percentage','Grade','Status','Remarks'].map((h,i)=><th key={h} className={`px-5 py-3 text-${i===1||i===2?'right':'left'} text-[9px] font-bold uppercase tracking-wider text-white/30`}>{h}</th>)}
        </tr></thead>
        <tbody>{results.map(r=><tr key={r._id} className="border-b border-white/[0.045] hover:bg-white/[0.025]">
          <td className="px-5 py-4"><div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-white/5 text-xs font-black text-[#adc6ff]">{r.student?.photo?<img src={r.student.photo} alt="" className="h-full w-full object-cover"/>:r.student?.name?.charAt(0)||'S'}</div><div><p className="text-xs font-bold text-white">{r.student?.name||'Unknown'}</p><p className="text-[9px] text-white/30">Class {r.student?.className||'—'}{r.student?.batch?` · ${r.student.batch}`:''}</p></div></div></td>
          <td className="px-5 py-4 text-right font-mono text-xs font-bold text-white">{r.isAbsent?'—':`${r.totalMarks} / ${r.totalFullMarks ?? '—'}`}</td>
          <td className="px-5 py-4 text-right font-mono text-xs font-bold text-[#adc6ff]">{r.isAbsent?'0%':formatPercentage(r.percentage)}</td>
          <td className="px-5 py-4"><ResultStatusBadge grade={r.grade} isAbsent={r.isAbsent}/></td>
          <td className="px-5 py-4 text-xs text-white/50">{r.isAbsent?<span className="flex items-center gap-1 text-rose-300"><UserX size={12}/> Absent</span>:<span className="text-[#6ffbbe]">Present</span>}</td>
          <td className="max-w-[220px] truncate px-5 py-4 text-[10px] text-white/35">{r.remarks||'—'}</td>
        </tr>)}</tbody>
      </table>
    </div>
    {!results.length && <EmptyState title="No results found" description="There are no result records for the selected exam."/>}
  </DashboardTableWrapper>;
}
