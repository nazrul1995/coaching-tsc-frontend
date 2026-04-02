'use client';
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { LayoutDashboard, User, Calendar, FileText, LogOut, Menu } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";

export function AppSidebar() {
  const { user, logout, isLoading } = useAuth();
  const [active, setActive] = useState("overview");
  const handleLogout = () => logout();
  const menuItems = [
    { label: "Overview", href: "/dashboard", key: "overview", roles: ["admin", "teacher", "student", "user"], icon: <LayoutDashboard size={20} /> },
    { label: "My Courses", href: "/dashboard/course-management", key: "courses", roles: ["teacher", "admin"], icon: <FileText size={20} /> },
    { label: "My Enrolled Courses", href: "/dashboard/enrolled-courses", key: "enrolled-courses", roles: ["student", "user"], icon: <FileText size={20} /> },
    { label: "Add Course", href: "/dashboard/add-course", key: "add-course", roles: ["teacher", "admin"], icon: <FileText size={20} /> },
    { label: "Schedule", href: "/dashboard/schedule", key: "schedule", roles: ["teacher", "student"], icon: <Calendar size={20} /> },
    { label: "Profile", href: "/dashboard/profile", key: "profile", roles: ["admin", "teacher", "student", "user"], icon: <User size={20} /> },
    { label: "Admin Panel", href: "/admin", key: "admin", roles: ["admin"], icon: <User size={20} /> },
    { label: "Student Result", href: "/dashboard/student-results", key: "student-results", roles: ["teacher"], icon: <FileText size={20} /> },
    { label: "Student Panel", href: "/student", key: "student", roles: ["student"], icon: <FileText size={20} /> },
  ];

  if(isLoading) {
    return (
      <div className="text-white text-center mt-20">
        Loading...
      </div>
    );
  }

   if (!user) {
    return (
      <div className="text-red-400 text-center mt-20">
        User not found
      </div>
    );
  }
console.log("User data in AppSidebar:", user);
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
          {menuItems
            .filter(item => item.roles.includes(user?.role || ""))
            .map(item => (
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

      {/* Mobile Sidebar */}
      <Sheet>
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
            {menuItems
              .filter(item => item.roles.includes(user?.role || ""))
              .map(item => (
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