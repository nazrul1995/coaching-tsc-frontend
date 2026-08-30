"use client";

import React from "react";
import Link from "next/link";
import {
  Users,
  BookOpen,
  Trophy,
  TrendingUp,
  Clock,
  Plus,
  ArrowUpRight,
  Sparkles,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function DashboardHome() {
  const { user } = useAuth();
  const isTeacherOrAdmin = user?.role === "admin" || user?.role === "teacher";

  return (
    <div className="space-y-8">
      {/* ---------------------------------------------------------------- */}
      {/* WELCOME BANNER                                                   */}
      {/* ---------------------------------------------------------------- */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-[#121f3d] via-[#0b1326] to-[#121f3d] p-6 sm:p-8 shadow-xl">
        <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-[#adc6ff]/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#6ffbbe]/30 bg-[#6ffbbe]/10 px-3 py-1 text-xs font-semibold text-[#6ffbbe] mb-3">
              <Sparkles size={14} />
              <span>Lens Coaching Center Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Welcome back, <span className="text-[#adc6ff]">{user?.name || "User"}</span>! 👋
            </h1>
            <p className="mt-1 text-sm text-white/60">
              {isTeacherOrAdmin
                ? "Here is what's happening with your students and upcoming exams today."
                : "Track your exam performances, schedule, and rank status below."}
            </p>
          </div>

          {isTeacherOrAdmin && (
            <div className="flex flex-wrap gap-3 shrink-0">
              <Link
                href="/dashboard/admin/exam-management/create"
                className="inline-flex items-center gap-2 rounded-xl bg-[#adc6ff] px-4 py-2.5 text-xs font-bold text-[#0b1326] transition-all hover:bg-[#8eb2ff] hover:shadow-lg hover:shadow-[#adc6ff]/20"
              >
                <Plus size={16} />
                Create Exam
              </Link>
              <Link
                href="/dashboard/admin/result-management/publish"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-bold text-white backdrop-blur-md transition-all hover:bg-white/10"
              >
                <Trophy size={16} className="text-[#6ffbbe]" />
                Publish Result
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* KEY METRICS GRID                                                 */}
      {/* ---------------------------------------------------------------- */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Active Students"
          value="128"
          subtitle="Enrolled across Class 8-12"
          icon={<Users className="text-[#adc6ff]" size={22} />}
          badge="+12 this month"
          badgePositive={true}
        />
        <StatCard
          title="Exams Conducted"
          value="42"
          subtitle="Weekly & Monthly Tests"
          icon={<BookOpen className="text-[#6ffbbe]" size={22} />}
          badge="8 this week"
          badgePositive={true}
        />
        <StatCard
          title="Batch Pass Rate"
          value="94.2%"
          subtitle="GPA 3.5 and above"
          icon={<TrendingUp className="text-[#6ffbbe]" size={22} />}
          badge="+2.4% vs last exam"
          badgePositive={true}
        />
        <StatCard
          title="Top Performer"
          value="A+ (GPA 5.0)"
          subtitle="Class 10 Physics Weekly"
          icon={<Trophy className="text-[#facc15]" size={22} />}
          badge="18 Students"
          badgePositive={true}
        />
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* MAIN CONTENT SECTION: SCHEDULE & LEADERBOARD                     */}
      {/* ---------------------------------------------------------------- */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* LEFT 2 COLS: RECENT EXAMS & QUICK STATS */}
        <div className="space-y-6 lg:col-span-2">
          {/* Upcoming Exam Highlight */}
          <div className="rounded-2xl border border-white/10 bg-[#121f3d]/60 p-6 backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#adc6ff]/10 text-[#adc6ff]">
                  <Calendar size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Next Scheduled Exam</h3>
                  <p className="text-xs text-white/50">Class 9 — Higher Math Weekly Test</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-300">
                <Clock size={13} />
                In 2 Days
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="rounded-xl bg-white/[0.03] p-3 border border-white/5">
                <p className="text-[11px] text-white/40 uppercase tracking-wider font-semibold">Total Marks</p>
                <p className="mt-1 text-lg font-bold text-white">50 Marks</p>
              </div>
              <div className="rounded-xl bg-white/[0.03] p-3 border border-white/5">
                <p className="text-[11px] text-white/40 uppercase tracking-wider font-semibold">Duration</p>
                <p className="mt-1 text-lg font-bold text-white">1 Hour</p>
              </div>
              <div className="rounded-xl bg-white/[0.03] p-3 border border-white/5">
                <p className="text-[11px] text-white/40 uppercase tracking-wider font-semibold">Registered</p>
                <p className="mt-1 text-lg font-bold text-[#6ffbbe]">32 Students</p>
              </div>
              <div className="rounded-xl bg-white/[0.03] p-3 border border-white/5">
                <p className="text-[11px] text-white/40 uppercase tracking-wider font-semibold">Status</p>
                <p className="mt-1 text-lg font-bold text-[#adc6ff]">Ready</p>
              </div>
            </div>
          </div>

          {/* Recent Exam Results Table */}
          <div className="rounded-2xl border border-white/10 bg-[#121f3d]/40 p-6 backdrop-blur-md">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-base font-bold text-white">Recent Exam Records</h3>
                <p className="text-xs text-white/40">Latest published examination summaries</p>
              </div>
              <Link
                href="/dashboard/admin/exam-management"
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#adc6ff] hover:underline"
              >
                View All <ArrowUpRight size={14} />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-white/80">
                <thead className="border-b border-white/10 text-[11px] uppercase tracking-wider text-white/40 font-semibold">
                  <tr>
                    <th className="pb-3 pl-2">Exam Title</th>
                    <th className="pb-3">Class</th>
                    <th className="pb-3">Highest Score</th>
                    <th className="pb-3">Pass Rate</th>
                    <th className="pb-3 pr-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-medium">
                  <TableRow
                    title="Class 10 Physics Weekly 03"
                    className="Class 10"
                    highest="48 / 50"
                    passRate="96%"
                    published={true}
                  />
                  <TableRow
                    title="Class 8 Science Monthly Test"
                    className="Class 8"
                    highest="92 / 100"
                    passRate="88%"
                    published={true}
                  />
                  <TableRow
                    title="HSC Physics Paper I"
                    className="HSC 1st Year"
                    highest="74 / 75"
                    passRate="100%"
                    published={true}
                  />
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT 1 COL: TOP PERFORMERS LEADERBOARD */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-[#121f3d]/60 p-6 backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <Trophy size={18} className="text-[#facc15]" />
                <h3 className="text-base font-bold text-white">Top Coaching Performers</h3>
              </div>
              <span className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">Overall</span>
            </div>

            <div className="space-y-3">
              <LeaderItem rank={1} name="Sajid Rahman" className="Class 10" gpa="5.00" score="98.5%" />
              <LeaderItem rank={2} name="Nusrat Jahan" className="Class 9" gpa="5.00" score="96.2%" />
              <LeaderItem rank={3} name="Arafat Hossain" className="HSC 1st Year" gpa="4.85" score="93.8%" />
              <LeaderItem rank={4} name="Tahmina Akter" className="Class 8" gpa="4.75" score="91.0%" />
            </div>

            <Link
              href="/dashboard/admin/result-management"
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-2.5 text-xs font-semibold text-white transition-all hover:bg-white/10"
            >
              View Full Leaderboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* REUSABLE DASHBOARD COMPONENTS                                              */
/* -------------------------------------------------------------------------- */

function StatCard({
  title,
  value,
  subtitle,
  icon,
  badge,
  badgePositive,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  badge: string;
  badgePositive: boolean;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#121f3d]/40 p-5 backdrop-blur-md transition-all hover:border-white/20 hover:bg-[#121f3d]/70">
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10">
          {icon}
        </div>
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
            badgePositive
              ? "bg-[#6ffbbe]/10 border-[#6ffbbe]/30 text-[#6ffbbe]"
              : "bg-red-500/10 border-red-500/30 text-red-400"
          }`}
        >
          {badge}
        </span>
      </div>

      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-white/40">{title}</p>
        <p className="mt-1 text-2xl font-black text-white tracking-tight">{value}</p>
        <p className="mt-1 text-xs text-white/50">{subtitle}</p>
      </div>
    </div>
  );
}

function TableRow({
  title,
  className,
  highest,
  passRate,
  published,
}: {
  title: string;
  className: string;
  highest: string;
  passRate: string;
  published: boolean;
}) {
  return (
    <tr className="hover:bg-white/[0.02] transition-colors">
      <td className="py-3 pl-2 font-semibold text-white">{title}</td>
      <td className="py-3 text-white/60">{className}</td>
      <td className="py-3 text-[#adc6ff] font-bold">{highest}</td>
      <td className="py-3 text-[#6ffbbe] font-bold">{passRate}</td>
      <td className="py-3 pr-2 text-right">
        {published ? (
          <span className="inline-flex items-center gap-1 text-xs text-[#6ffbbe]">
            <CheckCircle2 size={13} /> Published
          </span>
        ) : (
          <span className="text-xs text-white/40">Draft</span>
        )}
      </td>
    </tr>
  );
}

function LeaderItem({
  rank,
  name,
  className,
  gpa,
  score,
}: {
  rank: number;
  name: string;
  className: string;
  gpa: string;
  score: string;
}) {
  const getBadgeColor = (r: number) => {
    if (r === 1) return "bg-amber-400 text-black";
    if (r === 2) return "bg-slate-300 text-black";
    if (r === 3) return "bg-amber-700 text-white";
    return "bg-white/10 text-white/60";
  };

  return (
    <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-3">
      <div className="flex items-center gap-3">
        <span className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-black ${getBadgeColor(rank)}`}>
          #{rank}
        </span>
        <div>
          <p className="text-xs font-bold text-white">{name}</p>
          <p className="text-[10px] text-white/40">{className}</p>
        </div>
      </div>

      <div className="text-right">
        <p className="text-xs font-extrabold text-[#adc6ff]">{score}</p>
        <p className="text-[10px] font-medium text-[#6ffbbe]">GPA {gpa}</p>
      </div>
    </div>
  );
}