'use client';

import React from 'react';
import { Button } from '@/components/ui/button';

const exams = [
  {
    _id: '1',
    title: 'Weekly Math Test - Class 8',
    subject: 'Mathematics',
    duration: 30,
    totalQuestions: 20,
    level: 'Easy',
  },
  {
    _id: '2',
    title: 'Model Test - Science',
    subject: 'Science',
    duration: 45,
    totalQuestions: 30,
    level: 'Medium',
  },
  {
    _id: '3',
    title: 'SSC English Practice',
    subject: 'English',
    duration: 25,
    totalQuestions: 15,
    level: 'Easy',
  },
];

const FreeExamPage = () => {
  return (
    <div className="min-h-screen bg-[#0b1326] text-white">

      {/* 🌟 HERO */}
      <div className="relative py-20 px-6 text-center overflow-hidden">
        {/* Glow */}
        <div className="absolute top-[-20%] left-[-10%] w-[400px] h-[400px] bg-[#adc6ff]/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] bg-[#6ffbbe]/20 blur-[120px] rounded-full" />

        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight">
            Free Exam Practice 🚀
          </h1>
          <p className="mt-4 text-white/70 text-lg">
            Test your skills with real exam patterns. Improve speed, accuracy & confidence.
          </p>

          {/* CTA */}
          <Button variant="brandPrimary">
            Start Practicing
          </Button>
        </div>
      </div>

      {/* 🔍 FILTER BAR */}
      <div className="max-w-6xl mx-auto px-6 mb-10">
        <div className="flex flex-wrap gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-xl">
          <select className="bg-transparent border border-white/20 px-4 py-2 rounded-lg text-sm">
            <option>All Classes</option>
            <option>Class 6</option>
            <option>Class 7</option>
            <option>Class 8</option>
          </select>

          <select className="bg-transparent border border-white/20 px-4 py-2 rounded-lg text-sm">
            <option>All Subjects</option>
            <option>Math</option>
            <option>Science</option>
            <option>English</option>
          </select>
        </div>
      </div>

      {/* 📚 EXAM GRID */}
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-3 gap-6 pb-16">
        {exams.map((exam) => (
          <div
            key={exam._id}
            className="group relative p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl hover:border-[#adc6ff]/50 transition-all duration-300 hover:shadow-2xl"
          >
            {/* Glow Hover */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#adc6ff]/10 to-[#6ffbbe]/10 opacity-0 group-hover:opacity-100 transition" />

            {/* Level Badge */}
            <span className="absolute top-4 right-4 text-xs px-2 py-1 rounded-full bg-white/10 border border-white/20">
              {exam.level}
            </span>

            {/* Title */}
            <h3 className="text-lg font-bold mb-2 group-hover:text-[#adc6ff] transition">
              {exam.title}
            </h3>

            {/* Subject */}
            <p className="text-sm text-white/60 mb-4">
              📘 {exam.subject}
            </p>

            {/* Info */}
            <div className="flex justify-between text-xs text-white/60 mb-5">
              <span>⏱ {exam.duration} min</span>
              <span>❓ {exam.totalQuestions}</span>
            </div>

            {/* Start Button */}
            <Button variant="brandSecondary" className="w-full text-black">
              Start Exam →
            </Button>
          </div>
        ))}
      </div>

      {/* 🚀 CTA SECTION */}
      <div className="max-w-6xl mx-auto px-6 pb-20">
        <div className="p-8 rounded-3xl bg-gradient-to-r from-[#adc6ff]/10 to-[#6ffbbe]/10 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold">
              Ready to improve your results?
            </h2>
            <p className="text-white/70 text-sm mt-2">
              Practice daily and track your performance like toppers.
            </p>
          </div>

          <Button className="bg-[#adc6ff] text-black font-bold px-6 py-3 rounded-xl">
            View Leaderboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FreeExamPage;