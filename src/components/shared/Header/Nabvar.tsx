'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, User, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

const Navbar = () => {
  const { isLoggedIn, user, logout, isLoading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const router = useRouter();
  const profileRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    Swal.fire({
      title: 'Logout?',
      text: 'Are you sure you want to logout?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#adc6ff',
      cancelButtonColor: '#6ffbbe',
      confirmButtonText: 'Yes, logout',
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        setIsProfileOpen(false);
        router.push('/');
        Swal.fire({
          icon: 'success',
          title: 'Logged out',
          text: 'See you soon!',
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0b1326]/80 backdrop-blur-md shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] border-b border-white/10">
      <div className="max-w-[1440px] mx-auto px-8 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="text-3xl font-black tracking-tighter text-[#adc6ff] font-headline">
          Lens
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-10 text-sm font-medium">
          <Link href="#courses" className="text-white/70 hover:text-white transition-colors">Courses</Link>
          <Link href="#teachers" className="text-white/70 hover:text-white transition-colors">Teachers</Link>
          <Link href="#pricing" className="text-white/70 hover:text-white transition-colors">Pricing</Link>
          <Link href="#community" className="text-white/70 hover:text-white transition-colors">Community</Link>
        </div>

        {/* Right Side - Dynamic based on auth state */}
        <div className="flex items-center gap-5">
          
          {isLoading ? (
            <div className="w-10 h-10 bg-white/10 rounded-full animate-pulse" />
          ) : isLoggedIn && user ? (
            /* LOGGED IN - User Menu */
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-white/10 transition-colors"
              >
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#adc6ff]/20 flex items-center justify-center">
                    <User size={16} className="text-[#adc6ff]" />
                  </div>
                )}
                <span className="hidden sm:inline text-sm text-white">{user.name || user.email}</span>
              </button>

              {/* Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#0b1326] border border-white/20 rounded-xl shadow-xl overflow-hidden">
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-white/10">
                    <p className="text-xs text-white/50">Logged in as</p>
                    <p className="text-sm font-medium text-white">{user.email}</p>
                    <p className="text-xs text-[#adc6ff] capitalize">{user.role}</p>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-all"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <LayoutDashboard size={18} />
                      Dashboard
                    </Link>
                    <Link
                      href="/profile"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-all"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <User size={18} />
                      Profile
                    </Link>
                  </div>

                  {/* Logout */}
                  <div className="border-t border-white/10 py-2">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* NOT LOGGED IN - Auth Buttons */
            <>
              <Link
                href="/login"
                className="hidden sm:inline text-sm font-medium text-white/70 hover:text-white transition-colors"
              >
                Login
              </Link>
              <Button className="bg-[#adc6ff] hover:bg-[#adc6ff]/90 text-[#002e6a] font-bold text-base px-8 py-6 rounded-2xl shadow-lg hover:shadow-[#adc6ff]/30 transition-all active:scale-95">
                <Link href="/register">Join Now</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;