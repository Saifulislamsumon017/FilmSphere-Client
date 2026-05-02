import { NextRequest, NextResponse } from 'next/server';
import {
  getDefaultDashboardRoute,
  getRouteOwner,
  isAuthRoute,
  UserRole,
} from './lib/authUtils';
import { jwtUtils } from './lib/jwtUtils';
import { isTokenExpiringSoon } from './lib/tokenUtils';
import {
  getNewTokensWithRefreshToken,
  getUserInfo,
} from './services/auth/getusers.services';

async function refreshTokenMiddleware(refreshToken: string): Promise<boolean> {
  try {
    return await getNewTokensWithRefreshToken(refreshToken);
  } catch (error) {
    console.error('Refresh token error:', error);
    return false;
  }
}

export async function proxy(request: NextRequest) {
  try {
    const { pathname, search } = request.nextUrl;
    const fullPath = `${pathname}${search}`;

    const accessToken = request.cookies.get('accessToken')?.value;
    const refreshToken = request.cookies.get('refreshToken')?.value;

    const routeOwner = getRouteOwner(pathname);
    const isAuth = isAuthRoute(pathname);

    // ===============================
    // PUBLIC ROUTES
    // ===============================
    if (pathname === '/verify-email') {
      return NextResponse.next();
    }

    if (pathname === '/reset-password') {
      const email = request.nextUrl.searchParams.get('email');
      if (email) return NextResponse.next();
    }

    if (routeOwner === null) {
      return NextResponse.next();
    }

    // ===============================
    // NO TOKEN → LOGIN
    // ===============================
    if (!accessToken) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', fullPath);
      return NextResponse.redirect(loginUrl);
    }

    // ===============================
    // VERIFY TOKEN (SAFE)
    // ===============================
    const decoded = jwtUtils.verifyToken(
      accessToken,
      process.env.JWT_ACCESS_SECRET as string,
    );

    if (!decoded?.success || !decoded.data) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', fullPath);
      return NextResponse.redirect(loginUrl);
    }

    const userRole = decoded.data.role as UserRole;

    // ===============================
    // REFRESH TOKEN
    // ===============================
    if (refreshToken && (await isTokenExpiringSoon(accessToken))) {
      await refreshTokenMiddleware(refreshToken);
    }

    // ===============================
    // BLOCK AUTH ROUTES IF LOGGED IN
    // ===============================
    if (
      isAuth &&
      pathname !== '/verify-email' &&
      pathname !== '/reset-password'
    ) {
      return NextResponse.redirect(
        new URL(getDefaultDashboardRoute(userRole), request.url),
      );
    }

    // ===============================
    // USER INFO
    // ===============================
    const userInfo = await getUserInfo();

    if (userInfo) {
      // EMAIL VERIFY FLOW
      if (!userInfo.emailVerified) {
        if (pathname !== '/verify-email') {
          const url = new URL('/verify-email', request.url);
          url.searchParams.set('email', userInfo.email);
          return NextResponse.redirect(url);
        }
        return NextResponse.next();
      }

      if (pathname === '/verify-email') {
        return NextResponse.redirect(
          new URL(getDefaultDashboardRoute(userRole), request.url),
        );
      }

      // PASSWORD CHANGE FLOW
      if (userInfo.needPasswordChange) {
        if (pathname !== '/reset-password') {
          const url = new URL('/reset-password', request.url);
          url.searchParams.set('email', userInfo.email);
          return NextResponse.redirect(url);
        }
        return NextResponse.next();
      }

      if (!userInfo.needPasswordChange && pathname === '/reset-password') {
        return NextResponse.redirect(
          new URL(getDefaultDashboardRoute(userRole), request.url),
        );
      }
    }

    // ===============================
    // ROLE BASED ACCESS
    // ===============================
    if (routeOwner && routeOwner !== 'COMMON') {
      if (routeOwner !== userRole) {
        return NextResponse.redirect(
          new URL(getDefaultDashboardRoute(userRole), request.url),
        );
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.well-known).*)',
  ],
};
