'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

const events = [
  {
    id: 1,
    title: 'Science Workshop 2026',
    date: 'April 15, 2026',
    description: 'Interactive workshop on Physics experiments and practicals for students.',
    image: 'https://images.unsplash.com/photo-1605902711622-cfb43c443f54?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 2,
    title: 'Cultural Tour – Dhaka',
    date: 'May 10, 2026',
    description: 'A one-day cultural tour exploring Dhaka’s historical sites and museums.',
    image: 'https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 3,
    title: 'Art & Craft Festival',
    date: 'June 5, 2026',
    description: 'Students showcase creativity in painting, sketching, and craft competitions.',
    image: 'https://images.unsplash.com/photo-1588702547923-7093a6c3ba33?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 4,
    title: 'Math Olympiad 2026',
    date: 'July 20, 2026',
    description: 'Competitive event for problem-solving, logic, and reasoning skills.',
    image: 'https://images.unsplash.com/photo-1581091012184-85f0f53b5c5c?auto=format&fit=crop&w=800&q=80',
  },
];

const EventsPage = () => {
  return (
    <div className="min-h-screen bg-[#0b1326] text-white py-16 px-6">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto mb-16 relative">
        <h1 className="text-4xl md:text-6xl font-black">
          🎉 Upcoming Events & Programs
        </h1>
        <p className="text-white/70 mt-4 text-lg">
          Join our exciting workshops, tours, and cultural programs to enhance learning beyond the classroom.
        </p>
        <div className="flex justify-center gap-4 mt-6 flex-wrap">
          <Button variant="brandPrimary">Register Now</Button>
          <Button variant="brandSecondary">View Calendar</Button>
        </div>
        {/* Glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[300px] h-[300px] bg-[#adc6ff]/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[300px] h-[300px] bg-[#6ffbbe]/20 blur-[120px] rounded-full" />
      </div>

      {/* Events Grid */}
      <div className="max-w-7xl mx-auto grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.map((event) => (
          <div
            key={event.id}
            className="group relative p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl hover:border-[#adc6ff]/40 hover:shadow-2xl transition-all duration-300"
          >
            <div className="relative w-full h-56 mb-4 rounded-xl overflow-hidden">
              <Image
                src={event.image}
                alt={event.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                loading="eager"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            <h3 className="text-xl font-bold group-hover:text-[#adc6ff] transition">
              {event.title}
            </h3>
            <p className="text-sm text-white/60 mt-1">{event.date}</p>
            <p className="text-white/70 mt-2 text-sm line-clamp-3">
              {event.description}
            </p>

            <Button
              variant="brandPrimary"
              className="w-full mt-4 py-2 text-sm rounded-xl"
            >
              View Details
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventsPage;