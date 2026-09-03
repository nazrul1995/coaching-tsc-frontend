"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  LogOut,
  Menu,
  BookOpen,
  Plus,
  Trophy,
  Users,
  CreditCard,
  ChevronRight,
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
  href?: string;
  key: string;
  roles: string[];
  icon: React.ReactNode;
  children?: MenuItem[];
}

interface AppSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/* -------------------------------------------------------------------------- */
/* MENU                                                                       */
/* -------------------------------------------------------------------------- */

const menuItems: MenuItem[] = [
  {
    label: "Profile",
    href: "/dashboard/profile",
    key: "profile",
    roles: ["admin", "teacher", "student", "user"],
    icon: <LayoutDashboard size={18} />,
  },

  {
    label: "Payments",
    href: "/dashboard/admin/payments-management",
    key: "payments",
    roles: ["admin", "teacher"],
    icon: <CreditCard size={18} />,
  },
  {
    label: "Payments History",
    href: "/dashboard/student/student-payment",
    key: "payments",
    roles: ["student"],
    icon: <CreditCard size={18} />,
  },

  {
    label: "Exam Management",
    key: "exam-management",
    roles: ["admin", "teacher"],
    icon: <BookOpen size={18} />,

    children: [
      {
        label: "All Exams",
        href: "/dashboard/admin/exam-management",
        key: "all-exams",
        roles: ["admin", "teacher"],
        icon: <BookOpen size={16} />,
      },
      {
        label: "Create Exam",
        href: "/dashboard/admin/exam-management/create",
        key: "create-exam",
        roles: ["admin", "teacher"],
        icon: <Plus size={16} />,
      },
      {
        label: "Questions",
        href: "/dashboard/admin/exam-management/questions",
        key: "questions",
        roles: ["admin", "teacher"],
        icon: <BookOpen size={16} />,
      },
    ],
  },

  {
    label: "Result Management",
    key: "result-management",
    roles: ["admin", "teacher"],
    icon: <Trophy size={18} />,

    children: [
      {
        label: "All Results",
        href: "/dashboard/admin/result-management",
        key: "all-results",
        roles: ["admin", "teacher"],
        icon: <Trophy size={16} />,
      },
      {
        label: "Publish Results",
        href: "/dashboard/admin/result-management/publish",
        key: "publish-results",
        roles: ["admin", "teacher"],
        icon: <Plus size={16} />,
      },
    ],
  },

  {
    label: "Students",
    href: "/dashboard/admin/students",
    key: "student-management",
    roles: ["teacher", "admin"],
    icon: <Users size={18} />,
  },

  {
    label: "My Enrolled Courses",
    href: "/dashboard/enrolled-courses",
    key: "enrolled-courses",
    roles: ["student", "user"],
    icon: <BookOpen size={18} />,
  },

  {
    label: "Add Course",
    href: "/dashboard/add-course",
    key: "add-course",
    roles: ["teacher", "admin"],
    icon: <Plus size={18} />,
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
      className={`group flex items-center gap-3 ${
        mobile ? "px-1" : ""
      }`}
    >
      {/* Avatar */}
      <div className="relative shrink-0">
        {user?.image ? (
          <div className="relative h-10 w-10 overflow-hidden rounded-full border border-white/10">
            <Image
              src={user.image}
              alt={user?.name || "Profile"}
              fill
              sizes="40px"
              className="object-cover"
            />
          </div>
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1b2942] text-sm font-bold text-[#adc6ff]">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
        )}

        {/* Online */}
        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#0b1326] bg-[#6ffbbe]" />
      </div>

      {/* User Info */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-white">
          {user?.name || "User"}
        </p>

        <p className="mt-0.5 truncate text-[11px] capitalize text-white/40">
          {user?.role || "User"}
        </p>
      </div>

      <ChevronRight
        size={15}
        className="text-white/20 transition-all group-hover:translate-x-0.5 group-hover:text-white/50"
      />
    </Link>
  );
}

/* -------------------------------------------------------------------------- */
/* SIDEBAR NAVIGATION                                                         */
/* -------------------------------------------------------------------------- */

function SidebarNavigation({
  items,
  pathname,
  mobile = false,
  onNavigate,
}: {
  items: MenuItem[];
  pathname: string;
  mobile?: boolean;
  onNavigate?: () => void;
}) {
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  const toggleMenu = (key: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <nav
      className={`flex-1 overflow-y-auto ${
        mobile ? "px-4 py-5" : "px-3 py-6"
      }`}
    >
      {/* Section Label */}
      <div className="mb-3 px-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/25">
          Menu
        </p>
      </div>

      <div className="space-y-0.5">
        {items.map((item) => {
          const hren = !!item.children?.length;

          const childActive = item.children?.some(
            (child) =>
              child.href && isActiveRoute(pathname, child.href)
          );

          const active =
            childActive ||
            (!!item.href && isActiveRoute(pathname, item.href));

          const isOpen =
            openMenus[item.key] || childActive;

          /* ============================================================= */
          /* PARENT WITH CHILDREN                                          */
          /* ============================================================= */

          if (hren) {
            return (
              <div key={item.key}>
                <button
                  type="button"
                  onClick={() => toggleMenu(item.key)}
                  className={`
                    group
                    relative
                    flex
                    w-full
                    items-center
                    gap-3
                    px-3
                    py-2.5
                    text-left
                    transition-colors

                    ${
                      active
                        ? "text-white"
                        : "text-white/50 hover:text-white"
                    }
                  `}
                >
                  {active && (
                    <span className="absolute left-0 h-5 w-0.5 rounded-full bg-[#6ffbbe]" />
                  )}

                  <span
                    className={`
                      flex
                      h-7
                      w-7
                      shrink-0
                      items-center
                      justify-center

                      ${
                        active
                          ? "text-[#adc6ff]"
                          : "text-white/40 group-hover:text-white"
                      }
                    `}
                  >
                    {item.icon}
                  </span>

                  <span className="flex-1 text-[13px] font-medium">
                    {item.label}
                  </span>

                  <ChevronRight
                    size={15}
                    className={`
                      text-white/25
                      transition-transform
                      duration-200

                      ${
                        isOpen
                          ? "rotate-90 text-[#6ffbbe]"
                          : ""
                      }
                    `}
                  />
                </button>

                {/* ===================================================== */}
                {/* SUB MENU                                               */}
                {/* ===================================================== */}

                <div
                  className={`
                    grid
                    transition-all
                    duration-200

                    ${
                      isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }
                  `}
                >
                  <div className="min-h-0 overflow-hidden">
                    <div className="ml-6 border-l border-white/[0.08] pl-3">
                      {item.children?.map((child) => {
                        if (!child.href) return null;

                        const childIsActive =
                          isActiveRoute(
                            pathname,
                            child.href
                          );

                        const childContent = (
                          <div
                            className={`
                              group
                              relative
                              flex
                              items-center
                              gap-2.5
                              px-3
                              py-2
                              text-[12px]
                              transition-colors

                              ${
                                childIsActive
                                  ? "text-white"
                                  : "text-white/40 hover:text-white/80"
                              }
                            `}
                          >
                            {childIsActive && (
                              <span className="absolute -left-[1px] h-4 w-0.5 bg-[#6ffbbe]" />
                            )}

                            <span
                              className={
                                childIsActive
                                  ? "text-[#6ffbbe]"
                                  : "text-white/25 group-hover:text-white/50"
                              }
                            >
                              {child.icon}
                            </span>

                            <span>{child.label}</span>
                          </div>
                        );

                        if (mobile) {
                          return (
                            <SheetClose
                              key={child.key}
                              
                            >
                              <Link
                                href={child.href}
                                onClick={onNavigate}
                              >
                                {childContent}
                              </Link>
                            </SheetClose>
                          );
                        }

                        return (
                          <Link
                            key={child.key}
                            href={child.href}
                          >
                            {childContent}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          /* ============================================================= */
          /* NORMAL MENU ITEM                                              */
          /* ============================================================= */

          if (!item.href) return null;

          const content = (
            <div
              className={`
                group
                relative
                flex
                items-center
                gap-3
                px-3
                py-2.5
                transition-colors

                ${
                  active
                    ? "bg-white/[0.055] text-white"
                    : "text-white/50 hover:bg-white/[0.025] hover:text-white"
                }
              `}
            >
              {active && (
                <span className="absolute left-0 h-5 w-0.5 rounded-full bg-[#6ffbbe]" />
              )}

              <span
                className={`
                  flex
                  h-7
                  w-7
                  shrink-0
                  items-center
                  justify-center

                  ${
                    active
                      ? "text-[#adc6ff]"
                      : "text-white/40 group-hover:text-white"
                  }
                `}
              >
                {item.icon}
              </span>

              <span className="flex-1 truncate text-[13px] font-medium">
                {item.label}
              </span>

              {active && (
                <ChevronRight
                  size={14}
                  className="text-[#6ffbbe]"
                />
              )}
            </div>
          );

          if (mobile) {
            return (
              <SheetClose key={item.key}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                >
                  {content}
                </Link>
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
/* LOGOUT                                                                     */
/* -------------------------------------------------------------------------- */

function LogoutButton({
  onLogout,
}: {
  onLogout: () => void;
}) {
  return (
    <div className="px-4 pb-5">
      <button
        type="button"
        onClick={onLogout}
        className="
          group
          flex
          w-full
          items-center
          gap-3
          px-3
          py-2.5
          text-sm
          font-medium
          text-white/40
          transition-colors
          hover:text-red-300
        "
      >
        <LogOut
          size={17}
          className="transition-colors group-hover:text-red-300"
        />

        <span className="flex-1 text-left">
          Logout
        </span>
      </button>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* BRAND                                                                      */
/* -------------------------------------------------------------------------- */

function SidebarBrand() {
  return (
    <div className="flex items-center px-5 py-5">
     <Logo/>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* APP SIDEBAR                                                                */
/* -------------------------------------------------------------------------- */

export function AppSidebar({
  open,
  onOpenChange,
}: AppSidebarProps) {
  const { user, logout, isLoading } = useAuth();
  const pathname = usePathname();

  const [mobileOpen, setMobileOpen] =
    useState(false);

  if (isLoading) {
    return (
      <aside className="fixed left-0 top-0 z-50 hidden h-screen w-64 border-r border-white/[0.07] bg-[#0b1326] md:flex">
        <div className="flex w-full items-center justify-center">
          <span className="text-xs text-white/30">
            Loading...
          </span>
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
      {/* DESKTOP DRAWER                                                    */}
      {/* ================================================================== */}

      <aside
        className={`
          fixed
          inset-y-0
          left-0
          z-50
          hidden
          w-64
          flex-col
          border-r
          border-white/[0.07]
          bg-[#0b1326]
          md:flex
          transition-transform
          duration-300
          ease-in-out

          ${
            open
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        {/* ================================================================ */}
        {/* BRAND                                                            */}
        {/* ================================================================ */}

        <div className="border-b border-white/[0.07]">
          <SidebarBrand />
        </div>

        {/* ================================================================ */}
        {/* USER                                                             */}
        {/* ================================================================ */}

        <div className="border-b border-white/[0.07] px-5 py-4">
          <UserProfile user={user} />
        </div>

        {/* ================================================================ */}
        {/* NAVIGATION                                                       */}
        {/* ================================================================ */}

        <SidebarNavigation
          items={filteredMenu}
          pathname={pathname}
        />

        {/* ================================================================ */}
        {/* LOGOUT                                                           */}
        {/* ================================================================ */}

        <div className="border-t border-white/[0.07] pt-3">
          <LogoutButton onLogout={logout} />
        </div>
      </aside>

      {/* ================================================================== */}
      {/* MOBILE HEADER                                                      */}
      {/* ================================================================== */}

      <div className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center border-b border-white/[0.07] bg-[#0b1326]/95 px-4 backdrop-blur-xl md:hidden">
        <Sheet
          open={mobileOpen}
          onOpenChange={setMobileOpen}
        >
          {/* Mobile menu trigger */}
          <SheetTrigger
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-lg
              text-white/60
              transition-colors
              hover:bg-white/[0.06]
              hover:text-white
            "
            aria-label="Open navigation menu"
          >
            <Menu size={20} />
          </SheetTrigger>

          {/* Mobile brand */}
          <div className="ml-3">
            <p className="text-sm font-bold text-white">
              Lens
            </p>

            <p className="text-[8px] uppercase tracking-[0.15em] text-white/25">
              Coaching
            </p>
          </div>

          {/* ============================================================ */}
          {/* MOBILE SHEET                                                 */}
          {/* ============================================================ */}

          <SheetContent
            side="left"
            className="
              w-[min(86vw,320px)]
              border-r
              border-white/[0.08]
              bg-[#0b1326]
              p-0
              text-white
            "
          >
            <div className="flex h-full flex-col">
              {/* Brand */}
              <div className="flex items-center border-b border-white/[0.07]">
                <div className="flex-1">
                  <SidebarBrand />
                </div>

                <SheetClose
                  className="
                    mr-4
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-lg
                    text-white/40
                    transition-colors
                    hover:bg-white/[0.06]
                    hover:text-white
                  "
                  aria-label="Close navigation menu"
                >
                  <X size={17} />
                </SheetClose>
              </div>

              {/* User */}
              <div className="border-b border-white/[0.07] px-5 py-4">
                <UserProfile
                  user={user}
                  mobile
                />
              </div>

              {/* Navigation */}
              <SidebarNavigation
                items={filteredMenu}
                pathname={pathname}
                mobile
                onNavigate={() =>
                  setMobileOpen(false)
                }
              />

              {/* Logout */}
              <div className="border-t border-white/[0.07] pt-3">
                <LogoutButton
                  onLogout={logout}
                />
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Mobile page title */}
        <div className="ml-auto max-w-[160px] truncate text-xs font-medium capitalize text-white/40">
          {pathname === "/dashboard"
            ? "Overview"
            : pathname
                .split("/")
                .filter(Boolean)
                .pop()
                ?.replace(/-/g, " ")}
        </div>
      </div>

      {/* Mobile top spacing */}
      <div className="h-16 md:hidden" />
    </>
  );
}
