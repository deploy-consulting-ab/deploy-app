import { MENU_ITEMS_MAP } from '@/menus/menus';

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
