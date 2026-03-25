import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

const HeroBanner = () => {
  return (
    <div
      className="relative pt-20 pb-20 px-6 overflow-hidden min-h-[870px] flex items-center bg-[#0b1326] text-white"
    >
      {/* Education Background Image (exactly as you requested) */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://d35xcwcl37xo08.cloudfront.net/current-affairs-wp-uploads/2025/04/coaching_centre.webp')`,
        }}
      />

      {/* Dark overlay + exact refraction orbs from the HTML demo */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0b1326]/85 via-[#0b1326]/70 to-[#0b1326]/60" />

      {/* Blue & Green refraction orbs (taken directly from the HTML) */}
      <div className="absolute top-[-10%] right-[-10%] w-[620px] h-[620px] bg-[#adc6ff]/15 blur-[130px] rounded-full" />
      <div className="absolute bottom-[-8%] left-[-8%] w-[420px] h-[420px] bg-[#6ffbbe]/15 blur-[110px] rounded-full" />

      <div className="max-w-7xl mx-auto w-full relative z-10 grid lg:grid-cols-2 gap-16 items-center">
        {/* Left Content – exact layout & typography from the HTML */}
        <div className="space-y-8">
          {/* Pulsing badge */}
          <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
            <span className="w-3 h-3 rounded-full bg-[#6ffbbe] animate-pulse" />
            <span className="text-[#6ffbbe] text-sm font-semibold uppercase tracking-[2px]">ADMISSION OPEN 2026</span>
          </div>

          {/* Headline with gradient text exactly like the demo */}
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.92]">
            Master Your<br />
            <span className="bg-gradient-to-r from-[#adc6ff] via-[#6ffbbe] to-[#ffb786] bg-clip-text text-transparent">
              Future
            </span><br />
            with Lens.
          </h1>

          {/* Description – adapted to your BD school coaching */}
          <p className="text-xl md:text-2xl text-white/80 max-w-xl leading-relaxed">
            Expert teachers • Bangladesh National Curriculum • Weekly exams, live classes &amp; 100% pass rate for Classes 6 to 12
          </p>

          {/* Buttons – exact styling from the HTML */}
          <div className="flex flex-wrap gap-4 pt-2">
            <Button 
              size="lg" 
              className="bg-[#adc6ff] hover:bg-[#adc6ff]/90 text-[#002e6a] text-xl font-bold px-12 py-7 rounded-2xl shadow-2xl transition-all hover:scale-105"
              // onClick={() => window.scrollTo({ top: 900, behavior: 'smooth' })}
            >
              Enroll Now
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-white/70 hover:bg-white/10 text-white text-xl font-bold px-12 py-7 rounded-2xl transition-all"
            >
              View Courses
            </Button>
          </div>
        </div>

        {/* Right Visual – exact "focus-loupe" card from the HTML demo */}
        <div className="relative hidden lg:block">
          <div
            className="aspect-square rounded-[2.5rem] overflow-hidden border border-[#adc6ff]/20 focus-loupe relative shadow-2xl"
          >
            {/* Your education image (download one of the 3 I showed earlier) */}
            <Image
              src="https://images.pexels.com/photos/32377099/pexels-photo-32377099.jpeg"
              alt="Students in class"
              width={800}
              height={800}
              priority
              className="w-full h-full object-cover opacity-75 mix-blend-luminosity"
            />

            {/* Bottom glass card – exactly like the HTML live session card */}
            <div className="absolute bottom-8 left-8 right-8 p-6 glass-card rounded-2xl border border-white/10 backdrop-blur-2xl">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-[#6ffbbe] text-xs font-semibold uppercase tracking-widest">Live Class</p>
                  <p className="text-white font-bold text-2xl tracking-tight">BD Curriculum</p>
                  <p className="text-white/70 text-sm mt-1">Classes 6–12 • Today 4:00 PM</p>
                </div>
                <div className="text-5xl text-[#adc6ff]">▶️</div>
              </div>
            </div>

            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10 opacity-70">
        <span className="text-xs tracking-[3px] font-medium">SCROLL TO EXPLORE</span>
        <div className="w-px h-12 bg-white animate-bounce" />
      </div>
    </div>
  );
};

export default HeroBanner;