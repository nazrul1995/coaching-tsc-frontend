"use client";

import React from "react";
import Image from "next/image";
import axiosSecure from "@/lib/axiosSecure";
import { useQuery as useTanstackQuery } from "@tanstack/react-query";
import {
  Trophy,
  Crown,
  Medal,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Award,
} from "lucide-react";
import { useRouter } from "next/navigation";

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
  averagePercentage: number;
  totalExams: number;
}

const FALLBACK_IMAGE =
  "https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg";

const Leaderboard = () => {
  const router = useRouter();

  const { data: leaderboard = [], isLoading } = useTanstackQuery<LeaderboardItem[]>({
    queryKey: ["overall-leaderboard"],
    queryFn: async () => {
      const res = await axiosSecure.get("/exams/leaderboard/overall");
      return res.data?.data || [];
    },
  });

  if (isLoading) {
    return (
      <section className="min-h-[500px] bg-[#030712] py-16 text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="relative h-12 w-12">
            <div className="absolute inset-0 rounded-full border-2 border-[#6ffbbe]/20 border-t-[#6ffbbe] animate-spin" />
            <Trophy className="absolute inset-0 m-auto text-[#6ffbbe]" size={20} />
          </div>
          <p className="text-xs font-medium tracking-widest text-white/50 uppercase animate-pulse">
            Loading Leaderboard...
          </p>
        </div>
      </section>
    );
  }

  if (!leaderboard.length) {
    return (
      <section className="bg-[#030712] py-16 px-4 text-white">
        <div className="mx-auto max-w-sm text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl">
            <Trophy className="text-[#6ffbbe]" size={28} />
          </div>
          <h2 className="text-2xl font-bold">Results Coming Soon</h2>
          <p className="mt-2 text-xs text-white/50">
            Published results and top rankers will appear here once exams are evaluated.
          </p>
        </div>
      </section>
    );
  }

  // Top 3 Students
  const top1 = leaderboard.find((item) => item.rank === 1);
  const top2 = leaderboard.find((item) => item.rank === 2);
  const top3 = leaderboard.find((item) => item.rank === 3);

  // Desktop ordering: 2nd, 1st, 3rd. Mobile ordering: 1st, 2nd, 3rd
  const topThreeMobile = [top1, top2, top3].filter(Boolean) as LeaderboardItem[];
  const remaining = leaderboard.filter((item) => item.rank > 3).slice(0, 7);

  return (
    <section className="relative overflow-hidden bg-[#030712] py-12 px-4 sm:px-6 md:py-20 text-white">
      {/* Background Neon Blurs */}
      <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 h-72 w-72 sm:h-96 sm:w-96 rounded-full bg-[#6ffbbe]/10 blur-[100px]" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 rounded-full bg-blue-600/10 blur-[100px]" />

      <div className="relative z-10 mx-auto max-w-5xl">
        {/* ================= HEADER ================= */}
        <div className="mb-8 sm:mb-14 text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#6ffbbe]/30 bg-[#6ffbbe]/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#6ffbbe] backdrop-blur-md mb-3">
            <Sparkles size={12} className="animate-pulse" />
            <span>Leaderboard</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Top{" "}
            <span className="bg-gradient-to-r from-[#6ffbbe] via-[#a5f3fc] to-[#60a5fa] bg-clip-text text-transparent">
              Performers
            </span>
          </h2>

          <p className="mt-2 text-xs sm:text-sm text-white/50 max-w-xs sm:max-w-md mx-auto">
            Honoring students leading the academic charts with outstanding performance.
          </p>
        </div>

        {/* ================= TOP 3 (MOBILE & DESKTOP RESPONSIVE) ================= */}
        <div className="mb-8 space-y-3 md:space-y-0 md:grid md:grid-cols-3 md:gap-5 md:items-end">
          {topThreeMobile.map((item) => (
            <TopCard key={item.student._id} item={item} />
          ))}
        </div>

        {/* ================= RANKINGS LIST (4-10) ================= */}
        {remaining.length > 0 && (
          <div className="mt-6 space-y-2">
            <div className="px-2 pb-1 text-[11px] font-semibold tracking-wider text-white/40 uppercase flex justify-between">
              <span>Rank & Student</span>
              <span>Performance</span>
            </div>

            <div className="divide-y divide-white/[0.05] rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl overflow-hidden">
              {remaining.map((item) => (
                <div
                  key={item.student._id}
                  className="flex items-center justify-between p-3 sm:p-4 hover:bg-white/[0.04] transition active:scale-[0.99]"
                >
                  {/* Student Info */}
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="flex h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0 items-center justify-center rounded-lg bg-white/5 text-xs font-extrabold text-white/60">
                      #{item.rank}
                    </span>

                    <div className="relative h-10 w-10 sm:h-11 sm:w-11 flex-shrink-0 overflow-hidden rounded-xl border border-white/10">
                      <Image
                        src={item.student.photo || FALLBACK_IMAGE}
                        alt={item.student.name}
                        fill
                        sizes="44px"
                        className="object-cover"
                      />
                    </div>

                    <div className="min-w-0">
                      <h4 className="truncate text-xs sm:text-sm font-bold text-white">
                        {item.student.name}
                      </h4>
                      <p className="text-[11px] text-white/40 truncate">
                        Class {item.student.className}
                        {item.student.group && ` • ${item.student.group}`}
                      </p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="text-right flex-shrink-0 pl-2">
                    <div className="text-sm sm:text-base font-extrabold text-[#6ffbbe]">
                      {item.averagePercentage}%
                    </div>
                    <div className="text-[10px] text-white/40">
                      {item.totalExams} {item.totalExams === 1 ? "Exam" : "Exams"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= FOOTER BUTTON ================= */}
        <div className="mt-8 flex flex-col items-center gap-4">
          <button
            onClick={() => router.push("/result")}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-[#6ffbbe]/30 bg-[#6ffbbe]/10 px-6 py-3.5 text-xs font-bold text-[#6ffbbe] transition active:scale-95 hover:bg-[#6ffbbe]/20"
          >
            <span>View All Exam Results</span>
            <ArrowRight size={16} />
          </button>

          <p className="flex items-center gap-1.5 text-[11px] text-white/40">
            <TrendingUp size={13} /> Scores updated based on official published results
          </p>
        </div>
      </div>
    </section>
  );
};

export default Leaderboard;

// ======================================================
// TOP CARD COMPONENT (Optimized for Mobile Touch)
// ======================================================

function TopCard({ item }: { item: LeaderboardItem }) {
  const isFirst = item.rank === 1;
  const isSecond = item.rank === 2;

  const cardStyle = isFirst
    ? {
        border: "border-amber-400/40",
        bg: "bg-gradient-to-r md:bg-gradient-to-b from-amber-500/15 via-amber-500/5 to-transparent",
        glow: "bg-amber-400/10",
        badgeBg: "bg-amber-400 text-slate-950",
        textColor: "text-amber-400",
        barColor: "bg-amber-400",
        icon: <Crown size={16} className="text-slate-950 fill-slate-950" />,
        order: "md:order-2 md:-translate-y-2", // Desktop styling
      }
    : isSecond
    ? {
        border: "border-slate-300/30",
        bg: "bg-gradient-to-r md:bg-gradient-to-b from-slate-300/10 via-slate-300/5 to-transparent",
        glow: "bg-slate-300/10",
        badgeBg: "bg-slate-200 text-slate-950",
        textColor: "text-slate-200",
        barColor: "bg-slate-300",
        icon: <Medal size={16} />,
        order: "md:order-1",
      }
    : {
        border: "border-amber-700/40",
        bg: "bg-gradient-to-r md:bg-gradient-to-b from-amber-700/10 via-amber-700/5 to-transparent",
        glow: "bg-amber-700/10",
        badgeBg: "bg-amber-600 text-white",
        textColor: "text-amber-500",
        barColor: "bg-amber-600",
        icon: <Award size={16} />,
        order: "md:order-3",
      };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border ${cardStyle.border} ${cardStyle.bg} ${cardStyle.order} p-4 backdrop-blur-xl transition active:scale-[0.98]`}
    >
      {/* Background Accent Glow */}
      <div className={`absolute -right-8 -top-8 h-24 w-24 rounded-full ${cardStyle.glow} blur-2xl`} />

      <div className="flex md:flex-col items-center justify-between gap-3">
        {/* Left Side (Mobile) / Top Side (Desktop): Avatar & Rank Badge */}
        <div className="flex md:flex-col items-center gap-3 w-full min-w-0">
          <div className="relative flex-shrink-0">
            <div className="relative h-14 w-14 sm:h-16 sm:w-16 overflow-hidden rounded-xl border border-white/10 shadow-md">
              <Image
                src={item.student.photo || FALLBACK_IMAGE}
                alt={item.student.name}
                fill
                sizes="64px"
                className="object-cover"
              />
            </div>

            {/* Floating Rank Icon Badge */}
            <div
              className={`absolute -bottom-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-lg shadow-md font-extrabold text-xs ${cardStyle.badgeBg}`}
            >
              {cardStyle.icon}
            </div>
          </div>

          {/* Student Info */}
          <div className="min-w-0 flex-1 md:text-center">
            <div className="inline-block md:hidden mb-0.5 text-[10px] font-bold uppercase tracking-wider text-white/40">
              Rank #{item.rank}
            </div>
            <h3 className="truncate text-sm sm:text-base font-extrabold text-white">
              {item.student.name}
            </h3>
            <p className="text-[11px] text-white/50 truncate">
              Class {item.student.className} {item.student.batch && `• ${item.student.batch}`}
            </p>
          </div>
        </div>

        {/* Right Side (Mobile) / Bottom Side (Desktop): Score Stats */}
        <div className="flex-shrink-0 md:w-full md:mt-3 md:pt-3 md:border-t md:border-white/10 text-right md:text-left">
          <div className="flex md:items-end justify-between gap-4">
            <div>
              <p className="hidden md:block text-[10px] uppercase tracking-wider text-white/40">
                Average Score
              </p>
              <p className={`text-base sm:text-xl font-extrabold ${cardStyle.textColor}`}>
                {item.averagePercentage}%
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs sm:text-sm font-bold text-white">{item.totalExams}</p>
              <p className="text-[9px] uppercase tracking-wider text-white/40">Exams</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className={`h-full rounded-full ${cardStyle.barColor}`}
              style={{ width: `${Math.min(item.averagePercentage, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}