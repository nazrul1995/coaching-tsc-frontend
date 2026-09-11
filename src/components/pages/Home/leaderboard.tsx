"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useQuery as useTanstackQuery } from "@tanstack/react-query";
import axiosSecure from "@/lib/axiosSecure";
import {
  Trophy,
  Crown,
  Medal,
  Award,
  ArrowRight,
  TrendingUp,
  Sparkles,
  ChevronRight,
} from "lucide-react";

interface Student {
  _id: string;
  name: string;
  photo?: string;
  className: string;
  batch?: string;
  group?: string;
}

interface LeaderboardItem {
  rank: number;
  student: Student;
  totalObtainedMarks: number;
  totalPossibleMarks: number;
  overallPercentage: number;
  totalExams: number;
}

const FALLBACK_IMAGE =
  "https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg";

const Leaderboard = () => {
  const router = useRouter();

  const { data: leaderboard = [], isLoading } =
    useTanstackQuery<LeaderboardItem[]>({
      queryKey: ["overall-leaderboard"],
      queryFn: async () => {
        const res = await axiosSecure.get("/exams/leaderboard/overall");
        return res.data?.data || [];
      },
    });

  if (isLoading) {
    return <LeaderboardSkeleton />;
  }

  if (!leaderboard.length) {
    return <EmptyLeaderboard />;
  }

  const topThree = leaderboard
    .filter((item) => item.rank <= 3)
    .sort((a, b) => a.rank - b.rank);

  const remaining = leaderboard
    .filter((item) => item.rank > 3)
    .slice(0, 7);

  return (
    <section className="relative overflow-hidden bg-[#020617] px-4 py-14 text-white sm:px-6 md:py-20">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-180px] h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-emerald-400/[0.07] blur-[120px]" />
        <div className="absolute bottom-[-150px] left-[-100px] h-[350px] w-[350px] rounded-full bg-blue-500/[0.06] blur-[120px]" />
        <div className="absolute right-[-100px] top-[30%] h-[300px] w-[300px] rounded-full bg-purple-500/[0.04] blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Header */}
        <LeaderboardHeader />

        {/* ================= PODIUM ================= */}
        <div className="mx-auto mb-10 max-w-5xl">
          <div className="grid gap-4 md:grid-cols-3 md:items-end md:gap-5">
            {topThree.map((item) => (
              <PodiumCard key={item.student._id} item={item} />
            ))}
          </div>
        </div>

        {/* ================= OTHER RANKINGS ================= */}
        {remaining.length > 0 && (
          <div className="mx-auto max-w-4xl">
            <div className="mb-3 flex items-center justify-between px-2">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/30">
                  Rankings
                </p>
                <h3 className="mt-1 text-sm font-bold text-white">
                  Top performers
                </h3>
              </div>

              <div className="flex items-center gap-1.5 text-[10px] font-medium text-white/30">
                <TrendingUp size={12} />
                Official results
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.025] shadow-2xl shadow-black/20 backdrop-blur-xl">
              {remaining.map((item, index) => (
                <RankingRow
                  key={item.student._id}
                  item={item}
                  isLast={index === remaining.length - 1}
                />
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-10 flex flex-col items-center">
          <button
            onClick={() => router.push("/result")}
            className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.07] px-6 py-3.5 text-xs font-bold text-emerald-300 transition-all duration-300 hover:border-emerald-400/40 hover:bg-emerald-400/[0.12] hover:shadow-lg hover:shadow-emerald-400/10 active:scale-[0.98] sm:w-auto"
          >
            <span>View All Exam Results</span>
            <ArrowRight
              size={15}
              className="transition-transform group-hover:translate-x-1"
            />
          </button>

          <p className="mt-4 flex items-center gap-1.5 text-[10px] text-white/25">
            <Sparkles size={11} />
            Rankings are calculated from official published results
          </p>
        </div>
      </div>
    </section>
  );
};

/* ======================================================
   HEADER
====================================================== */

function LeaderboardHeader() {
  return (
    <div className="mb-10 text-center sm:mb-14">
      <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.06] px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-300">
        <Trophy size={12} />
        Academic Leaderboard
      </div>

      <h2 className="text-3xl font-black tracking-tight sm:text-5xl">
        Top{" "}
        <span className="bg-gradient-to-r from-emerald-300 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
          Performers
        </span>
      </h2>

      <p className="mx-auto mt-3 max-w-lg text-xs leading-5 text-white/35 sm:text-sm">
        Celebrating students who are consistently performing at the highest
        level across published examinations.
      </p>
    </div>
  );
}

/* ======================================================
   PODIUM CARD
====================================================== */

function PodiumCard({ item }: { item: LeaderboardItem }) {
  const rank = item.rank;

  const config =
    rank === 1
      ? {
          wrapper:
            "md:order-2 md:-translate-y-5 border-amber-300/30 bg-gradient-to-b from-amber-400/[0.13] via-amber-400/[0.04] to-transparent",
          glow: "bg-amber-400/15",
          badge: "bg-amber-300 text-amber-950",
          icon: <Crown size={16} fill="currentColor" />,
          accent: "text-amber-300",
          ring: "ring-amber-300/20",
          label: "Champion",
        }
      : rank === 2
        ? {
            wrapper:
              "md:order-1 border-slate-300/20 bg-gradient-to-b from-slate-300/[0.09] via-slate-300/[0.025] to-transparent",
            glow: "bg-slate-300/10",
            badge: "bg-slate-200 text-slate-900",
            icon: <Medal size={16} />,
            accent: "text-slate-200",
            ring: "ring-slate-300/20",
            label: "Runner Up",
          }
        : {
            wrapper:
              "md:order-3 border-orange-500/20 bg-gradient-to-b from-orange-500/[0.08] via-orange-500/[0.025] to-transparent",
            glow: "bg-orange-500/10",
            badge: "bg-orange-500 text-white",
            icon: <Award size={16} />,
            accent: "text-orange-400",
            ring: "ring-orange-500/20",
            label: "Third Place",
          };

  return (
    <div
      className={`group relative overflow-hidden rounded-[28px] border p-5 shadow-xl shadow-black/10 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 ${config.wrapper}`}
    >
      {/* Glow */}
      <div
        className={`pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full blur-3xl ${config.glow}`}
      />

      {/* Rank */}
      <div className="mb-5 flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-[0.18em] text-white/25">
          {config.label}
        </span>

        <div
          className={`flex h-8 w-8 items-center justify-center rounded-xl ${config.badge}`}
        >
          {config.icon}
        </div>
      </div>

      {/* Student */}
      <div className="flex items-center gap-4 md:flex-col md:text-center">
        <div className="relative shrink-0">
          <div
            className={`relative h-[72px] w-[72px] overflow-hidden rounded-2xl ring-4 ${config.ring}`}
          >
            <Image
              src={item.student.photo || FALLBACK_IMAGE}
              alt={item.student.name}
              fill
              sizes="72px"
              className="object-cover"
            />
          </div>

          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/10 bg-[#07111f] px-2.5 py-1 text-[9px] font-black text-white/70 shadow-lg">
            #{rank}
          </div>
        </div>

        <div className="min-w-0 flex-1 md:w-full">
          <h3 className="truncate text-base font-black text-white">
            {item.student.name}
          </h3>

          <p className="mt-1 truncate text-[10px] text-white/35">
            Class {item.student.className}
            {item.student.group && ` • ${item.student.group}`}
          </p>
        </div>
      </div>

      {/* Score */}
      <div className="mt-6 rounded-2xl border border-white/[0.06] bg-black/10 p-3.5">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-wider text-white/25">
              Overall Score
            </p>

            <p className={`mt-1 text-2xl font-black ${config.accent}`}>
              {item.overallPercentage.toFixed(2)}%
            </p>
          </div>

          <div className="text-right">
            <p className="text-[11px] font-bold text-white/70">
              {item.totalObtainedMarks}
              <span className="text-white/25">
                {" "}
                / {item.totalPossibleMarks}
              </span>
            </p>

            <p className="mt-0.5 text-[9px] uppercase tracking-wider text-white/25">
              Marks
            </p>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
          <div
            className={`h-full rounded-full transition-all ${config.badge}`}
            style={{
              width: `${Math.min(item.overallPercentage, 100)}%`,
            }}
          />
        </div>

        <div className="mt-2 flex justify-between text-[9px] text-white/25">
          <span>{item.totalExams} exams completed</span>
          <span>Overall</span>
        </div>
      </div>
    </div>
  );
}

/* ======================================================
   RANKING ROW
====================================================== */

function RankingRow({
  item,
  isLast,
}: {
  item: LeaderboardItem;
  isLast: boolean;
}) {
  return (
    <div
      className={`group flex items-center gap-3 px-3 py-3.5 transition-colors hover:bg-white/[0.035] sm:px-5 ${
        !isLast ? "border-b border-white/[0.05]" : ""
      }`}
    >
      {/* Rank */}
      <div className="flex w-8 shrink-0 justify-center sm:w-10">
        <span className="text-xs font-black text-white/30">
          #{item.rank}
        </span>
      </div>

      {/* Avatar */}
      <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white/5">
        <Image
          src={item.student.photo || FALLBACK_IMAGE}
          alt={item.student.name}
          fill
          sizes="44px"
          className="object-cover"
        />
      </div>

      {/* Student */}
      <div className="min-w-0 flex-1">
        <h4 className="truncate text-xs font-bold text-white sm:text-sm">
          {item.student.name}
        </h4>

        <p className="mt-0.5 truncate text-[9px] text-white/30 sm:text-[10px]">
          Class {item.student.className}
          {item.student.group && ` • ${item.student.group}`}
          {item.student.batch && ` • ${item.student.batch}`}
        </p>
      </div>

      {/* Marks */}
      <div className="hidden text-right sm:block">
        <p className="text-[10px] font-bold text-white/60">
          {item.totalObtainedMarks}/{item.totalPossibleMarks}
        </p>

        <p className="text-[8px] uppercase tracking-wider text-white/20">
          Marks
        </p>
      </div>

      {/* Percentage */}
      <div className="w-[70px] shrink-0 text-right sm:w-[90px]">
        <p className="text-sm font-black text-emerald-300 sm:text-base">
          {item.overallPercentage.toFixed(2)}%
        </p>

        <p className="text-[8px] text-white/25">
          {item.totalExams} {item.totalExams === 1 ? "exam" : "exams"}
        </p>
      </div>

      {/* Arrow */}
      <ChevronRight
        size={14}
        className="hidden text-white/15 transition-transform group-hover:translate-x-0.5 sm:block"
      />
    </div>
  );
}

/* ======================================================
   LOADING
====================================================== */

function LeaderboardSkeleton() {
  return (
    <section className="min-h-[600px] bg-[#020617] px-4 py-16 text-white">
      <div className="mx-auto max-w-5xl animate-pulse">
        <div className="mx-auto mb-12 h-7 w-40 rounded-full bg-white/5" />
        <div className="mx-auto mb-3 h-12 w-72 rounded-xl bg-white/5" />
        <div className="mx-auto mb-12 h-4 w-96 max-w-full rounded bg-white/5" />

        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-[300px] rounded-[28px] border border-white/5 bg-white/[0.02]"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ======================================================
   EMPTY
====================================================== */

function EmptyLeaderboard() {
  return (
    <section className="bg-[#020617] px-4 py-20 text-white">
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-emerald-400/10 bg-emerald-400/[0.05]">
          <Trophy size={30} className="text-emerald-300/70" />
        </div>

        <h2 className="mt-6 text-2xl font-black">
          Results Coming Soon
        </h2>

        <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-white/30">
          Published results and top performers will appear here once
          examinations are evaluated and published.
        </p>
      </div>
    </section>
  );
}

export default Leaderboard;