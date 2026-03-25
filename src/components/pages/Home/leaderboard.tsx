'use client'

import React from 'react'
import Image from 'next/image'
import { Tooltip } from '@/components/ui/tooltip'

const topStudents = [
  {
    name: 'Arafat Hossain',
    marks: 95,
    exam: 'Weekly Physics Test',
    subject: 'Physics',
    position: 1,
    image: 'https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg',
  },
  {
    name: 'Nusrat Jahan',
    marks: 92,
    exam: 'Weekly Biology Test',
    subject: 'Biology',
    position: 2,
    image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
  },
  {
    name: 'Tanvir Hasan',
    marks: 90,
    exam: 'Model Test - Math',
    subject: 'Math',
    position: 3,
    image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg',
  },
]

const miniLeaderboard = [
  {
    name: 'Sadia Islam',
    marks: 88,
    exam: 'Weekly Chemistry Test',
    subject: 'Chemistry',
    position: 4,
  },
  {
    name: 'Rifat Karim',
    marks: 86,
    exam: 'Weekly Math Test',
    subject: 'Math',
    position: 5,
  },
  {
    name: 'Lamia Rahman',
    marks: 85,
    exam: 'Model Test Biology',
    subject: 'Biology',
    position: 6,
  },
  {
    name: 'Shanto Akash',
    marks: 83,
    exam: 'Weekly English Test',
    subject: 'English',
    position: 7,
  },
  {
    name: 'Tania Chowdhury',
    marks: 82,
    exam: 'Weekly Physics Test',
    subject: 'Physics',
    position: 8,
  },
  {
    name: 'Fahim Hossain',
    marks: 80,
    exam: 'Model Test Math',
    subject: 'Math',
    position: 9,
  },
  {
    name: 'Rina Akter',
    marks: 79,
    exam: 'Weekly Chemistry Test',
    subject: 'Chemistry',
    position: 10,
  },
]

const Leaderboard = () => {
  return (
    <section className="relative py-24 bg-[#0b1326] text-white overflow-hidden">

      {/* Glow Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-[#adc6ff]/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-[#6ffbbe]/20 blur-[120px] rounded-full" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black">
            🏆 Weekly Top Performers
          </h2>
          <p className="text-white/70 mt-3">
            Celebrate our top students from weekly and model tests.
          </p>
        </div>

        {/* Podium */}
        <div className="flex justify-center items-end gap-6 md:gap-12 mb-12">

          {/* 2nd Place */}
          <div className="flex flex-col items-center">
            <div className="relative w-32 h-40 md:w-40 md:h-56">
              <Image
                src={topStudents[1].image}
                alt={topStudents[1].name}
                fill
                className="object-cover rounded-xl border-4 border-[#adc6ff] shadow-lg"
              />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-300 text-black font-bold rounded-t-md">
                2nd
              </div>
            </div>
            <div className="mt-3 text-center">
              <p className="font-semibold">{topStudents[1].name}</p>
              <p className="text-sm text-white/70">{topStudents[1].marks}%</p>
            </div>
            <div className="w-16 h-6 bg-gray-300 mt-2 rounded-t-lg"></div>
          </div>

          {/* 1st Place */}
          <div className="flex flex-col items-center">
            <div className="relative w-36 h-48 md:w-48 md:h-64">
              <Image
                src={topStudents[0].image}
                alt={topStudents[0].name}
                fill
                className="object-cover rounded-xl border-4 border-yellow-400 shadow-2xl"
              />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 px-3 py-1 bg-yellow-400 text-black font-bold rounded-t-md">
                1st
              </div>
            </div>
            <div className="mt-3 text-center">
              <p className="font-semibold">{topStudents[0].name}</p>
              <p className="text-sm text-white/70">{topStudents[0].marks}%</p>
            </div>
            <div className="w-20 h-8 bg-yellow-400 mt-2 rounded-t-lg"></div>
          </div>

          {/* 3rd Place */}
          <div className="flex flex-col items-center">
            <div className="relative w-28 h-36 md:w-36 md:h-52">
              <Image
                src={topStudents[2].image}
                alt={topStudents[2].name}
                fill
                className="object-cover rounded-xl border-4 border-orange-400 shadow-lg"
              />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 px-2 py-1 bg-orange-400 text-black font-bold rounded-t-md">
                3rd
              </div>
            </div>
            <div className="mt-3 text-center">
              <p className="font-semibold">{topStudents[2].name}</p>
              <p className="text-sm text-white/70">{topStudents[2].marks}%</p>
            </div>
            <div className="w-14 h-4 bg-orange-400 mt-2 rounded-t-lg"></div>
          </div>

        </div>

        {/* Mini Leaderboard (4th–10th) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {miniLeaderboard.map((student) => (
            <Tooltip key={student.position} content={`${student.exam} • ${student.subject}`}>
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:scale-[1.02] transition cursor-pointer">
                <span className="font-bold text-lg">#{student.position}</span>
                <div className="flex flex-col ml-4">
                  <span className="font-semibold">{student.name}</span>
                  <span className="text-sm text-white/70">{student.marks}%</span>
                </div>
              </div>
            </Tooltip>
          ))}
        </div>

      </div>
    </section>
  )
}

export default Leaderboard