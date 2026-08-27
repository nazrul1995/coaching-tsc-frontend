'use client';

import React from 'react';
import {
  GraduationCap,
  CheckCircle2,
  BookOpen,
  UserPlus,
  Users,
  LucideIcon,
} from 'lucide-react';

interface StudentStatsData {
  total: number;
  scienceCount: number;
  commerceCount: number;
  humanitiesCount?: number;
}

interface StudentStatsProps {
  stats: StudentStatsData;
  onOpenModal?: () => void;
  showAddButton?: boolean;
}

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  iconClassName: string;
  iconBgClassName: string;
}

function StatCard({
  title,
  value,
  icon: Icon,
  iconClassName,
  iconBgClassName,
}: StatCardProps) {
  return (
    <div
      className="
        group relative overflow-hidden
        rounded-2xl
        border border-white/10
        bg-white/[0.035]
        p-5
        backdrop-blur-xl
        transition-all duration-300
        hover:border-white/15
        hover:bg-white/[0.055]
      "
    >
      {/* Background glow */}
      <div
        className="
          pointer-events-none
          absolute -right-8 -top-8
          h-24 w-24
          rounded-full
          bg-white/[0.03]
          blur-2xl
          transition-all duration-300
          group-hover:bg-white/[0.06]
        "
      />

      <div className="relative flex items-center justify-between">
        <span className="text-sm font-medium text-white/55">
          {title}
        </span>

        <div
          className={`
            flex h-10 w-10 items-center justify-center
            rounded-xl
            ${iconBgClassName}
          `}
        >
          <Icon className={`h-5 w-5 ${iconClassName}`} />
        </div>
      </div>

      <h3 className="relative mt-3 text-2xl font-bold tracking-tight text-white">
        {value}
      </h3>
    </div>
  );
}

export default function StudentStats({
  stats,
  onOpenModal,
  showAddButton = true,
}: StudentStatsProps) {
  return (
    <div
      className="
        grid
        grid-cols-1
        gap-4
        sm:grid-cols-2
        lg:grid-cols-5
      "
    >
      {/* Total Students */}
      <StatCard
        title="Total Enrolled"
        value={stats.total}
        icon={GraduationCap}
        iconClassName="text-blue-400"
        iconBgClassName="bg-blue-500/10"
      />

      {/* Science */}
      <StatCard
        title="Science Group"
        value={stats.scienceCount}
        icon={CheckCircle2}
        iconClassName="text-emerald-400"
        iconBgClassName="bg-emerald-500/10"
      />

      {/* Commerce */}
      <StatCard
        title="Commerce Group"
        value={stats.commerceCount}
        icon={BookOpen}
        iconClassName="text-purple-400"
        iconBgClassName="bg-purple-500/10"
      />

      {/* Humanities */}
      <StatCard
        title="Humanities Group"
        value={stats.humanitiesCount ?? 0}
        icon={Users}
        iconClassName="text-amber-400"
        iconBgClassName="bg-amber-500/10"
      />

      {/* Add Student */}
      {showAddButton && onOpenModal ? (
        <div
          className="
            flex flex-col justify-between
            rounded-2xl
            border border-white/10
            bg-white/[0.035]
            p-5
            backdrop-blur-xl
          "
        >
          <span className="text-sm font-medium text-white/55">
            Actions
          </span>

          <button
            type="button"
            onClick={onOpenModal}
            className="
              mt-3
              flex w-full items-center justify-center gap-2
              rounded-xl
              bg-gradient-to-r from-blue-600 to-indigo-600
              px-4 py-2.5
              text-sm font-semibold text-white
              shadow-lg shadow-blue-500/20
              transition-all duration-200
              hover:from-blue-500
              hover:to-indigo-500
              hover:shadow-blue-500/30
              active:scale-[0.98]
              cursor-pointer
            "
          >
            <UserPlus className="h-4 w-4" />
            Add New Student
          </button>
        </div>
      ) : (
        <div
          className="
            hidden
            lg:block
            rounded-2xl
            border border-dashed border-white/10
            bg-white/[0.02]
          "
        />
      )}
    </div>
  );
}