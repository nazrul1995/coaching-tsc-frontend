'use client';
import React, { useState, } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, User, Calendar, LogOut, Menu, BookOpen, Plus, Trophy, Users } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

export function AppSidebar() {
  const { user, logout, isLoading } = useAuth();
  const pathname = usePathname();
  const [active, setActive] = useState("overview");
  
  const handleLogout = () => logout();

  const menuItems = [
    { label: "Overview", href: "/dashboard", key: "overview", roles: ["admin", "teacher", "student", "user"], icon: <LayoutDashboard size={20} /> },
    { label: "My Courses", href: "/dashboard/course-management", key: "course-management", roles: ["teacher", "admin"], icon: <BookOpen size={20} /> },
    { label: "My Enrolled Courses", href: "/dashboard/enrolled-courses", key: "enrolled-courses", roles: ["student", "user"], icon: <BookOpen size={20} /> },
    { label: "Add Course", href: "/dashboard/add-course", key: "add-course", roles: ["teacher", "admin"], icon: <Plus size={20} /> },
    { label: "Schedule", href: "/dashboard/schedule", key: "schedule", roles: ["teacher", "student"], icon: <Calendar size={20} /> },
    { label: "Student Results", href: "/dashboard/student-results", key: "student-results", roles: ["teacher"], icon: <Trophy size={20} /> },
    { label: "Profile", href: "/dashboard/profile", key: "profile", roles: ["admin", "teacher", "student", "user"], icon: <User size={20} /> },
    { label: "Admin Panel", href: "/admin", key: "admin", roles: ["admin"], icon: <Users size={20} /> },
    { label: "Student Panel", href: "/student", key: "student", roles: ["student"], icon: <Users size={20} /> },
  ];

  if (isLoading) {
    return (
      <div className="w-64 bg-white/5 flex items-center justify-center h-screen text-white/50">
        Loading sidebar...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="w-64 bg-white/5 flex items-center justify-center h-screen text-red-400">
        User not found
      </div>
    );
  }

  const filteredMenu = menuItems.filter(item => item.roles.includes(user?.role || ""));

  return (
    <>
      {/* === DESKTOP SIDEBAR - Premium Glass Design === */}
      <aside className="hidden md:flex w-72 bg-white/5 backdrop-blur-2xl border-r border-white/10 flex-col h-screen fixed left-0 top-0 z-50 shadow-2xl">
        
        {/* Logo + Header */}
        <div className="px-6 pt-8 pb-6 border-b border-white/10 flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-[#adc6ff] to-[#6ffbbe] rounded-2xl flex items-center justify-center text-[#0b1326] font-bold text-2xl shadow-inner">
            L
          </div>
          <h1 className="text-3xl font-bold tracking-tighter text-white">Lens</h1>
        </div>

        {/* Profile Card - Improved */}
        <div className="px-6 py-6 border-b border-white/10">
          <Link 
            href="/dashboard/profile"
            className="flex items-center gap-4 group hover:bg-white/10 transition-all rounded-3xl p-3 -mx-3"
          >
            {user?.image ? (
              <div className="relative w-12 h-12 rounded-2xl overflow-hidden ring-2 ring-[#adc6ff]/30 group-hover:ring-[#adc6ff]/60 transition-all">
                <Image src={user.image} alt="Profile" fill className="object-cover" />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#adc6ff]/20 to-[#6ffbbe]/20 flex items-center justify-center text-3xl font-semibold text-white/80 ring-2 ring-white/10">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold truncate">{user?.name || "User"}</p>
              <p className="text-[#6ffbbe] text-sm capitalize font-medium flex items-center gap-1.5">
                <span className="w-2 h-2 bg-[#6ffbbe] rounded-full animate-pulse"></span>
                {user?.role}
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation - Modern & Clean */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          {filteredMenu.map(item => (
            <Link
              key={item.key}
              href={item.href}
              onClick={() => setActive(item.key)}
              className={`flex items-center gap-3 px-5 py-4 rounded-3xl transition-all text-sm font-medium group ${
                active === item.key
                  ? "bg-linear-to-r from-[#adc6ff]/10 to-[#6ffbbe]/10 text-[#adc6ff] shadow-inner border border-[#adc6ff]/20"
                  : "hover:bg-white/10 text-white/80 hover:text-white"
              }`}
            >
              <span className={active === item.key ? "text-[#adc6ff]" : "text-white/70 group-hover:text-white"}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Logout - Premium Button */}
        <div className="px-6 pb-8">
          <Button
            variant="default"
            onClick={handleLogout}
            className="w-full h-12 rounded-3xl bg-white/10 hover:bg-red-500/90 hover:text-white transition-all flex items-center justify-center gap-3 text-sm font-semibold"
          >
            <LogOut size={18} />
            Logout
          </Button>
        </div>
      </aside>

      {/* === MOBILE SIDEBAR (Sheet) - Same Premium Look === */}
      <Sheet>
        <SheetTrigger className="md:hidden fixed top-4 left-4 z-50 p-3 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl text-white">
          <Menu size={24} />
        </SheetTrigger>

        <SheetContent side="left" className="w-72 bg-white/5 backdrop-blur-2xl border-r border-white/10 p-0 text-white">
          {/* Same content as desktop for consistency */}
          <div className="px-6 pt-8 pb-6 border-b border-white/10 flex items-center gap-3">
            <div className="w-9 h-9 bg-linear-to-br from-[#adc6ff] to-[#6ffbbe] rounded-2xl flex items-center justify-center text-[#0b1326] font-bold text-2xl shadow-inner">
              L
            </div>
            <h1 className="text-3xl font-bold tracking-tighter text-white">Lens</h1>
          </div>

          <div className="px-6 py-6 border-b border-white/10">
            <Link href="/dashboard/profile" className="flex items-center gap-4 group hover:bg-white/10 transition-all rounded-3xl p-3 -mx-3">
              {user?.image ? (
                <div className="relative w-12 h-12 rounded-2xl overflow-hidden ring-2 ring-[#adc6ff]/30">
                  <Image src={user.image} alt="Profile" fill className="object-cover" />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#adc6ff]/20 to-[#6ffbbe]/20 flex items-center justify-center text-3xl font-semibold text-white/80">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </div>
              )}
              <div className="flex-1">
                <p className="text-white font-semibold">{user?.name || "User"}</p>
                <p className="text-[#6ffbbe] text-sm capitalize font-medium">{user?.role}</p>
              </div>
            </Link>
          </div>

          <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
            {filteredMenu.map(item => (
              <Link
                key={item.key}
                href={item.href}
                className={`flex items-center gap-3 px-5 py-4 rounded-3xl transition-all text-sm font-medium ${
                  pathname === item.href ? "bg-gradient-to-r from-[#adc6ff]/10 to-[#6ffbbe]/10 text-[#adc6ff]" : "hover:bg-white/10 text-white/80"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="px-6 pb-8">
            <Button
              variant="default"
              onClick={handleLogout}
              className="w-full h-12 rounded-3xl bg-white/10 hover:bg-red-500/90 hover:text-white transition-all flex items-center justify-center gap-3 text-sm font-semibold"
            >
              <LogOut size={18} />
              Logout
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}