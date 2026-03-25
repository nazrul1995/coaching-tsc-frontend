'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { LayoutDashboard, User, Calendar, FileText, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [active, setActive] = useState('overview');

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="min-h-screen flex bg-[#0b1326] text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-white/5 border-r border-white/10 flex flex-col">
        <div className="px-6 py-8 flex flex-col items-center">
          <h1 className="text-2xl font-bold text-[#adc6ff] mb-4">Lens</h1>
          {user?.image ? (
            <div className="relative w-20 h-20 rounded-full overflow-hidden mb-2">
              <Image src={user.image} alt="Profile" fill style={{ objectFit: 'cover' }} />
            </div>
          ) : (
            <div className="w-20 h-20 rounded-full bg-[#adc6ff]/20 flex items-center justify-center text-xl mb-2">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
          )}
          <p className="text-white/70 text-sm">{user?.name || 'User'}</p>
          <p className="text-[#6ffbbe] text-xs capitalize">{user?.role}</p>
        </div>

        <nav className="flex-1 px-4 mt-6 space-y-2">
          <Link
            href="#"
            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
              active === 'overview' ? 'bg-[#adc6ff]/20 text-[#adc6ff]' : 'hover:bg-white/10'
            }`}
            onClick={() => setActive('overview')}
          >
            <LayoutDashboard size={20} /> Overview
          </Link>
          <Link
            href="#"
            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
              active === 'courses' ? 'bg-[#adc6ff]/20 text-[#adc6ff]' : 'hover:bg-white/10'
            }`}
            onClick={() => setActive('courses')}
          >
            <FileText size={20} /> My Courses
          </Link>
          <Link
            href="#"
            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
              active === 'schedule' ? 'bg-[#adc6ff]/20 text-[#adc6ff]' : 'hover:bg-white/10'
            }`}
            onClick={() => setActive('schedule')}
          >
            <Calendar size={20} /> Schedule
          </Link>
          <Link
            href="#"
            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
              active === 'profile' ? 'bg-[#adc6ff]/20 text-[#adc6ff]' : 'hover:bg-white/10'
            }`}
            onClick={() => setActive('profile')}
          >
            <User size={20} /> Profile
          </Link>
        </nav>

        <div className="px-4 py-4 border-t border-white/10">
          <Button
            variant="default"
            className="w-full flex items-center gap-3 justify-center bg-red-500 hover:bg-red-600"
            onClick={handleLogout}
          >
            <LogOut size={18} /> Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-6 text-[#adc6ff]">Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/5 p-6 rounded-2xl border border-white/10 shadow-lg flex flex-col">
            <span className="text-white/70 text-sm">Total Courses</span>
            <span className="text-2xl font-bold mt-2 text-[#6ffbbe]">12</span>
          </div>
          <div className="bg-white/5 p-6 rounded-2xl border border-white/10 shadow-lg flex flex-col">
            <span className="text-white/70 text-sm">Enrolled Students</span>
            <span className="text-2xl font-bold mt-2 text-[#adc6ff]">41</span>
          </div>
          <div className="bg-white/5 p-6 rounded-2xl border border-white/10 shadow-lg flex flex-col">
            <span className="text-white/70 text-sm">Upcoming Events</span>
            <span className="text-2xl font-bold mt-2 text-[#6ffbbe]">3</span>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-[#adc6ff]">Recent Activities</h2>
          <ul className="space-y-2 text-white/70">
            <li>✅ Completed &quot;Math Basics&quot; course</li>
            <li>📝 Submitted &quot;Science Project&quot; assignment</li>
            <li>📅 Registered for &quot;Free Exam April 2026&quot;</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;