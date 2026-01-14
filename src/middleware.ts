import authConfig from '@/auth.config';
import NextAuth from 'next-auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const ADMIN_JWT_SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || 'admin-secret-key-change-in-production'
);

const { auth } = NextAuth(authConfig);

async function adminMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow access to login page and API routes
  if (pathname === '/admin/login' || pathname.startsWith('/api/admin/auth')) {
    return NextResponse.next();
  }

  // Check admin session
  const adminToken = request.cookies.get('admin-session')?.value;

  if (!adminToken) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  try {
    await jwtVerify(adminToken, ADMIN_JWT_SECRET);
    return NextResponse.next();
  } catch {
    // Invalid or expired token
    const response = NextResponse.redirect(new URL('/admin/login', request.url));
    response.cookies.delete('admin-session');
    return response;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin routes - use custom auth
  if (pathname.startsWith('/admin')) {
    return adminMiddleware(request);
  }

  // Regular user auth (existing NextAuth middleware)
  return auth(request as any);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.png|.jpg|.jpeg|favicon.ico).*)'],
};
