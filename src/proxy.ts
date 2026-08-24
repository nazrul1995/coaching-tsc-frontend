import { NextRequest, NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const path = request.nextUrl.pathname;

  // Dashboard protected
  if (path.startsWith('/dashboard') && !token) {
    const loginUrl = new URL('/login', request.url);

    loginUrl.searchParams.set(
      'callbackUrl',
      path
    );

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
