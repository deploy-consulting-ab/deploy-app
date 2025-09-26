export const LOGIN_ROUTE = '/auth/login';
export const HOME_ROUTE = '/home';
/**
 * Routes accessible to the public do not requiere authentication
 */
export const PUBLIC_ROUTES = ['/'];

/**
 * Routes used for authentication they will redirect the user after authentication to /home
 */
export const AUTH_ROUTES = [LOGIN_ROUTE];

/**
 * Prefix for API authentication routes routes that start with this prefix are used for API Authentication
 */
export const API_AUTH_PREFIX = '/api/auth';

/**
 * Default redirecting path
 */
export const HOLIDAYS_ROUTE = `${HOME_ROUTE}/holidays`;
export const OCCUPANCY_ROUTE = `${HOME_ROUTE}/occupancy`;
export const ASSIGNMENTS_ROUTE = `${HOME_ROUTE}/assignments`;
export const OPPORTUNITIES_ROUTE = `${HOME_ROUTE}/opportunities`;
export const ADMIN_ROUTE = `${HOME_ROUTE}/admin`;

export const PROTECTED_ROUTES = [
    { path : HOME_ROUTE, permission : 'Home:View' },
    { path : HOLIDAYS_ROUTE, permission : 'Holidays:View' },
    { path : OCCUPANCY_ROUTE, permission : 'Occupancy:View' },
    { path : ASSIGNMENTS_ROUTE, permission : 'Assignments:View' },
    { path : OPPORTUNITIES_ROUTE, permission : 'Opportunities:View' },
    { path : ADMIN_ROUTE, permission : 'Admin:View' },
]
