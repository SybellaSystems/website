import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { ADMIN_ACCESS_COOKIE } from '@/lib/auth/cookies';

// Security middleware for all routes
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const token = request.cookies.get(ADMIN_ACCESS_COOKIE)?.value;

  // ── Debug logs (remove after confirming fix) ──────────────────────────────
  if (process.env.NODE_ENV === 'development') {
    console.log('[MIDDLEWARE] PATH:', pathname);
    console.log('[MIDDLEWARE] TOKEN:', token);
  }

  // ── Token validation: treat "undefined"/"null"/short strings as no token ──
  const isAuthenticated =
    !!token &&
    token !== 'undefined' &&
    token !== 'null' &&
    token.trim().length > 10;

  // ── Protect /admin routes ─────────────────────────────────────────────────
  if (pathname.startsWith('/admin') && !isAuthenticated) {
    const signInUrl = new URL('/signin', request.url);
    signInUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(signInUrl);
  }

  // ── Prevent authenticated users from re-entering /signin ─────────────────
  if (pathname.startsWith('/signin') && isAuthenticated) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  // ── Attach security headers to all other responses ────────────────────────
  const response = NextResponse.next();

  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

  // Content Security Policy (uncomment when ready for production)
  // const csp = [
  //   "default-src 'self'",
  //   "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  //   "font-src 'self' https://fonts.gstatic.com",
  //   "img-src 'self' data: https:",
  //   "script-src 'self'",
  //   "connect-src 'self'",
  //   "frame-src 'none'",
  //   "object-src 'none'",
  //   "base-uri 'self'",
  //   "form-action 'self'",
  //   "frame-ancestors 'none'"
  // ].join('; ');
  // response.headers.set('Content-Security-Policy', csp);

  // ── Security event logging ────────────────────────────────────────────────
  if (process.env.NODE_ENV === 'development') {
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    console.log(`[SECURITY] Request from ${ip} to ${pathname} - ${userAgent}`);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimisation)
     * - favicon.ico
     * - any file with an extension (fonts, images, svgs, etc.)
     *
     * The `.*\\..*` part is the key addition — it stops middleware
     * from running on static assets, which previously contributed
     * to the redirect loop.
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
}