// app/middleware.ts
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from './lib/auth';
import { getUserByUsername } from './lib/db';

export default async function middleware(req: NextRequest) {
  const cookies = req.cookies;

  const sessionToken =
    cookies.get('authjs.session-token') ||
    cookies.get('__Secure-authjs.session-token');

  if (!sessionToken) {
    const loginUrl = new URL('/login', req.url);
    return NextResponse.redirect(loginUrl);
  } else {
    try {
      const sessionResponse = await fetch(
        `${req.nextUrl.origin}/api/auth/session`,
        {
          headers: {
            cookie: req.headers.get('cookie') || '' // Pass cookies to the API route
          }
        }
      );
      if (sessionResponse.status !== 200) {
        throw new Error('Session not found');
      }
    } catch (error) {
      console.error(error);
      const response = NextResponse.redirect(new URL('/login', req.url));
      response.cookies.set('authjs.session-token', '', {
        expires: new Date(0)
      });
      return response;
    }
  }

  // Allow request to proceed if authenticated
  return NextResponse.next();
}

// Define paths that should be protected
export const config = {
  matcher: ['/', '/models/:path*', '/agents/:path*', '/enter'] // Specify protected paths
};
