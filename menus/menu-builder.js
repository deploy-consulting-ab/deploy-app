import { MENU_ITEMS_MAP, SETUP_MENU_ITEMS_MAP } from '@/menus/menus';

// Cache for storing generated menus by profile
const menuCache = new Map();
const setupMenuCache = new Map();

/**
 * Generates a menu based on user system permissions
 * @param {Object} systemPermissions - Object containing user system permissions
 * @returns {Array} Array of menu items the user has access to
 */
export function buildMenu(systemPermissions) {
    const menu = [];

    for (const [key, menuItem] of Object.entries(MENU_ITEMS_MAP)) {
        if (systemPermissions.has(menuItem.systemPermission)) {
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
 * Generates a menu based on user system permissions
 * @param {Object} systemPermissions - Object containing user system permissions
 * @returns {Array} Array of menu items the user has access to
 */
export function buildSetupMenu(systemPermissions) {
    const menu = [];

    for (const [key, menuItem] of Object.entries(SETUP_MENU_ITEMS_MAP)) {
        if (systemPermissions.has(menuItem.systemPermission)) {
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
 * Gets menu for a given location
 * @param {string} location - The location of the menu
 * @param {string} userProfile - The profile of the user
 * @param {Object} userSystemPermissions - The system permissions configuration object
 * @returns {Array} Array of menu items for the location
 */
export function getMenuForLocation(location, userProfile, userSystemPermissions) {
    if (location === 'setup') {
        return getSetupMenuForProfile(userProfile, userSystemPermissions);
    } else {
        return getMenuForProfile(userProfile, userSystemPermissions);
    }
}
/**
 * Gets or generates a menu for a user profile, using caching
 * @param {string} userProfile - The profile of the user
 * @param {Object} userSystemPermissions - The system permissions configuration object
 * @returns {Array} Array of menu items for the user
 */
export function getMenuForProfile(userProfile, userSystemPermissions) {
    // If no profile or system permissions, return empty menu
    if (!userSystemPermissions) {
        return [];
    }

    // Check cache first
    if (menuCache.has(userProfile)) {
        return menuCache.get(userProfile);
    }

    // Generate menu based on profile system permissions
    const menu = buildMenu(userSystemPermissions);

    // Cache the generated menu
    menuCache.set(userProfile, menu);

    return menu;
}

/**
 * Gets or generates a menu for a user profile, using caching
 * @param {string} userProfile - The profile of the user
 * @param {Object} userSystemPermissions - The system permissions configuration object
 * @returns {Array} Array of menu items for the user
 */
export function getSetupMenuForProfile(userProfile, userSystemPermissions) {
    // If no profile or system permissions, return empty menu
    if (!userSystemPermissions) {
        return [];
    }

    // Check cache first
    if (setupMenuCache.has(userProfile)) {
        return setupMenuCache.get(userProfile);
    }

    // Generate menu based on profile system permissions
    const menu = buildSetupMenu(userSystemPermissions);

    // Cache the generated menu
    setupMenuCache.set(userProfile, menu);

    return menu;
}

/**
 * Clears the menu cache
 * Useful when system permissions change and menus need to be regenerated
 */
export function clearMenuCache() {
    menuCache.clear();
    setupMenuCache.clear();
}
