'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

const teachers = [
  {
    id: 1,
    name: 'Md. Rahim Uddin',
    subject: 'Mathematics',
    experience: '10+ Years Experience',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    id: 2,
    name: 'Sadia Akter',
    subject: 'Physics',
    experience: '8+ Years Experience',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    id: 3,
    name: 'Tanvir Hasan',
    subject: 'English',
    experience: '6+ Years Experience',
    image: 'https://randomuser.me/api/portraits/men/65.jpg',
  },
  {
    id: 4,
    name: 'Nusrat Jahan',
    subject: 'Biology',
    experience: '7+ Years Experience',
    image: 'https://randomuser.me/api/portraits/women/68.jpg',
  },
];

const TeachersPage = () => {
  return (
    <div className="min-h-screen bg-[#0b1326] text-white">

      {/* 🌟 HERO */}
      <div className="relative py-20 px-6 text-center overflow-hidden">
        {/* Glow */}
        <div className="absolute top-[-20%] left-[-10%] w-[400px] h-[400px] bg-[#adc6ff]/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] bg-[#6ffbbe]/20 blur-[120px] rounded-full" />

        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-black">
            Meet Our Expert Teachers 👨‍🏫
          </h1>
          <p className="mt-4 text-white/70 text-lg">
            Learn from experienced educators who guide you to success.
          </p>

          <div className="flex justify-center gap-4 mt-6 flex-wrap">
            <Button variant="brandPrimary">Enroll Now</Button>
            <Button variant="brandSecondary">View Courses</Button>
          </div>
        </div>
      </div>

      {/* 👨‍🏫 TEACHER GRID */}
      <div className="max-w-7xl mx-auto px-6 pb-20 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

        {teachers.map((teacher) => (
          <div
            key={teacher.id}
            className="group relative p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl hover:border-[#adc6ff]/40 transition-all duration-300 hover:shadow-2xl"
          >
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#adc6ff]/10 to-[#6ffbbe]/10 opacity-0 group-hover:opacity-100 transition" />

            {/* Image */}
            <div className="relative w-full h-52 mb-4 rounded-xl overflow-hidden">
              <Image
                src={teacher.image}
                alt={teacher.name}
                width={500}
                height={500}
                sizes='500px'
                className="object-cover group-hover:scale-105 transition duration-300"
              />
            </div>

            {/* Info */}
            <h3 className="text-lg font-bold group-hover:text-[#adc6ff] transition">
              {teacher.name}
            </h3>

            <p className="text-sm text-[#6ffbbe] mt-1">
              {teacher.subject}
            </p>

            <p className="text-xs text-white/60 mt-2">
              {teacher.experience}
            </p>

            {/* Button */}
            <Button
              variant="brandPrimary"
              className="w-full mt-4 text-sm py-2 rounded-xl"
            >
              View Profile
            </Button>
          </div>
        ))}
      </div>

      {/* 🚀 CTA */}
      <div className="max-w-6xl mx-auto px-6 pb-20">
        <div className="p-8 rounded-3xl bg-gradient-to-r from-[#adc6ff]/10 to-[#6ffbbe]/10 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold">
              Start Learning with the Best Teachers
            </h2>
            <p className="text-white/70 text-sm mt-2">
              Join thousands of students and improve your results today.
            </p>
          </div>

          <Button variant="brandSecondary">
            Join Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TeachersPage;