'use client';

import React, { useMemo } from 'react';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import axiosSecure from '@/lib/axiosSecure';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const Leaderboard = () => {
  // ================= FETCH RESULTS =================
  const { data: results = [] } = useQuery({
    queryKey: ['leaderboard-results'],
    queryFn: async () => {
      const res = await axiosSecure.get('/results');
      return res.data?.data || [];
    },
  });

  console.log(results)

  // ================= CALCULATE RANKING =================
  const rankedStudents = useMemo(() => {
    if (!results.length) return [];

    const map = new Map();

    results.forEach((r: any) => {
      if (!r.studentId) return;

      const existing = map.get(r.studentId);

      if (!existing) {
        map.set(r.studentId, {
          studentId: r.studentId,
          name: r.studentName,
          image:
            r.studentPhoto ||
            'https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg',
          total: r.percentage,
          count: 1,
          exam: r.examName,
          subject: r.subject,
        });
      } else {
        existing.total += r.percentage;
        existing.count += 1;
      }
    });

    return Array.from(map.values())
      .map((s) => ({
        ...s,
        avgMarks: Math.round(s.total / s.count),
      }))
      .sort((a, b) => b.avgMarks - a.avgMarks)
      .slice(0, 10)
      .map((s, index) => ({
        ...s,
        position: index + 1,
      }));
  }, [results]);

  // ================= SPLIT DATA =================
  const top3 = rankedStudents.slice(0, 3);
  const miniLeaderboard = rankedStudents.slice(3, 10);

  return (
    <section className="relative py-24 bg-[#0b1326] text-white overflow-hidden">

      {/* Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-[#adc6ff]/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-[#6ffbbe]/20 blur-[120px] rounded-full" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black">
            🏆 Weekly Top Performers
          </h2>
          <p className="text-white/70 mt-3">
            Based on real exam performance
          </p>
        </div>

        {/* ================= PODIUM ================= */}
        {top3.length >= 3 && (
          <div className="flex justify-center items-end gap-6 md:gap-12 mb-12">

            {/* 2nd */}
            <PodiumCard student={top3[1]} rank="2nd" color="gray" size="sm" />

            {/* 1st */}
            <PodiumCard student={top3[0]} rank="1st" color="yellow" size="lg" />

            {/* 3rd */}
            <PodiumCard student={top3[2]} rank="3rd" color="orange" size="sm" />
          </div>
        )}

        {/* ================= LIST ================= */}
        <TooltipProvider>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {miniLeaderboard.map((student: any) => (
              <Tooltip key={student.studentId}>
                <TooltipTrigger>
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:scale-[1.02] transition cursor-pointer">
                    <span className="font-bold text-lg">
                      #{student.position}
                    </span>

                    <div className="flex flex-col ml-4">
                      <span className="font-semibold">
                        {student.name}
                      </span>
                      <span className="text-sm text-white/70">
                        {student.avgMarks}%
                      </span>
                    </div>
                  </div>
                </TooltipTrigger>

                <TooltipContent>
                  {student.exam} • {student.subject}
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>
      </div>
    </section>
  );
};

export default Leaderboard;

/* ================= PODIUM COMPONENT ================= */
function PodiumCard({
  student,
  rank,
  color,
  size,
}: any) {
  if (!student) return null;

  const colors: any = {
    gray: 'border-[#adc6ff] bg-gray-300',
    yellow: 'border-yellow-400 bg-yellow-400',
    orange: 'border-orange-400 bg-orange-400',
  };

  const heights: any = {
    sm: 'w-32 h-40 md:w-40 md:h-56',
    lg: 'w-36 h-48 md:w-48 md:h-64',
  };

  return (
    <div className="flex flex-col items-center">
      <div className={`relative ${heights[size]}`}>
        <Image
          src={student.image}
          alt={student.name}
          width={300}
          height={500}
          
          className={`object-cover rounded-xl border-4 shadow-lg ${colors[color].split(' ')[0]}`}
        />

        <div
          className={`absolute bottom-0 left-1/2 -translate-x-1/2 px-3 py-1 font-bold rounded-t-md ${colors[color].split(' ')[1]} text-black`}
        >
          {rank}
        </div>
      </div>

      <div className="mt-3 text-center">
        <p className="font-semibold">{student.name}</p>
        <p className="text-sm text-white/70">
          {student.avgMarks}%
        </p>
      </div>

      <div className={`mt-2 rounded-t-lg ${colors[color]}`}>
        <div className="w-16 h-6 md:h-8"></div>
      </div>
    </div>
  );
}