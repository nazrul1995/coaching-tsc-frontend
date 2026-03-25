'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosSecure from '@/lib/axiosSecure';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface StudentResult {
  id: string;
  name: string;
  score: number;
  avatar?: string;
  testType: 'weekly' | 'model';
}

const StudentResultPage = () => {
  const [testType, setTestType] = useState<'weekly' | 'model'>('weekly');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['student-results', testType],
    queryFn: async () => {
      const res = await axiosSecure.get(`/results?type=${testType}`);
      return res.data as StudentResult[];
    },
  });

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-[#0b1326] text-xl">
        Loading results...
      </div>
    );

  if (isError || !data)
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-[#0b1326] text-xl">
        No results found.
      </div>
    );

  // Sort descending by score
  const sortedResults = [...data].sort((a, b) => b.score - a.score);
  const top5 = sortedResults.slice(0, 5);
  const others = sortedResults.slice(5);

  const colors = ['#ffd700', '#c0c0c0', '#cd7f32', '#6ffbbe', '#adc6ff'];

  return (
    <div className="min-h-screen bg-[#0b1326] text-white py-16 px-6">
      {/* Header */}
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-2">🏆 Student Results</h1>
        <p className="text-white/70 text-lg">See top performers and overall rankings for weekly and model tests.</p>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mt-6 flex-wrap">
          <Button
            variant={testType === 'weekly' ? 'brandPrimary' : 'brandSecondary'}
            onClick={() => setTestType('weekly')}
          >
            Weekly Test
          </Button>
          <Button
            variant={testType === 'model' ? 'brandPrimary' : 'brandSecondary'}
            onClick={() => setTestType('model')}
          >
            Model Test
          </Button>
        </div>
      </div>

      {/* Top 5 Leaderboard */}
      <div className="flex justify-center items-end gap-6 flex-wrap mb-16">
        {top5.map((student, idx) => {
          const height = 180 - idx * 20; // triangle effect
          return (
            <div key={student.id} className="flex flex-col items-center group">
              <div
                className="relative w-20 md:w-28 rounded-t-xl overflow-hidden transition-transform duration-300 group-hover:scale-105"
                style={{
                  height: `${height}px`,
                  background: colors[idx],
                }}
              >
                {student.avatar ? (
                  <Image
                    src={student.avatar}
                    alt={student.name}
                    fill
                    className="object-cover"
                  />
                ) : null}
                <div className="absolute bottom-2 w-full text-center text-black font-bold text-lg">
                  {student.score}
                </div>
              </div>
              <span className="mt-2 text-white font-semibold text-sm md:text-base">{student.name}</span>
            </div>
          );
        })}
      </div>

      {/* Remaining Students */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {others.map((student) => (
          <div
            key={student.id}
            className="p-5 rounded-2xl bg-gradient-to-b from-white/5 to-white/10 border border-white/10 hover:shadow-2xl hover:border-[#6ffbbe]/40 transition-all duration-300"
          >
            <div className="flex items-center gap-4 mb-3">
              {student.avatar ? (
                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                  <Image src={student.avatar} alt={student.name} fill className="object-cover" />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-black font-bold">
                  {student.name[0]}
                </div>
              )}
              <h3 className="font-bold text-lg line-clamp-1">{student.name}</h3>
            </div>
            <p className="text-white/70 text-sm">Score: {student.score}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="flex justify-center mt-12">
        <Button variant="brandPrimary">View Detailed Reports</Button>
      </div>
    </div>
  );
};

export default StudentResultPage;