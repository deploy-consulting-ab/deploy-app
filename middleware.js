import {
    LOGIN_ROUTE,
    HOME_ROUTE,
    API_AUTH_PREFIX,
    AUTH_ROUTES,
    PUBLIC_ROUTES,
    HOLIDAYS_ROUTE,
    OCCUPANCY_ROUTE,
    ASSIGNMENTS_ROUTE,
    OPPORTUNITIES_ROUTE,
    ADMIN_ROUTE,
} from '@/menus/routes';

import { NextResponse } from 'next/server';
import { hasPermission } from '@/lib/permissions';

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
        return NextResponse.next(); // No action -> Allow access
    }

    // Auth routes
    if (isAuthRoute) {
        if (isLoggedIn) {
            return Response.redirect(new URL(HOME_ROUTE, nextUrl));
        }
        // Allow access
        return NextResponse.next();
    }

    // Not public and not logged in? -> Redirect to login
    if (!isPublicRoute && !isLoggedIn) {
        let callbackUrl = nextUrl.pathname;

        if (nextUrl.search) {
            callbackUrl += nextUrl.search;
        }

        const encodedCallbackUrl = encodeURIComponent(callbackUrl);

        return Response.redirect(
            new URL(`${LOGIN_ROUTE}?callbackUrl=${encodedCallbackUrl}`, nextUrl)
        );
    }

    return handleLoggedInUsers(nextUrl, user?.role);
});

const handleLoggedInUsers = (nextUrl, role) => {
    const pathname = nextUrl.pathname;

    if (!pathname) {
        return Response.redirect(new URL(HOME_ROUTE, nextUrl));
    }

    if (pathname.includes(HOME_ROUTE)) {
        if (hasPermission(role, 'viewHome')) {
            return NextResponse.next();
        }
        return Response.redirect(new URL(HOME_ROUTE, nextUrl));
    }

    if (pathname.includes(HOLIDAYS_ROUTE)) {
        if (hasPermission(role, 'viewHolidays')) {
            return NextResponse.next();
        }
        return Response.redirect(new URL(HOME_ROUTE, nextUrl));
    }

    if (pathname.includes(OCCUPANCY_ROUTE)) {
        if (hasPermission(role, 'viewOccupancy')) {
            return NextResponse.next();
        }
        return Response.redirect(new URL(HOME_ROUTE, nextUrl));
    }

    if (pathname.includes(ASSIGNMENTS_ROUTE)) {
        if (hasPermission(role, 'viewAssignments')) {
            return NextResponse.next();
        }
        return Response.redirect(new URL(HOME_ROUTE, nextUrl));
    }

    if (pathname.includes(OPPORTUNITIES_ROUTE)) {
        if (hasPermission(role, 'viewOpportunities')) {
            return NextResponse.next();
        }
        return Response.redirect(new URL(HOME_ROUTE, nextUrl));
    }

    if (pathname.includes(ADMIN_ROUTE)) {
        if (hasPermission(role, 'viewAdmin')) {
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
