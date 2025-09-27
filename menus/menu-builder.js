import { Home, Calendar, Percent, ClipboardList, TrendingUp, Shield } from 'lucide-react';
import {
    HOME_ROUTE,
    HOLIDAYS_ROUTE,
    OCCUPANCY_ROUTE,
    ASSIGNMENTS_ROUTE,
    OPPORTUNITIES_ROUTE,
    ADMIN_ROUTE,
} from '@/menus/routes';

// Map of menu items with their required permissions and configurations
export const MENU_ITEMS_MAP = {
    home: {
        title: 'Home',
        url: HOME_ROUTE,
        icon: Home,
        permission: 'Home:View',
    },
    holidays: {
        title: 'Holidays',
        url: HOLIDAYS_ROUTE,
        icon: Calendar,
        permission: 'Holidays:View',
    },
    occupancy: {
        title: 'Occupancy',
        url: OCCUPANCY_ROUTE,
        icon: Percent,
        permission: 'Occupancy:View',
    },
    assignments: {
        title: 'Assignments',
        url: ASSIGNMENTS_ROUTE,
        icon: ClipboardList,
        permission: 'Assignments:View',
    },
    opportunities: {
        title: 'Opportunities',
        url: OPPORTUNITIES_ROUTE,
        icon: TrendingUp,
        permission: 'Opportunities:View',
    },
    admin: {
        title: 'Admin',
        url: ADMIN_ROUTE,
        icon: Shield,
        permission: 'Admin:View',
    },
};

// Cache for storing generated menus by role
const menuCache = new Map();

/**
 * Generates a menu based on user permissions
 * @param {Object} permissions - Object containing user permissions
 * @returns {Array} Array of menu items the user has access to
 */
export function buildMenu(permissions) {
    const menu = [];
    
    for (const [key, menuItem] of Object.entries(MENU_ITEMS_MAP)) {
        if (permissions.has(menuItem.permission)) {
            menu.push({
                title: menuItem.title,
                url: menuItem.url,
                icon: menuItem.icon,
            });
        }
    }
    
    return menu;
}

/**
 * Gets or generates a menu for a user role, using caching
 * @param {string} userRole - The role of the user
 * @param {Object} rolePermissions - The permissions configuration object
 * @returns {Array} Array of menu items for the user
 */
export function getMenuForRole(userRole, userPermissions) {
    // If no role or permissions, return empty menu
    if (!userPermissions) {
        return [];
    }

    // Check cache first
    if (menuCache.has(userRole)) {
        return menuCache.get(userRole);
    }

    // Generate menu based on role permissions
    const menu = buildMenu(userPermissions);

    // Cache the generated menu
    menuCache.set(userRole, menu);

    return menu;
}

/**
 * Clears the menu cache
 * Useful when permissions change and menus need to be regenerated
 */
export function clearMenuCache() {
    menuCache.clear();
}
