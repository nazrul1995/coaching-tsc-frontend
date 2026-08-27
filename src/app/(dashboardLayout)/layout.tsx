"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { Separator } from "@/components/ui/separator";
import { AppSidebar } from "@/components/dashboard/AppSidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const pathname = usePathname();

  // Desktop sidebar default open
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const segments = pathname.split("/").filter(Boolean);

  const formatSegment = (segment: string) =>
    segment
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

  const pageTitle =
    segments.length > 0
      ? formatSegment(segments[segments.length - 1])
      : "Overview";

  return (
    <div className="flex min-h-screen w-full overflow-x-hidden bg-[#0b1326] text-white">
      {/* =========================================================
          SIDEBAR
      ========================================================= */}

      <AppSidebar
        open={sidebarOpen}
        onOpenChange={setSidebarOpen}
      />

      {/* =========================================================
          MAIN APPLICATION AREA
      ========================================================= */}

      <div
        className={`
          flex
          min-h-screen
          min-w-0
          flex-1
          flex-col
          transition-[margin]
          duration-300
          ease-in-out

          ${sidebarOpen ? "md:ml-64" : "md:ml-0"}
        `}
      >
        {/* =======================================================
            TOP HEADER
        ======================================================= */}

        <header
          className="
            sticky
            top-0
            z-40
            flex
            h-14
            w-full
            shrink-0
            items-center
            border-b
            border-white/[0.07]
            bg-[#0b1326]/95
            px-3
            backdrop-blur-xl

            sm:h-16
            sm:px-4

            md:px-6
          "
        >
          <div className="flex min-w-0 flex-1 items-center gap-3">
            {/* ===================================================
                DESKTOP SIDEBAR TOGGLE
            =================================================== */}

            <button
              type="button"
              aria-label={
                sidebarOpen
                  ? "Close sidebar"
                  : "Open sidebar"
              }
              onClick={() => setSidebarOpen((prev) => !prev)}
              className="
                flex
                size-9
                shrink-0
                items-center
                justify-center
                rounded-lg
                text-white/50
                transition-colors
                hover:bg-white/[0.06]
                hover:text-white

                md:size-10
              "
            >
              <Menu className="size-5" />
            </button>

            {/* ===================================================
                BREADCRUMB
            =================================================== */}

            <div className="min-w-0 flex-1 overflow-hidden">
              <Breadcrumb>
                <BreadcrumbList
                  className="
                    flex
                    min-w-0
                    flex-nowrap
                    overflow-hidden
                    text-xs
                    text-white/50

                    sm:text-sm
                  "
                >
                  {segments.map((segment, index) => {
                    const isLast =
                      index === segments.length - 1;

                    const href =
                      "/" +
                      segments.slice(0, index + 1).join("/");

                    return (
                      <React.Fragment key={href}>
                        <BreadcrumbItem className="min-w-0 shrink-0">
                          {isLast ? (
                            <BreadcrumbPage
                              className="
                                max-w-[140px]
                                truncate
                                font-semibold
                                text-white

                                sm:max-w-[220px]

                                md:max-w-[300px]
                              "
                            >
                              {formatSegment(segment)}
                            </BreadcrumbPage>
                          ) : (
                            <BreadcrumbLink
                              href={href}
                              className="
                                max-w-[90px]
                                truncate
                                transition-colors
                                hover:text-white

                                sm:max-w-[150px]
                              "
                            >
                              {formatSegment(segment)}
                            </BreadcrumbLink>
                          )}
                        </BreadcrumbItem>

                        {!isLast && (
                          <BreadcrumbSeparator className="shrink-0 text-white/15" />
                        )}
                      </React.Fragment>
                    );
                  })}
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            {/* ===================================================
                MOBILE PAGE TITLE
            =================================================== */}

            <h1
              className="
                hidden
                max-w-[130px]
                truncate
                text-sm
                font-bold
                text-[#adc6ff]

                xs:block

                sm:max-w-[180px]
                sm:text-base

                md:hidden
              "
            >
              {pageTitle}
            </h1>
          </div>

          {/* =====================================================
              HEADER RIGHT
          ===================================================== */}

          <div className="ml-2 flex shrink-0 items-center gap-2 sm:gap-4">
            <Separator
              orientation="vertical"
              className="hidden h-6 bg-white/10 sm:block"
            />

            <div className="hidden items-center gap-2 text-white/70 sm:flex">
              {/* Notification / profile / actions */}
            </div>
          </div>
        </header>

        {/* =======================================================
            MAIN CONTENT
        ======================================================= */}

        <main
          className="
            min-w-0
            flex-1
            overflow-x-hidden
            bg-[#0b1326]

            px-3
            py-4

            sm:px-4
            sm:py-5

            md:px-6
            md:py-6

            lg:px-8
            lg:py-8

            xl:px-10
          "
        >
          <div className="mx-auto w-full min-w-0 max-w-[1800px]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
