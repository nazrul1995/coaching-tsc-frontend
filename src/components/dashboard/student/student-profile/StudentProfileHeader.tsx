'use client';

import React from 'react';
import {
  ArrowLeft,
  BarChart3,
  BookOpen,
  CreditCard,
  GraduationCap,
  Mail,
  User,
  Users,
  Wallet,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Student {
  _id: string;
  name: string;
  email: string;
  className: string;
  batch?: string;
  group?: string;
  photo?: string;
}

interface AcademicSummary {
  averagePercentage: number;
}

interface RankingItem {
  rank: number | null;
  totalStudents: number;
  rankedStudents: number;
  averagePercentage: number;
}

interface Ranking {
  group: RankingItem;
  batch: RankingItem;
  class: RankingItem;
  coaching: RankingItem;
  hasRanking: boolean;
}

interface FeeSummary {
  totalOutstanding: number;
}

type Tab = 'overview' | 'results' | 'fees' | 'info';

interface StudentProfileHeaderProps {
  student: Student;
  academicSummary: AcademicSummary;
  ranking: Ranking;
  feeSummary: FeeSummary;
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export default function StudentProfileHeader({
  student,
  academicSummary,
  ranking,
  feeSummary,
  activeTab,
  onTabChange,
}: StudentProfileHeaderProps) {
  const router = useRouter();

  const tabs = [
    {
      id: 'overview' as Tab,
      label: 'Overview',
      icon: BarChart3,
    },
    {
      id: 'results' as Tab,
      label: 'Exam Results',
      icon: GraduationCap,
    },
    {
      id: 'fees' as Tab,
      label: 'Fee History',
      icon: Wallet,
    },
    {
      id: 'info' as Tab,
      label: 'Student Info',
      icon: User,
    },
  ];

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/60 transition hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>

          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-white/30">
              Student Profile
            </p>

            <h1 className="mt-1 text-2xl font-black tracking-tight text-white">
              {student.name}
            </h1>
          </div>
        </div>

        <span className="w-fit rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-400">
          Active Student
        </span>
      </div>

      {/* Hero */}
      <section className="overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.025]">
        <div className="relative p-6 sm:p-8">
          <div className="absolute inset-0 bg-gradient-to-br from-[#adc6ff]/5 via-transparent to-[#6ffbbe]/5" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            {/* Student */}
            <div className="flex items-center gap-5">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-blue-600/30 to-indigo-600/30 text-2xl font-black text-[#adc6ff]">
                {student.photo ? (
                  <img
                    src={student.photo}
                    alt={student.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  student.name?.charAt(0).toUpperCase()
                )}
              </div>

              <div>
                <h2 className="text-2xl font-black text-white">
                  {student.name}
                </h2>

                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="rounded-lg border border-blue-500/20 bg-blue-500/10 px-2.5 py-1 text-xs font-semibold text-blue-400">
                    Class {student.className}
                  </span>

                  {student.batch && (
                    <span className="rounded-lg border border-purple-500/20 bg-purple-500/10 px-2.5 py-1 text-xs font-semibold text-purple-400">
                      {student.batch}
                    </span>
                  )}

                  {student.group && (
                    <span className="rounded-lg border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-xs font-semibold capitalize text-amber-400">
                      {student.group}
                    </span>
                  )}
                </div>

                <p className="mt-3 flex items-center gap-2 text-xs text-white/40">
                  <Mail className="h-3.5 w-3.5" />
                  {student.email}
                </p>
              </div>
            </div>

            {/* Mini Stats */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <MiniInfo
                label="Average"
                value={`${academicSummary.averagePercentage}%`}
              />

              <MiniInfo
                label="Class Rank"
                value={
                  ranking.hasRanking && ranking.class.rank
                    ? `#${ranking.class.rank}`
                    : 'N/A'
                }
              />

              <MiniInfo
                label="Outstanding"
                value={`৳${feeSummary.totalOutstanding}`}
              />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="overflow-x-auto border-t border-white/10">
          <div className="flex min-w-max px-4 sm:px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;

              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`relative flex items-center gap-2 px-5 py-4 text-xs font-bold transition ${
                    activeTab === tab.id
                      ? 'text-[#6ffbbe]'
                      : 'text-white/40 hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4" />

                  {tab.label}

                  {activeTab === tab.id && (
                    <span className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full bg-[#6ffbbe]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

function MiniInfo({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.03] px-4 py-3">
      <p className="text-[9px] uppercase tracking-wider text-white/30">
        {label}
      </p>

      <p className="mt-1 text-lg font-black text-white">
        {value}
      </p>
    </div>
  );
}
