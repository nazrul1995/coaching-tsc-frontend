'use client'

import React from 'react'
import Image from 'next/image'

const testimonials = [
  {
    name: 'Arafat Hossain',
    image: 'https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg',
    course: 'Physics - Class 11',
    message: 'Lens coaching helped me ace my weekly tests and improve my confidence!',
  },
  {
    name: 'Nusrat Jahan',
    image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
    course: 'Biology - Class 12',
    message: 'Amazing teachers and structured lessons. My results improved drastically!',
  },
  {
    name: 'Tanvir Hasan',
    image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg',
    course: 'Mathematics - Class 10',
    message: 'The weekly tests and feedback system is top-notch!',
  },
]

const Testimonials = () => {
  return (
    <section className="relative py-24 bg-[#0b1326] text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black">What Our Students Say</h2>
          <p className="text-white/70 mt-3">Real experiences from our top achievers</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl hover:scale-[1.02] transition-all cursor-pointer"
            >
              <div className="flex items-center gap-4 mb-4">
                <Image
                  src={t.image}
                  alt={t.name}
                  width={60}
                  height={60}
                  className="rounded-full object-cover border-2 border-[#6ffbbe]"
                />
                <div>
                  <p className="font-semibold">{t.name}</p>
                  <p className="text-white/70 text-sm">{t.course}</p>
                </div>
              </div>
              <p className="text-white/80 italic">&quot;{t.message}&quot;</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials