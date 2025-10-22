import {
    VIEW_HOME_PERMISSION,
    VIEW_HOLIDAYS_PERMISSION,
    VIEW_OCCUPANCY_PERMISSION,
    VIEW_ASSIGNMENTS_PERMISSION,
    VIEW_OPPORTUNITIES_PERMISSION,
    VIEW_SETUP_PERMISSION,
} from '@/lib/system-permissions';

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

export const SETUP_ROUTE = `/setup`;
export const USERS_ROUTE = `${SETUP_ROUTE}/users`;
export const PROFILES_ROUTE = `${SETUP_ROUTE}/profiles`;
export const PERMISSION_SETS_ROUTE = `${SETUP_ROUTE}/permission-sets`;
export const SYSTEM_PERMISSIONS_ROUTE = `${SETUP_ROUTE}/system-permissions`;

export const PROTECTED_ROUTES = [
    { path : HOLIDAYS_ROUTE, systemPermission : VIEW_HOLIDAYS_PERMISSION },
    { path : OCCUPANCY_ROUTE, systemPermission : VIEW_OCCUPANCY_PERMISSION },
    { path : ASSIGNMENTS_ROUTE, systemPermission : VIEW_ASSIGNMENTS_PERMISSION },
    { path : OPPORTUNITIES_ROUTE, systemPermission : VIEW_OPPORTUNITIES_PERMISSION },
    { path : USERS_ROUTE, systemPermission : VIEW_SETUP_PERMISSION }, // TO CHANGE TO VIEW_USERS_PERMISSION
    { path : PROFILES_ROUTE, systemPermission : VIEW_SETUP_PERMISSION }, // TO CHANGE TO VIEW_PROFILES_PERMISSION
    { path : PERMISSION_SETS_ROUTE, systemPermission : VIEW_SETUP_PERMISSION }, // TO CHANGE TO VIEW_PERMISSION_SETS_PERMISSION
    { path : SYSTEM_PERMISSIONS_ROUTE, systemPermission : VIEW_SETUP_PERMISSION }, // TO CHANGE TO VIEW_SYSTEM_PERMISSIONS_PERMISSION
    { path : SETUP_ROUTE, systemPermission : VIEW_SETUP_PERMISSION },
    { path : HOME_ROUTE, systemPermission : VIEW_HOME_PERMISSION },
]
