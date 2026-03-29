// middleware.ts
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const roleBasedRoutes: Record<string, string[]> = {
  "/dashboard": ["admin", "teacher", "student"],
  "/dashboard/course-management": ["teacher", "student"],
  "/dashboard/schedule": ["teacher", "student"],
  "/dashboard/profile": ["admin", "teacher", "student"],
  "/admin": ["admin"],
  "/teacher": ["teacher"],
  "/student": ["student"],
};

export async function proxy(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const pathname = req.nextUrl.pathname;

  // Check if route is protected
  const routeRoles = Object.keys(roleBasedRoutes).find(route => pathname.startsWith(route));

  if (!token && routeRoles) {
    // Not logged in → redirect to login
    return NextResponse.redirect(new URL(`/login?callbackUrl=${pathname}`, req.url));
  }

  if (token && routeRoles) {
    const role = (token as any).role;
    if (!roleBasedRoutes[routeRoles].includes(role)) {
      // User role not allowed → redirect to dashboard or fallback
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/teacher/:path*",
    "/student/:path*",
  ],
};