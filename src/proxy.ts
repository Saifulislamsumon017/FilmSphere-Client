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
    const pathWithQuery = `${pathname}${search}`;

    const accessToken = request.cookies.get('accessToken')?.value;
    const refreshToken = request.cookies.get('refreshToken')?.value;

    // ===============================
    // Decode token
    // ===============================
    const decoded = accessToken
      ? jwtUtils.verifyToken(
          accessToken,
          process.env.JWT_ACCESS_SECRET as string,
        )
      : null;

    const isValidAccessToken = !!decoded?.success;

    const userRole: UserRole | null = decoded?.data?.role || null;

    const routeOwner = getRouteOwner(pathname);
    const isAuth = isAuthRoute(pathname);

    // ===============================
    // PUBLIC ROUTE
    // ===============================
    if (routeOwner === null) {
      return NextResponse.next();
    }

    // ===============================
    // NO TOKEN → LOGIN
    // ===============================
    if (!accessToken || !isValidAccessToken) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathWithQuery);

      return NextResponse.redirect(loginUrl);
    }

    // ===============================
    // REFRESH TOKEN
    // ===============================
    if (refreshToken && (await isTokenExpiringSoon(accessToken))) {
      await refreshTokenMiddleware(refreshToken);
    }

    // ===============================
    // AUTH PAGE BLOCK
    // ===============================
    if (
      isAuth &&
      pathname !== '/verify-email' &&
      pathname !== '/reset-password'
    ) {
      return NextResponse.redirect(
        new URL(getDefaultDashboardRoute(userRole as UserRole), request.url),
      );
    }

    // ===============================
    // RESET PASSWORD
    // ===============================
    if (pathname === '/reset-password') {
      const email = request.nextUrl.searchParams.get('email');

      if (!email) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathWithQuery);
        return NextResponse.redirect(loginUrl);
      }

      return NextResponse.next();
    }

    // ===============================
    // EMAIL VERIFY FLOW
    // ===============================
    const userInfo = await getUserInfo();

    if (userInfo) {
      if (!userInfo.emailVerified) {
        if (pathname !== '/verify-email') {
          const verifyUrl = new URL('/verify-email', request.url);
          verifyUrl.searchParams.set('email', userInfo.email);
          return NextResponse.redirect(verifyUrl);
        }
        return NextResponse.next();
      }

      if (pathname === '/verify-email') {
        return NextResponse.redirect(
          new URL(getDefaultDashboardRoute(userRole as UserRole), request.url),
        );
      }
    }

    // ===============================
    // COMMON ROUTES
    // ===============================
    if (routeOwner === 'COMMON') {
      return NextResponse.next();
    }

    // ===============================
    // ROLE CHECK (ONLY USER + ADMIN)
    // ===============================
    if (routeOwner !== userRole) {
      return NextResponse.redirect(
        new URL(getDefaultDashboardRoute(userRole as UserRole), request.url),
      );
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
