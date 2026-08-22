"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  User,
  Calendar,
  LogOut,
  Menu,
  BookOpen,
  Plus,
  Trophy,
  Users,
  CreditCard,
  ChevronRight,
  Sparkles,
  X,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

import Logo from "../shared/logo/Logo";

/* -------------------------------------------------------------------------- */
/* TYPES                                                                      */
/* -------------------------------------------------------------------------- */

interface MenuItem {
  label: string;
  href: string;
  key: string;
  roles: string[];
  icon: React.ReactNode;
}

/* -------------------------------------------------------------------------- */
/* MENU                                                                       */
/* -------------------------------------------------------------------------- */

const menuItems: MenuItem[] = [
  {
    label: "Overview",
    href: "/dashboard",
    key: "overview",
    roles: ["admin", "teacher", "student", "user"],
    icon: <LayoutDashboard size={19} />,
  },
  {
    label: "Payments",
    href: "/dashboard/payments",
    key: "payments",
    roles: ["admin", "teacher"],
    icon: <CreditCard size={19} />,
  },
  {
    label: "My Courses",
    href: "/dashboard/course-management",
    key: "course-management",
    roles: ["teacher", "admin"],
    icon: <BookOpen size={19} />,
  },
  {
    label: "My Enrolled Courses",
    href: "/dashboard/enrolled-courses",
    key: "enrolled-courses",
    roles: ["student", "user"],
    icon: <BookOpen size={19} />,
  },
  {
    label: "Add Course",
    href: "/dashboard/add-course",
    key: "add-course",
    roles: ["teacher", "admin"],
    icon: <Plus size={19} />,
  },
  {
    label: "Schedule",
    href: "/dashboard/schedule",
    key: "schedule",
    roles: ["teacher", "student"],
    icon: <Calendar size={19} />,
  },
  {
    label: "Student Results",
    href: "/dashboard/student-results",
    key: "student-results",
    roles: ["teacher"],
    icon: <Trophy size={19} />,
  },
  {
    label: "Profile",
    href: "/dashboard/profile",
    key: "profile",
    roles: ["admin", "teacher", "student", "user"],
    icon: <User size={19} />,
  },
  {
    label: "Admin Panel",
    href: "/admin",
    key: "admin",
    roles: ["admin"],
    icon: <Users size={19} />,
  },
  {
    label: "Student Panel",
    href: "/student",
    key: "student",
    roles: ["student"],
    icon: <Users size={19} />,
  },
];

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                    */
/* -------------------------------------------------------------------------- */

function isActiveRoute(pathname: string, href: string) {
  if (href === "/dashboard") {
    return pathname === "/dashboard";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

/* -------------------------------------------------------------------------- */
/* USER PROFILE                                                               */
/* -------------------------------------------------------------------------- */

function UserProfile({
  user,
  mobile = false,
}: {
  user: any;
  mobile?: boolean;
}) {
  return (
    <Link
      href="/dashboard/profile"
      className={`group flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.035] p-3 transition-all duration-300 hover:border-[#adc6ff]/20 hover:bg-white/[0.07] ${
        mobile ? "mx-1" : ""
      }`}
    >
      {/* Avatar */}
      <div className="relative shrink-0">
        {user?.image ? (
          <div className="relative h-11 w-11 overflow-hidden rounded-xl border border-white/10 ring-2 ring-[#adc6ff]/10 transition-all group-hover:ring-[#adc6ff]/30">
            <Image
              src={user.image}
              alt={user?.name || "Profile"}
              fill
              sizes="44px"
              className="object-cover"
            />
          </div>
        ) : (
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#adc6ff] to-[#6ffbbe] text-lg font-black text-[#0b1326] shadow-lg shadow-[#6ffbbe]/10">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
        )}

        <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#0b1326] bg-[#6ffbbe]" />
      </div>

      {/* User information */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-white">
          {user?.name || "User"}
        </p>

        <div className="mt-0.5 flex items-center gap-1.5">
          <span className="truncate text-[11px] font-medium capitalize text-[#6ffbbe]">
            {user?.role || "User"}
          </span>

          <span className="text-white/20">•</span>

          <span className="text-[10px] text-white/40">Online</span>
        </div>
      </div>

      <ChevronRight
        size={16}
        className="shrink-0 text-white/20 transition-transform group-hover:translate-x-0.5 group-hover:text-[#adc6ff]"
      />
    </Link>
  );
}

/* -------------------------------------------------------------------------- */
/* NAVIGATION                                                                 */
/* -------------------------------------------------------------------------- */

function SidebarNavigation({
  items,
  pathname,
  mobile = false,
}: {
  items: MenuItem[];
  pathname: string;
  mobile?: boolean;
}) {
  return (
    <nav
      className={`flex-1 overflow-y-auto ${
        mobile ? "px-3 py-4" : "px-3 py-5"
      }`}
    >
      <div className="mb-3 px-3">
        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/30">
          Navigation
        </p>
      </div>

      <div className="space-y-1">
        {items.map((item) => {
          const active = isActiveRoute(pathname, item.href);

          const content = (
            <div
              className={`group relative flex items-center gap-3 overflow-hidden rounded-2xl px-3.5 py-3 transition-all duration-300 ${
                active
                  ? "border border-[#adc6ff]/15 bg-gradient-to-r from-[#adc6ff]/12 via-[#adc6ff]/5 to-[#6ffbbe]/10 text-white shadow-[0_8px_30px_rgba(108,251,190,0.04)]"
                  : "border border-transparent text-white/55 hover:border-white/5 hover:bg-white/[0.045] hover:text-white"
              }`}
            >
              {/* Active indicator */}
              {active && (
                <>
                  <span className="absolute left-0 top-1/2 h-7 w-0.5 -translate-y-1/2 rounded-full bg-gradient-to-b from-[#adc6ff] to-[#6ffbbe]" />

                  <span className="absolute -right-5 top-1/2 h-12 w-12 -translate-y-1/2 rounded-full bg-[#6ffbbe]/10 blur-xl" />
                </>
              )}

              {/* Icon */}
              <span
                className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-all ${
                  active
                    ? "bg-gradient-to-br from-[#adc6ff]/20 to-[#6ffbbe]/15 text-[#adc6ff]"
                    : "bg-white/[0.035] text-white/45 group-hover:bg-white/[0.08] group-hover:text-white"
                }`}
              >
                {item.icon}
              </span>

              {/* Label */}
              <span className="relative z-10 min-w-0 flex-1 truncate text-[13px] font-semibold">
                {item.label}
              </span>

              {/* Active arrow */}
              {active && (
                <ChevronRight
                  size={15}
                  className="relative z-10 shrink-0 text-[#6ffbbe]"
                />
              )}
            </div>
          );

          if (mobile) {
            return (
              <SheetClose asChild key={item.key}>
                <Link href={item.href}>{content}</Link>
              </SheetClose>
            );
          }

          return (
            <Link key={item.key} href={item.href}>
              {content}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

/* -------------------------------------------------------------------------- */
/* LOGOUT BUTTON                                                              */
/* -------------------------------------------------------------------------- */

function LogoutButton({
  onLogout,
  mobile = false,
}: {
  onLogout: () => void;
  mobile?: boolean;
}) {
  return (
    <div className={`${mobile ? "px-4 pb-5" : "px-4 pb-5"}`}>
      <button
        type="button"
        onClick={onLogout}
        className="group flex h-11 w-full items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.035] px-4 text-left text-sm font-semibold text-white/60 transition-all duration-300 hover:border-red-400/20 hover:bg-red-500/10 hover:text-red-300"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/5 transition-colors group-hover:bg-red-500/10">
          <LogOut size={16} />
        </span>

        <span className="flex-1">Logout</span>

        <ChevronRight
          size={15}
          className="text-white/20 transition-transform group-hover:translate-x-0.5 group-hover:text-red-300"
        />
      </button>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* BRAND                                                                      */
/* -------------------------------------------------------------------------- */

function SidebarBrand({ mobile = false }: { mobile?: boolean }) {
  return (
    <div
      className={`flex items-center ${
        mobile ? "px-5 pb-5 pt-6" : "px-5 pb-5 pt-5"
      }`}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#adc6ff] to-[#6ffbbe] text-lg font-black text-[#0b1326] shadow-[0_8px_30px_rgba(111,251,190,0.12)]">
          L

          <span className="absolute -right-1 -top-1">
            <Sparkles size={11} className="text-[#6ffbbe]" />
          </span>
        </div>

        <div className="min-w-0">
          <div className="text-[18px] font-black tracking-tight text-white">
            Lens
          </div>
          <div className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/30">
            Coaching
          </div>
        </div>
      </div>

      {/* Online indicator */}
      <div className="hidden items-center gap-1.5 rounded-full border border-[#6ffbbe]/10 bg-[#6ffbbe]/5 px-2 py-1 sm:flex">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#6ffbbe]" />
        <span className="text-[8px] font-bold uppercase tracking-wider text-[#6ffbbe]">
          Live
        </span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* APP SIDEBAR                                                                */
/* -------------------------------------------------------------------------- */

export function AppSidebar() {
  const { user, logout, isLoading } = useAuth();
  const pathname = usePathname();

  if (isLoading) {
    return (
      <aside className="fixed left-0 top-0 z-50 hidden h-screen w-72 border-r border-white/10 bg-[#0b1326] md:flex">
        <div className="flex w-full items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-10 w-10 animate-pulse rounded-2xl bg-gradient-to-br from-[#adc6ff]/30 to-[#6ffbbe]/30" />
            <span className="text-xs text-white/30">Loading...</span>
          </div>
        </div>
      </aside>
    );
  }

  if (!user) {
    return null;
  }

  const filteredMenu = menuItems.filter((item) =>
    item.roles.includes(user?.role || "")
  );

  return (
    <>
      {/* ================================================================== */}
      {/* DESKTOP SIDEBAR                                                    */}
      {/* ================================================================== */}

      <aside className="fixed left-0 top-0 z-50 hidden h-screen w-72 border-r border-white/[0.07] bg-[#0b1326] md:flex md:flex-col">
        {/* Decorative glow */}
        <div className="pointer-events-none absolute -left-20 top-20 h-48 w-48 rounded-full bg-[#adc6ff]/5 blur-3xl" />

        <div className="pointer-events-none absolute -right-20 bottom-20 h-56 w-56 rounded-full bg-[#6ffbbe]/5 blur-3xl" />

        {/* Brand */}
        <div className="relative border-b border-white/[0.07]">
          <SidebarBrand />
        </div>

        {/* User */}
        <div className="relative border-b border-white/[0.07] px-4 py-4">
          <UserProfile user={user} />
        </div>

        {/* Navigation */}
        <SidebarNavigation
          items={filteredMenu}
          pathname={pathname}
        />

        {/* Bottom */}
        <div className="relative border-t border-white/[0.07] pt-4">
          {/* Small coaching card */}
          <div className="mx-4 mb-4 overflow-hidden rounded-2xl border border-[#adc6ff]/10 bg-gradient-to-br from-[#adc6ff]/5 to-[#6ffbbe]/5 p-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#adc6ff]/15 to-[#6ffbbe]/15">
                <Sparkles size={13} className="text-[#6ffbbe]" />
              </div>

              <div className="min-w-0">
                <p className="text-[10px] font-bold text-white/80">
                  Lens Coaching
                </p>
                <p className="truncate text-[9px] text-white/30">
                  Learn. Grow. Succeed.
                </p>
              </div>
            </div>
          </div>

          <LogoutButton onLogout={logout} />
        </div>
      </aside>

      {/* ================================================================== */}
      {/* MOBILE HEADER                                                      */}
      {/* ================================================================== */}

      <div className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center border-b border-white/[0.07] bg-[#0b1326]/90 px-4 backdrop-blur-2xl md:hidden">
        <Sheet>
          {/* IMPORTANT:
              SheetTrigger itself renders a button.
              Therefore DO NOT put a Button inside it.
          */}
          <SheetTrigger
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-white transition-all hover:bg-white/10"
            aria-label="Open navigation menu"
          >
            <Menu size={20} />
          </SheetTrigger>

          <div className="ml-3 flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#adc6ff] to-[#6ffbbe] text-sm font-black text-[#0b1326]">
              L
            </div>

            <div>
              <p className="text-sm font-black text-white">Lens</p>
              <p className="text-[8px] font-semibold uppercase tracking-[0.15em] text-white/30">
                Coaching
              </p>
            </div>
          </div>

          {/* ============================================================ */}
          {/* MOBILE SHEET                                                 */}
          {/* ============================================================ */}

          <SheetContent
            side="left"
            className="w-[min(86vw,320px)] border-r border-white/[0.08] bg-[#0b1326] p-0 text-white"
          >
            <div className="flex h-full flex-col">
              {/* Brand */}
              <div className="border-b border-white/[0.07]">
                <div className="flex items-center justify-between">
                  <SidebarBrand mobile />

                  <SheetClose
                    className="mr-4 flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/50 transition hover:bg-white/10 hover:text-white"
                    aria-label="Close navigation menu"
                  >
                    <X size={17} />
                  </SheetClose>
                </div>
              </div>

              {/* User */}
              <div className="border-b border-white/[0.07] px-4 py-4">
                <UserProfile user={user} mobile />
              </div>

              {/* Navigation */}
              <SidebarNavigation
                items={filteredMenu}
                pathname={pathname}
                mobile
              />

              {/* Logout */}
              <div className="border-t border-white/[0.07] pt-4">
                <LogoutButton
                  onLogout={logout}
                  mobile
                />
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Mobile page indicator */}
        <div className="ml-auto flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.035] px-3 py-1.5">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#6ffbbe]" />

          <span className="max-w-[120px] truncate text-[10px] font-semibold text-white/50">
            {pathname === "/dashboard"
              ? "Overview"
              : pathname
                  .split("/")
                  .filter(Boolean)
                  .pop()
                  ?.replace(/-/g, " ")}
          </span>
        </div>
      </div>

      {/* Mobile top spacing */}
      <div className="h-16 md:hidden" />
    </>
  );
}