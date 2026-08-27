'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

const notices = [
  {
    id: 1,
    title: 'New Admission Open for 2026',
    date: 'March 10, 2026',
    description: 'Admissions for classes 6-12 are now open. Apply before April 10.',
  },
  {
    id: 2,
    title: 'Parent-Teacher Meeting',
    date: 'April 5, 2026',
    description: 'All parents are invited for the semester’s parent-teacher meeting.',
  },
  {
    id: 3,
    title: 'Cultural Festival',
    date: 'April 20, 2026',
    description: 'Annual cultural festival with music, dance, and art competitions.',
  },
];

const NoticeBoardPage = () => {
  return (
    <div className="min-h-screen bg-[#0b1326] text-white py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-black text-center mb-12">
          📝 Notice Board
        </h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {notices.map((notice) => (
            <div
              key={notice.id}
              className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl hover:border-[#6ffbbe]/40 hover:shadow-2xl transition-all duration-300"
            >
              <h3 className="text-xl font-bold mb-2">{notice.title}</h3>
              <p className="text-sm text-white/60">{notice.date}</p>
              <p className="text-white/70 mt-2 line-clamp-4">{notice.description}</p>

              <Button
                variant="brandPrimary"
                className="w-full mt-4 py-2 text-sm rounded-xl"
              >
                Read More
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NoticeBoardPage;