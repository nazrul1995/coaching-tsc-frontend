'use client';

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { LayoutDashboard, User, Calendar, FileText, LogOut, Menu } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";

export function AppSidebar() {
  const { user, logout } = useAuth();
  const [active, setActive] = useState("overview");

  const handleLogout = () => {
    logout();
  };

  // Sidebar menu items
  const menuItems = [
    { label: "Overview", icon: <LayoutDashboard size={20} />, href: "/dashboard", key: "overview" },
    { label: "My Courses", icon: <FileText size={20} />, href: "/dashboard/course-management", key: "courses" },
    { label: "Schedule", icon: <Calendar size={20} />, href: "/dashboard/schedule", key: "schedule" },
    { label: "Profile", icon: <User size={20} />, href: "/dashboard/profile", key: "profile" },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-white/5 border-r border-white/10 flex-col">
        <div className="px-6 py-8 flex flex-col items-center">
          <h1 className="text-2xl font-bold text-[#adc6ff] mb-4">Lens</h1>
          {user?.image ? (
            <div className="relative w-20 h-20 rounded-full overflow-hidden mb-2">
              <Image src={user.image} alt="Profile" fill style={{ objectFit: "cover" }} />
            </div>
          ) : (
            <div className="w-20 h-20 rounded-full bg-[#adc6ff]/20 flex items-center justify-center text-xl mb-2">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
          )}
          <p className="text-white/70 text-sm">{user?.name || "User"}</p>
          <p className="text-[#6ffbbe] text-xs capitalize">{user?.role}</p>
        </div>

        <nav className="flex-1 px-4 mt-6 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                active === item.key ? "bg-[#adc6ff]/20 text-[#adc6ff]" : "hover:bg-white/10"
              }`}
              onClick={() => setActive(item.key)}
            >
              {item.icon} {item.label}
            </Link>
          ))}
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

      {/* Mobile Sidebar as Sheet */}
      <Sheet>
        {/* SheetTrigger is already a button, don't nest buttons */}
        <SheetTrigger className="md:hidden p-2 hover:bg-white/10 rounded-lg">
          <Menu size={24} />
        </SheetTrigger>

        <SheetContent side="left" className="w-64 bg-[#0b1326] text-white">
          <div className="px-6 py-8 flex flex-col items-center">
            <h1 className="text-2xl font-bold text-[#adc6ff] mb-4">Lens</h1>
            {user?.image ? (
              <div className="relative w-20 h-20 rounded-full overflow-hidden mb-2">
                <Image src={user.image} alt="Profile" fill style={{ objectFit: "cover" }} />
              </div>
            ) : (
              <div className="w-20 h-20 rounded-full bg-[#adc6ff]/20 flex items-center justify-center text-xl mb-2">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
            )}
            <p className="text-white/70 text-sm">{user?.name || "User"}</p>
            <p className="text-[#6ffbbe] text-xs capitalize">{user?.role}</p>
          </div>

          <nav className="flex-1 px-4 mt-6 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-white/10"
              >
                {item.icon} {item.label}
              </Link>
            ))}
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
        </SheetContent>
      </Sheet>
    </>
  );
}