'use client';

import React from "react";
import { usePathname, useRouter } from "next/navigation";
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

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();

  const segments = pathname.split("/").filter(Boolean);
  const formatSegment = (segment: string) =>
    segment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const pageTitle = segments.length > 0 ? formatSegment(segments[segments.length - 1]) : "Overview";

  return (
    <div className="flex min-h-screen bg-[#0b1326] text-white">
      <AppSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:ml-72">
        
        {/* Improved Header - Glassmorphic + Better Spacing */}
        <header className="h-16 border-b border-white/10 bg-white/5 backdrop-blur-2xl sticky top-0 z-40 px-6 flex items-center">
          <div className="flex-1 flex items-center gap-6">
            {/* Breadcrumb - More elegant */}
            <Breadcrumb>
              <BreadcrumbList className="text-sm">
                {segments.map((segment, index) => {
                  const isLast = index === segments.length - 1;
                  const href = "/" + segments.slice(0, index + 1).join("/");

                  return (
                    <BreadcrumbItem key={href}>
                      {isLast ? (
                        <BreadcrumbPage className="text-[#adc6ff] font-semibold">
                          {formatSegment(segment)}
                        </BreadcrumbPage>
                      ) : (
                        <>
                          <BreadcrumbLink
                            href={href}
                            onClick={(e) => {
                              e.preventDefault();
                              router.push(href);
                            }}
                            className="hover:text-white transition-colors"
                          >
                            {formatSegment(segment)}
                          </BreadcrumbLink>
                          <BreadcrumbSeparator className="text-white/30" />
                        </>
                      )}
                    </BreadcrumbItem>
                  );
                })}
              </BreadcrumbList>
            </Breadcrumb>

            {/* Mobile Page Title */}
            <h1 className="md:hidden text-xl font-bold text-[#adc6ff]">{pageTitle}</h1>
          </div>

          {/* Right side - Optional future notifications / quick actions */}
          <div className="flex items-center gap-4 text-white/70">
            <Separator orientation="vertical" className="h-6" />
            {/* You can add notification bell or user avatar here later */}
          </div>
        </header>

        {/* Main Content - Matches your Teacher Form perfectly */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 bg-[#0b1326]">
          {children}
        </main>
      </div>
    </div>
  );
}