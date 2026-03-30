// middleware.ts  (Next.js root — not inside /app or /pages)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const roleBasedRoutes: Record<string, string[]> = {
  "/dashboard": ["admin", "teacher", "student"],
  "/admin":     ["admin"],
  "/teacher":   ["teacher"],
  "/student":   ["student"],
};

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  console.log(`Middleware: Checking access for ${pathname}`);
  // Find the first protected prefix that matches
  const matchedRoute = Object.keys(roleBasedRoutes).find((r) =>
    pathname.startsWith(r)
  );

  console.log(`Matched route: ${matchedRoute}`);

  // Not a protected route → let it through
  if (!matchedRoute) return NextResponse.next();

  // Try the token from Authorization header OR a cookie named "token"
  const authHeader = req.headers.get("authorization") ?? "";
  console.log(`Authorization header: ${authHeader}`);
  const token =
    authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : req.cookies.get("token")?.value ?? null;
console.log(`Token: ${token}`)
  // No token → redirect to login, preserving the intended URL
  if (!token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      email: string;
      role: string;
    };

    const allowedRoles = roleBasedRoutes[matchedRoute];

    if (!allowedRoles.includes(decoded.role)) {
      // Authenticated but wrong role → send to their own dashboard
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // All good — forward the request
    return NextResponse.next();
  } catch {
    // Token expired or tampered → back to login
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }
}

// Tell Next.js which paths to run the middleware on
export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/teacher/:path*", "/student/:path*"],
};