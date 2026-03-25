'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, User, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import Swal from 'sweetalert2';
import Image from 'next/image';

const Navbar = () => {
  const { isLoggedIn, user, logout, isLoading } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Close profile menu when clicking outside
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

  const navLinks = [
    { name: 'Courses', href: '/courses', private: false },
    { name: 'Teachers', href: '/teachers', private: false },
    { name: 'Events', href: '/events', private: false },
    { name: 'Notice Board', href: '/notice', private: false },
    { name: 'Free Exam', href: '/free-exam', private: true },
    { name: 'Results', href: '/result', private: true },
  ];

  const renderLink = (link: typeof navLinks[number], isMobile = false) => {
    const isActive = pathname === link.href;
    if (link.private && !isLoggedIn) return null;

    return (
      <Link
        key={link.name}
        href={link.href}
        className={`${
          isActive ? 'text-[#adc6ff]' : 'text-white/70'
        } ${isMobile ? 'block py-2 px-3 rounded-lg hover:bg-white/10 transition-colors' : 'hover:text-white transition-colors'}`}
        onClick={() => isMobile && setIsMobileMenuOpen(false)}
      >
        {link.name}
      </Link>
    );
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0b1326]/90 backdrop-blur-md shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] border-b border-white/10">
      <div className="max-w-[1440px] mx-auto px-6 md:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-3xl font-black tracking-tighter text-[#adc6ff] font-headline">
          Lens
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6 font-medium text-sm">
          {navLinks.map((link) => renderLink(link))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {isLoading ? (
            <div className="w-10 h-10 bg-white/10 rounded-full animate-pulse" />
          ) : isLoggedIn && user ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-white/10 transition-colors"
              >
                {user.image ? (
                  <Image
                    width={40}
                    height={40}
                    src={user.image}
                    alt={user.name || 'User avatar'}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#adc6ff]/20 flex items-center justify-center">
                    <User size={16} className="text-[#adc6ff]" />
                  </div>
                )}
                <span className="hidden sm:inline text-sm text-white">{user.name || user.email}</span>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#0b1326] border border-white/20 rounded-xl shadow-xl overflow-hidden">
                  <div className="px-4 py-3 border-b border-white/10">
                    <p className="text-xs text-white/50">Logged in as</p>
                    <p className="text-sm font-medium text-white">{user.email}</p>
                    <p className="text-xs text-[#adc6ff] capitalize">{user.role}</p>
                  </div>
                  <div className="py-2">
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-all"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <LayoutDashboard size={18} /> Dashboard
                    </Link>
                    <Link
                      href="/profile"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-all"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <User size={18} /> Profile
                    </Link>
                  </div>
                  <div className="border-t border-white/10 py-2">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
                    >
                      <LogOut size={18} /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link
                href="/login"
                className="text-sm font-medium text-white/70 hover:text-white transition-colors"
              >
                Login
              </Link>
              <Button className="bg-[#adc6ff] hover:bg-[#adc6ff]/90 text-[#002e6a] font-bold text-base px-6 py-3 rounded-2xl shadow-lg hover:shadow-[#adc6ff]/30 transition-all">
                <Link href="/register">Join Now</Link>
              </Button>
            </div>
          )}

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-white/10 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#0b1326]/95 border-t border-white/10 shadow-lg">
          <div className="flex flex-col py-4 px-6 gap-3 font-medium text-white/80">
            {navLinks.map((link) => renderLink(link, true))}

            {!isLoggedIn && (
              <>
                <Link
                  href="/login"
                  className="py-2 px-3 rounded-lg hover:bg-white/10 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="py-2 px-3 rounded-lg bg-[#adc6ff] text-[#002e6a] font-bold text-center transition-all"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Join Now
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;