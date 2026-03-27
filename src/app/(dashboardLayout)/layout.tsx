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
      <div className="flex-1 flex flex-col">
        <header className="flex h-16 items-center gap-2 border-b border-white/10 sticky top-0 bg-[#0b1326] z-50 px-4">
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              {segments.map((segment, index) => {
                const isLast = index === segments.length - 1;
                const href = "/" + segments.slice(0, index + 1).join("/");

                return (
                  <BreadcrumbItem key={href}>
                    {isLast ? (
                      <BreadcrumbPage>{formatSegment(segment)}</BreadcrumbPage>
                    ) : (
                      <>
                        <BreadcrumbLink
                          href={href}
                          onClick={(e) => {
                            e.preventDefault();
                            router.push(href);
                          }}
                        >
                          {formatSegment(segment)}
                        </BreadcrumbLink>
                        <BreadcrumbSeparator />
                      </>
                    )}
                  </BreadcrumbItem>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>

          <h1 className="ml-4 text-xl font-bold text-[#adc6ff] md:hidden">{pageTitle}</h1>
        </header>

        <main className="flex-1 overflow-y-auto p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}