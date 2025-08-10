import authConfig from '@/auth.config';
import NextAuth from 'next-auth';

import { LOGIN_ROUTE, DEFAULT_REDIRECT_ROUTE, apiAuthPrefix, authRoutes, publicRoutes } from '@/routes';

// Use auth config compatible the edge
const { auth } = NextAuth(authConfig);

export default auth((req) => {
    const { nextUrl } = req;

    const isLoggedIn = !!req.auth;

    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
    const isAuthRoute = authRoutes.includes(nextUrl.pathname);

    if (isApiAuthRoute) {
        return null; // No action -> Allow access
    }

    if (isAuthRoute) {
        if (isLoggedIn) {
            // Redirect to /home
            return Response.redirect(new URL(DEFAULT_REDIRECT_ROUTE, nextUrl));
        }
        // Allow access
        return null;
    }

    // Not public and not logged in? -> Redirect to login
    if (!isPublicRoute && !isLoggedIn) {
        return Response.redirect(new URL(LOGIN_ROUTE, nextUrl));
    }

    return null;


});

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
