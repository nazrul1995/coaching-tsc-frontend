'use client'

import React from 'react'
import { BookOpen, Video, ClipboardList, Users } from 'lucide-react'

const features = [
  {
    icon: <Video size={28} />,
    title: 'Live Interactive Classes',
    desc: 'Attend live classes with real-time doubt solving and direct teacher interaction.',
  },
  {
    icon: <ClipboardList size={28} />,
    title: 'Weekly Exams & Reports',
    desc: 'Track your progress with structured exams and detailed performance analytics.',
  },
  {
    icon: <BookOpen size={28} />,
    title: 'Structured Curriculum',
    desc: 'Designed according to Bangladesh National Curriculum for Classes 6–12.',
  },
  {
    icon: <Users size={28} />,
    title: 'Top Expert Teachers',
    desc: 'Learn from highly experienced teachers with proven student success records.',
  },
]

const WhyChooseUs = () => {
  return (
    <section className="relative py-24 bg-[#0b1326] text-white overflow-hidden">

      {/* 🌌 Glow Background (same as other sections) */}
      <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-[#adc6ff]/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-[#6ffbbe]/20 blur-[120px] rounded-full" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* 🔥 Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight">
            Why Choose Us
          </h2>
          <p className="text-white/70 mt-4 text-lg max-w-2xl mx-auto">
            We provide a complete learning ecosystem to help students succeed in exams and beyond.
          </p>
        </div>

        {/* 🎯 Feature Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

          {features.map((item, index) => (
            <div
              key={index}
              className="group relative p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl hover:scale-105 transition-all duration-300"
            >
              {/* ✨ Hover Glow */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#adc6ff]/10 to-[#6ffbbe]/10 opacity-0 group-hover:opacity-100 transition" />

              {/* 🔵 Icon */}
              <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-[#adc6ff]/10 text-[#adc6ff] mb-6">
                {item.icon}
              </div>

              {/* 📌 Title */}
              <h3 className="text-xl font-bold mb-3">
                {item.title}
              </h3>

              {/* 📝 Description */}
              <p className="text-white/70 text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}

        </div>

      </div>
    </section>
  )
}

export default WhyChooseUs