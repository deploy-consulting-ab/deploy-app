/**
 * Routes accessible to the public do not requiere authentication
 */
export const publicRoutes = ['/'];

/**
 * Routes used for authentication they will redirect the user after authentication to /home
 */
export const authRoutes = ['/auth/login', '/auth/register'];

/**
 * Prefix for API authentication routes routes that start with this prefix are used for API Authentication
 */
export const apiAuthPrefix = '/api/auth';

/**
 * Default redirecting path
 */
export const DEFAULT_REDIRECT_ROUTE = '/home';
export const LOGIN_ROUTE = '/auth/login';