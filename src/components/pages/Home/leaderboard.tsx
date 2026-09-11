"use client";

import React, { useMemo } from "react";
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
  Target,
  FileCheck2,
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
  rank?: number;
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

  const {
    data: rawLeaderboard = [],
    isLoading,
    isError,
  } = useTanstackQuery<LeaderboardItem[]>({
    queryKey: ["overall-leaderboard"],
    queryFn: async () => {
      const res = await axiosSecure.get("/exams/leaderboard/overall");

      return Array.isArray(res.data?.data) ? res.data.data : [];
    },
  });

  /*
   * ======================================================
   * NORMALIZE + RANK
   * ======================================================
   *
   * Primary ranking:
   * 1. Total Obtained Marks
   * 2. Percentage
   * 3. Total Exams
   */
  const leaderboard = useMemo<LeaderboardItem[]>(() => {
    return rawLeaderboard
      .map((item) => {
        const obtained = Number(item.totalObtainedMarks) || 0;
        const possible = Number(item.totalPossibleMarks) || 0;

        const calculatedPercentage =
          possible > 0 ? (obtained / possible) * 100 : 0;

        const apiPercentage = Number(item.overallPercentage);

        return {
          ...item,
          totalObtainedMarks: obtained,
          totalPossibleMarks: possible,
          overallPercentage: Number.isFinite(apiPercentage)
            ? apiPercentage
            : calculatedPercentage,
          totalExams: Number(item.totalExams) || 0,
        };
      })
      .filter((item) => item.student?._id)
      .sort((a, b) => {
        // PRIMARY: TOTAL MARKS
        if (b.totalObtainedMarks !== a.totalObtainedMarks) {
          return b.totalObtainedMarks - a.totalObtainedMarks;
        }

        // SECONDARY: PERCENTAGE
        if (b.overallPercentage !== a.overallPercentage) {
          return b.overallPercentage - a.overallPercentage;
        }

        // THIRD: EXAM COUNT
        return b.totalExams - a.totalExams;
      })
      .map((item, index) => ({
        ...item,
        rank: index + 1,
      }));
  }, [rawLeaderboard]);

  if (isLoading) {
    return <LeaderboardSkeleton />;
  }

  if (isError || !leaderboard.length) {
    return <EmptyLeaderboard />;
  }

  const topThree = leaderboard.slice(0, 3);
  const remaining = leaderboard.slice(3, 10);

  return (
    <section className="relative overflow-hidden bg-[#020617] px-4 py-14 text-white sm:px-6 md:py-20">
      {/* ======================================================
          BACKGROUND
      ====================================================== */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-180px] h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-emerald-400/[0.07] blur-[120px]" />

        <div className="absolute bottom-[-150px] left-[-100px] h-[350px] w-[350px] rounded-full bg-blue-500/[0.06] blur-[120px]" />

        <div className="absolute right-[-100px] top-[30%] h-[300px] w-[300px] rounded-full bg-purple-500/[0.04] blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* ======================================================
            HEADER
        ====================================================== */}
        <LeaderboardHeader />

        {/* ======================================================
            PODIUM
        ====================================================== */}
        {topThree.length > 0 && (
          <div className="mx-auto mb-12 max-w-5xl">
            <div className="grid gap-5 md:grid-cols-3 md:items-end">
              {topThree.map((item) => (
                <PodiumCard key={item.student._id} item={item} />
              ))}
            </div>
          </div>
        )}

        {/* ======================================================
            OTHER RANKINGS
        ====================================================== */}
        {remaining.length > 0 && (
          <div className="mx-auto max-w-5xl">
            <div className="mb-4 flex items-end justify-between px-2">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-400/10">
                    <TrendingUp
                      size={14}
                      className="text-emerald-300"
                    />
                  </div>

                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/30">
                      Rankings
                    </p>

                    <h3 className="mt-0.5 text-sm font-black text-white">
                      Top performers
                    </h3>
                  </div>
                </div>
              </div>

              <div className="hidden items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.025] px-3 py-1.5 text-[9px] font-medium text-white/30 sm:flex">
                <Target size={11} />
                Ranked by total marks
              </div>
            </div>

            <div className="overflow-hidden rounded-[28px] border border-white/[0.08] bg-white/[0.025] shadow-2xl shadow-black/20 backdrop-blur-xl">
              {/* Desktop Header */}
              <div className="hidden grid-cols-[70px_1fr_150px_120px_100px] items-center border-b border-white/[0.06] bg-white/[0.025] px-5 py-3 text-[8px] font-bold uppercase tracking-[0.15em] text-white/25 sm:grid">
                <span>Rank</span>
                <span>Student</span>
                <span className="text-right">Total Marks</span>
                <span className="text-right">Percentage</span>
                <span className="text-right">Exams</span>
              </div>

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

        {/* ======================================================
            FOOTER
        ====================================================== */}
        <div className="mt-10 flex flex-col items-center">
          <button
            type="button"
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
            Rankings are calculated from total obtained marks
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
    <div className="mb-12 text-center sm:mb-16">
      <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.06] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-300">
        <Trophy size={12} />
        Academic Leaderboard
      </div>

      <h2 className="text-3xl font-black tracking-tight sm:text-5xl">
        Top{" "}
        <span className="bg-gradient-to-r from-emerald-300 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
          Performers
        </span>
      </h2>

      <p className="mx-auto mt-4 max-w-xl text-xs leading-6 text-white/35 sm:text-sm">
        Students are ranked primarily by their total obtained marks.
        Percentage and completed examinations provide additional performance
        context.
      </p>

      {/* Ranking Rules */}
      <div className="mx-auto mt-6 flex max-w-md flex-wrap items-center justify-center gap-2">
        <div className="flex items-center gap-1.5 rounded-xl border border-emerald-400/10 bg-emerald-400/[0.05] px-3 py-2">
          <Trophy size={12} className="text-emerald-300" />
          <span className="text-[9px] font-bold text-emerald-200">
            Total Marks
          </span>
        </div>

        <div className="flex items-center gap-1.5 rounded-xl border border-cyan-400/10 bg-cyan-400/[0.05] px-3 py-2">
          <Target size={12} className="text-cyan-300" />
          <span className="text-[9px] font-bold text-cyan-200">
            Percentage
          </span>
        </div>

        <div className="flex items-center gap-1.5 rounded-xl border border-purple-400/10 bg-purple-400/[0.05] px-3 py-2">
          <FileCheck2 size={12} className="text-purple-300" />
          <span className="text-[9px] font-bold text-purple-200">
            Exams
          </span>
        </div>
      </div>
    </div>
  );
}

/* ======================================================
   PODIUM CARD
====================================================== */

function PodiumCard({ item }: { item: LeaderboardItem }) {
  const rank = item.rank ?? 0;

  const config =
    rank === 1
      ? {
          wrapper:
            "md:order-2 md:-translate-y-6 border-amber-300/30 bg-gradient-to-b from-amber-400/[0.15] via-amber-400/[0.05] to-transparent",
          glow: "bg-amber-400/15",
          badge: "bg-amber-300 text-amber-950",
          icon: <Crown size={17} fill="currentColor" />,
          accent: "text-amber-300",
          ring: "ring-amber-300/20",
          label: "Champion",
          markBg: "bg-amber-300/[0.08]",
          markBorder: "border-amber-300/10",
        }
      : rank === 2
        ? {
            wrapper:
              "md:order-1 border-slate-300/20 bg-gradient-to-b from-slate-300/[0.10] via-slate-300/[0.03] to-transparent",
            glow: "bg-slate-300/10",
            badge: "bg-slate-200 text-slate-900",
            icon: <Medal size={17} />,
            accent: "text-slate-200",
            ring: "ring-slate-300/20",
            label: "Runner Up",
            markBg: "bg-slate-300/[0.06]",
            markBorder: "border-slate-300/10",
          }
        : {
            wrapper:
              "md:order-3 border-orange-500/20 bg-gradient-to-b from-orange-500/[0.09] via-orange-500/[0.03] to-transparent",
            glow: "bg-orange-500/10",
            badge: "bg-orange-500 text-white",
            icon: <Award size={17} />,
            accent: "text-orange-400",
            ring: "ring-orange-500/20",
            label: "Third Place",
            markBg: "bg-orange-500/[0.06]",
            markBorder: "border-orange-500/10",
          };

  return (
    <div
      className={`group relative overflow-hidden rounded-[30px] border p-5 shadow-xl shadow-black/10 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 ${config.wrapper}`}
    >
      {/* Glow */}
      <div
        className={`pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full blur-3xl ${config.glow}`}
      />

      {/* Header */}
      <div className="relative mb-6 flex items-center justify-between">
        <div>
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/25">
            {config.label}
          </span>

          <p className="mt-1 text-[10px] font-bold text-white/15">
            Rank #{rank}
          </p>
        </div>

        <div
          className={`flex h-9 w-9 items-center justify-center rounded-xl ${config.badge}`}
        >
          {config.icon}
        </div>
      </div>

      {/* Student */}
      <div className="relative flex items-center gap-4 md:flex-col md:text-center">
        <div className="relative shrink-0">
          <div
            className={`relative h-[78px] w-[78px] overflow-hidden rounded-[22px] ring-4 ${config.ring}`}
          >
            <Image
              src={item.student.photo || FALLBACK_IMAGE}
              alt={item.student.name}
              fill
              sizes="78px"
              className="object-cover"
            />
          </div>

          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/10 bg-[#07111f] px-3 py-1 text-[9px] font-black text-white/70 shadow-lg">
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
            {item.student.batch && ` • ${item.student.batch}`}
          </p>
        </div>
      </div>

      {/* ======================================================
          MAIN TOTAL MARKS
      ====================================================== */}
      <div
        className={`relative mt-7 rounded-[22px] border p-4 ${config.markBg} ${config.markBorder}`}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <Trophy size={11} className={config.accent} />

              <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-white/30">
                Total Obtained
              </p>
            </div>

            <div className="mt-1 flex items-baseline gap-1.5">
              <span
                className={`text-3xl font-black tracking-tight ${config.accent}`}
              >
                {item.totalObtainedMarks}
              </span>

              <span className="text-xs font-bold text-white/20">
                / {item.totalPossibleMarks}
              </span>
            </div>
          </div>

          {/* Percentage */}
          <div className="text-right">
            <p className="text-[8px] font-bold uppercase tracking-[0.15em] text-white/25">
              Percentage
            </p>

            <p className={`mt-1 text-xl font-black ${config.accent}`}>
              {item.overallPercentage.toFixed(2)}%
            </p>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/[0.06]">
          <div
            className={`h-full rounded-full transition-all ${config.badge}`}
            style={{
              width: `${Math.min(
                Math.max(item.overallPercentage, 0),
                100
              )}%`,
            }}
          />
        </div>
      </div>

      {/* Exam Count */}
      <div className="mt-3 flex items-center justify-between rounded-2xl border border-white/[0.05] bg-black/10 px-3.5 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.04]">
            <FileCheck2 size={12} className="text-white/40" />
          </div>

          <div>
            <p className="text-[8px] uppercase tracking-wider text-white/20">
              Completed
            </p>

            <p className="text-[10px] font-bold text-white/60">
              {item.totalExams}{" "}
              {item.totalExams === 1 ? "Exam" : "Exams"}
            </p>
          </div>
        </div>

        <span className="text-[9px] font-bold text-white/20">
          Overall
        </span>
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
      className={`group relative flex items-center gap-3 px-3 py-4 transition-all duration-200 hover:bg-white/[0.035] sm:grid sm:grid-cols-[70px_1fr_150px_120px_100px] sm:gap-0 sm:px-5 ${
        !isLast ? "border-b border-white/[0.05]" : ""
      }`}
    >
      {/* Rank */}
      <div className="flex w-8 shrink-0 items-center justify-center sm:w-auto sm:justify-start">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-xl ${
            (item.rank ?? 0) <= 5
              ? "bg-emerald-400/10 text-emerald-300"
              : "bg-white/[0.04] text-white/30"
          }`}
        >
          <span className="text-[10px] font-black">
            #{item.rank}
          </span>
        </div>
      </div>

      {/* Student */}
      <div className="flex min-w-0 flex-1 items-center gap-3 sm:flex-initial">
        <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white/5">
          <Image
            src={item.student.photo || FALLBACK_IMAGE}
            alt={item.student.name}
            fill
            sizes="44px"
            className="object-cover"
          />
        </div>

        <div className="min-w-0">
          <h4 className="truncate text-xs font-bold text-white sm:text-sm">
            {item.student.name}
          </h4>

          <p className="mt-0.5 truncate text-[9px] text-white/30 sm:text-[10px]">
            Class {item.student.className}
            {item.student.group && ` • ${item.student.group}`}
            {item.student.batch && ` • ${item.student.batch}`}
          </p>
        </div>
      </div>

      {/* ======================================================
          TOTAL MARKS - PRIMARY
      ====================================================== */}
      <div className="ml-auto w-[105px] text-right sm:ml-0 sm:w-auto">
        <div className="inline-flex flex-col items-end">
          <div className="flex items-baseline gap-1">
            <span className="text-base font-black text-white sm:text-lg">
              {item.totalObtainedMarks}
            </span>

            <span className="text-[9px] font-bold text-white/20">
              / {item.totalPossibleMarks}
            </span>
          </div>

          <p className="mt-0.5 text-[7px] font-bold uppercase tracking-wider text-emerald-300/50">
            Total Marks
          </p>
        </div>
      </div>

      {/* Percentage */}
      <div className="hidden text-right sm:block">
        <p className="text-sm font-black text-emerald-300">
          {item.overallPercentage.toFixed(2)}%
        </p>

        <p className="mt-0.5 text-[7px] font-bold uppercase tracking-wider text-white/20">
          Score Rate
        </p>
      </div>

      {/* Exams */}
      <div className="hidden text-right sm:block">
        <div className="inline-flex items-center gap-1.5 rounded-lg bg-white/[0.035] px-2.5 py-1.5">
          <FileCheck2 size={10} className="text-white/30" />

          <span className="text-[9px] font-bold text-white/50">
            {item.totalExams}
          </span>
        </div>

        <p className="mt-1 text-[7px] uppercase tracking-wider text-white/15">
          Exams
        </p>
      </div>

      {/* Mobile Percentage */}
      <div className="absolute bottom-2 left-[62px] sm:hidden">
        <span className="text-[8px] font-bold text-emerald-300/70">
          {item.overallPercentage.toFixed(2)}%
        </span>

        <span className="ml-1 text-[7px] text-white/20">
          • {item.totalExams} exams
        </span>
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
    <section className="min-h-[650px] bg-[#020617] px-4 py-16 text-white">
      <div className="mx-auto max-w-5xl animate-pulse">
        <div className="mx-auto mb-5 h-7 w-44 rounded-full bg-white/5" />

        <div className="mx-auto mb-4 h-12 w-72 rounded-xl bg-white/5" />

        <div className="mx-auto mb-8 h-10 w-96 max-w-full rounded bg-white/5" />

        <div className="grid gap-5 md:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-[390px] rounded-[30px] border border-white/5 bg-white/[0.02]"
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
