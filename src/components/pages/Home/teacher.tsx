'use client'

import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

const teachers = [
  {
    name: 'Fahim Rahman',
    subject: 'Physics',
    experience: '10+ Years',
    students: '12K+ Students',
    image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
  },
  {
    name: 'Nusrat Jahan',
    subject: 'Biology',
    experience: '8+ Years',
    students: '9K+ Students',
    image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
  },
  {
    name: 'Tanvir Hasan',
    subject: 'Mathematics',
    experience: '12+ Years',
    students: '15K+ Students',
    image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg',
  },
  {
    name: 'Sadia Islam',
    subject: 'Chemistry',
    experience: '7+ Years',
    students: '8K+ Students',
    image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
  },
]

const Teachers = () => {
  return (
    <section className="relative py-24 bg-[#0b1326] text-white overflow-hidden">

      {/* Glow Background (same style as Stats) */}
      <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-[#adc6ff]/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-[#6ffbbe]/20 blur-[120px] rounded-full" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight">
            Meet Our Expert Teachers
          </h2>
          <p className="text-white/70 mt-4 text-lg">
            Learn from Bangladesh’s top educators with years of real classroom experience.
          </p>
        </div>

        {/* Teachers Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {teachers.map((teacher, index) => (
            <div
              key={index}
              className="group relative rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl hover:scale-105 transition-all duration-300"
            >
              {/* Image */}
              <div className="relative h-72 w-full overflow-hidden">
                <Image
                  src={teacher.image}
                  alt={teacher.name}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            fill
                    
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              </div>

              {/* Content */}
              <div className="absolute bottom-0 p-5 w-full">
                <h3 className="text-xl font-bold">{teacher.name}</h3>
                <p className="text-[#6ffbbe] text-sm font-medium">
                  {teacher.subject}
                </p>

                <div className="text-xs text-white/70 mt-2">
                  {teacher.experience} • {teacher.students}
                </div>

                {/* Hover Button */}
                <Button
                  size="sm"
                  className="mt-4 w-full bg-[#adc6ff] text-black font-semibold opacity-0 group-hover:opacity-100 transition"
                >
                  View Profile
                </Button>
              </div>
            </div>
          ))}

        </div>

      </div>
    </section>
  )
}

export default Teachers