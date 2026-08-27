'use client'

import React from 'react'

const galleryItems = [
  {
    image: 'https://images.pexels.com/photos/3184405/pexels-photo-3184405.jpeg',
    title: 'Science Tour 2025',
  },
  {
    image: 'https://images.pexels.com/photos/4145193/pexels-photo-4145193.jpeg',
    title: 'Cultural Fest 2025',
  },
  {
    image: 'https://images.pexels.com/photos/374019/pexels-photo-374019.jpeg',
    title: 'Math Model Test Ceremony',
  },
  {
    image: 'https://images.pexels.com/photos/207691/pexels-photo-207691.jpeg',
    title: 'Sports Day 2025',
  },
  {
    image: 'https://images.pexels.com/photos/3184299/pexels-photo-3184299.jpeg',
    title: 'Art Workshop',
  },
  {
    image: 'https://images.pexels.com/photos/414171/pexels-photo-414171.jpeg',
    title: 'Field Trip to Museum',
  },
]

const StudentGallery = () => {
  return (
    <section className="relative py-24 bg-[#0b1326] text-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black">Student Gallery</h2>
          <p className="text-white/70 mt-3">Tours, cultural programs & events captured by our students</p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {galleryItems.map((item, idx) => (
            <div
              key={idx}
              className="relative overflow-hidden rounded-2xl group cursor-pointer shadow-lg hover:scale-105 transition-transform"
            >
              {/* Image */}
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-64 object-cover rounded-2xl"
              />

              {/* Title Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-4 text-center">
                <h3 className="text-white font-semibold text-lg">{item.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default StudentGallery