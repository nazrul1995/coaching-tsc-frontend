'use client';

import React from 'react';
import { ClipboardList, FileCheck2, FileClock, Plus } from 'lucide-react';
import { DashboardStatCard, DashboardStatGrid } from '../../common';

interface Props { total: number; published: number; draft: number; onCreate: () => void; }
export default function ExamStats({ total, published, draft, onCreate }: Props) {
  return (
    <DashboardStatGrid columns="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      <DashboardStatCard title="Total Exams" value={String(total)} subtitle="All exam records" icon={ClipboardList} accent="blue" />
      <DashboardStatCard title="Published" value={String(published)} subtitle="Ready for result entry" icon={FileCheck2} accent="green" />
      <DashboardStatCard title="Draft Exams" value={String(draft)} subtitle="Not published yet" icon={FileClock} accent="amber" />
      <button type="button" onClick={onCreate} className="group rounded-3xl border border-white/[0.08] bg-white/[0.035] p-5 text-left transition hover:-translate-y-0.5 hover:border-white/[0.14]">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#6ffbbe]/10 text-[#6ffbbe]"><Plus size={20} /></div>
        <p className="mt-5 text-sm font-black text-white">Create New Exam</p>
        <p className="mt-1 text-[11px] text-white/35">Start an exam workflow</p>
      </button>
    </DashboardStatGrid>
  );
}
