'use client';

import React from 'react';
import { GraduationCap, CheckCircle2, BookOpen, UserPlus, Users } from 'lucide-react';
import { DashboardStatCard, DashboardStatGrid } from '@/components/dashboard/common';

interface StudentStatsProps {
  stats: {
    total: number;
    scienceCount: number;
    commerceCount: number;
    humanitiesCount?: number;
  };
  onOpenModal: () => void;
}

export default function StudentStats({ stats, onOpenModal }: StudentStatsProps) {
  return (
    <DashboardStatGrid columns="5">
      <DashboardStatCard title="Total Enrolled" value={stats.total} icon={GraduationCap} accent="blue" />
      <DashboardStatCard title="Science Group" value={stats.scienceCount} icon={CheckCircle2} accent="green" />
      <DashboardStatCard title="Commerce Group" value={stats.commerceCount} icon={BookOpen} accent="purple" />
      <DashboardStatCard title="Humanities Group" value={stats.humanitiesCount ?? 0} icon={Users} accent="amber" />

      <div className="flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-white/[0.035] p-5 backdrop-blur-xl">
        <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/35">Actions</span>
        <button
          type="button"
          onClick={onOpenModal}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-blue-500/20 transition-all hover:from-blue-500 hover:to-indigo-500"
        >
          <UserPlus className="h-4 w-4" />
          Add New Student
        </button>
      </div>
    </DashboardStatGrid>
  );
}
