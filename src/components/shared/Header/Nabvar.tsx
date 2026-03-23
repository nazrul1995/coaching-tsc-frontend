import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, User } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0b1326]/80 backdrop-blur-md shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] border-b border-white/10">
      <div className="max-w-[1440px] mx-auto px-8 h-20 flex items-center justify-between">
        
        {/* Logo - exact from your HTML */}
        <Link href="/" className="text-3xl font-black tracking-tighter text-[#adc6ff] font-headline">
          Lens
        </Link>

        {/* Desktop Menu - exact from HTML */}
        <div className="hidden md:flex items-center gap-10 text-sm font-medium">
          <Link href="#courses" className="text-white/70 hover:text-white transition-colors">Courses</Link>
          <Link href="#teachers" className="text-white/70 hover:text-white transition-colors">Teachers</Link>
          <Link href="#pricing" className="text-white/70 hover:text-white transition-colors">Pricing</Link>
          <Link href="#community" className="text-white/70 hover:text-white transition-colors">Community</Link>
        </div>

        {/* Right Side - exact icons + Join button */}
        <div className="flex items-center gap-5">
          {/* Dashboard Icon */}
          <Link 
            href="#dashboard" 
            className="hidden lg:flex items-center justify-center w-10 h-10 rounded-full hover:bg-[#adc6ff]/10 transition-colors text-white/70 hover:text-[#adc6ff]"
          >
            <LayoutDashboard size={22} />
          </Link>

          {/* Account Icon */}
          <Link 
            href="#profile" 
            className="hidden lg:flex items-center justify-center w-10 h-10 rounded-full hover:bg-[#adc6ff]/10 transition-colors text-white/70 hover:text-[#adc6ff]"
          >
            <User size={22} />
          </Link>

          {/* Join Now Button - exact styling */}
          <Button 
            className="bg-[#adc6ff] hover:bg-[#adc6ff]/90 text-[#002e6a] font-bold text-base px-8 py-6 rounded-2xl shadow-lg hover:shadow-[#adc6ff]/30 transition-all active:scale-95"
          >
            <Link href="#enroll">Join Now</Link>
          </Button>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;