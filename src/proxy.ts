import { NextRequest, NextResponse } from 'next/server';
import {
  getDefaultDashboardRoute,
  getRouteOwner,
  isAuthRoute,
  UserRole,
} from './lib/authUtils';

const refreshTokenMiddleware = async (
  refreshToken: string,
): Promise<boolean> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/refresh-token`,
      {
        method: 'POST',
        headers: {
          Authorization: refreshToken,
        },
      },
    );

    if (!response.ok) {
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error refreshing token in middleware:', error);

    return false;
  }
};

export const proxy = async (request: NextRequest) => {
  try {
    const { pathname } = request.nextUrl;

    const pathWithQuery = `${pathname}${request.nextUrl.search}`;

    const accessToken = request.cookies.get('accessToken')?.value;

    const refreshToken = request.cookies.get('refreshToken')?.value;

    let userRole: UserRole | null = null;

    let isValidAccessToken = false;

    if (accessToken) {
      try {
        const payload = JSON.parse(atob(accessToken.split('.')[1]));

        userRole = payload?.role || null;

        isValidAccessToken = true;
      } catch {
        userRole = null;
        isValidAccessToken = false;
      }
    }

    const routeOwner = getRouteOwner(pathname);

    const isAuth = isAuthRoute(pathname);

    if (isValidAccessToken && refreshToken) {
      const requestHeaders = new Headers(request.headers);

      try {
        const refreshed = await refreshTokenMiddleware(refreshToken);

        if (refreshed) {
          requestHeaders.set('x-token-refreshed', '1');
        }

        return NextResponse.next({
          request: {
            headers: requestHeaders,
          },
        });
      } catch (error) {
        console.error('Error refreshing token:', error);
      }
    }

    if (
      isAuth &&
      isValidAccessToken &&
      pathname !== '/verify-email' &&
      pathname !== '/reset-password'
    ) {
      return NextResponse.redirect(
        new URL(getDefaultDashboardRoute(userRole as UserRole), request.url),
      );
    }

    if (pathname === '/reset-password') {
      const email = request.nextUrl.searchParams.get('email');

      if (email) {
        return NextResponse.next();
      }

      const loginUrl = new URL('/login', request.url);

      loginUrl.searchParams.set('redirect', pathWithQuery);

      return NextResponse.redirect(loginUrl);
    }

    if (routeOwner === null) {
      return NextResponse.next();
    }

    if (!accessToken || !isValidAccessToken) {
      const loginUrl = new URL('/login', request.url);

      loginUrl.searchParams.set('redirect', pathWithQuery);

      return NextResponse.redirect(loginUrl);
    }

    if (routeOwner === 'COMMON') {
      return NextResponse.next();
    }

    if (routeOwner === 'ADMIN' || routeOwner === 'USER') {
      if (routeOwner !== userRole) {
        return NextResponse.redirect(
          new URL(getDefaultDashboardRoute(userRole as UserRole), request.url),
        );
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Error in proxy middleware:', error);

    return NextResponse.next();
  }
};

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
