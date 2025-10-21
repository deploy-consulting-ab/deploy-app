import {
    LOGIN_ROUTE,
    HOME_ROUTE,
    API_AUTH_PREFIX,
    AUTH_ROUTES,
    PUBLIC_ROUTES,
    PROTECTED_ROUTES,
} from '@/menus/routes';

import { NextResponse } from 'next/server';

// Import the configured auth instance instead of creating a new one
import { auth } from '@/auth';

export default auth((req) => {
    const { nextUrl } = req;

    const isLoggedIn = !!req.auth;
    const user = req.auth?.user;

    const isApiAuthRoute = nextUrl.pathname.startsWith(API_AUTH_PREFIX);
    const isPublicRoute = PUBLIC_ROUTES.includes(nextUrl.pathname);
    const isAuthRoute = AUTH_ROUTES.includes(nextUrl.pathname);

    // API auth routes
    if (isApiAuthRoute) {
        return NextResponse.next();
    }

    // Auth routes
    if (isAuthRoute) {
        if (isLoggedIn) {
            return Response.redirect(new URL(HOME_ROUTE, nextUrl));
        }
        return NextResponse.next();
    }

    // Check if user is not logged in or not active
    if (!isPublicRoute && (!isLoggedIn || !user?.isActive)) {
        let callbackUrl = nextUrl.pathname;

        if (nextUrl.search) {
            callbackUrl += nextUrl.search;
        }

        const encodedCallbackUrl = encodeURIComponent(callbackUrl);

        return Response.redirect(
            new URL(`${LOGIN_ROUTE}?callbackUrl=${encodedCallbackUrl}`, nextUrl)
        );
    }

    const allPermissions = new Set(user?.permissions);
    return handleLoggedInUsers(nextUrl, allPermissions);
});

const handleLoggedInUsers = (nextUrl, allPermissions) => {
    const pathname = nextUrl.pathname;

    if (!pathname) {
        return Response.redirect(new URL(HOME_ROUTE, nextUrl));
    }

    const protectedRoute = PROTECTED_ROUTES.find(route => pathname.includes(route.path));

    if (protectedRoute) {
        if (allPermissions.has(protectedRoute.permission)) {
            return NextResponse.next();
        }
        return Response.redirect(new URL(HOME_ROUTE, nextUrl));
    }

    return Response.redirect(new URL(HOME_ROUTE, nextUrl));
};

/**
 * Every in the regex will invoke the middleware
 */
export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|mp4|mov|webm)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};
