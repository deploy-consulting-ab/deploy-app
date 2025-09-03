export const ADMIN_ROLE = 'ADMIN';
export const CONSULTANT_ROLE = 'CONSULTANT';
export const SALES_ROLE = 'SALES';
export const MANAGEMENT_ROLE = 'MANAGEMENT';

import {
    ADMIN_ROLE_MENU,
    MANAGEMENT_ROLE_MENU,
    CONSULTANT_ROLE_MENU,
    SALES_ROLE_MENU,
} from '@/menus/sidebar-menus';

/**
 * Centralized permissions configuration for the application
 * This defines what each role can access and view
 */
export const ROLE_PERMISSIONS = {
    [ADMIN_ROLE]: {
        features: {
            viewHome: true,
            viewHolidays: true,
            viewOccupancy: true,
            viewAssignments: true,
            viewOpportunities: true,
            viewAdmin: true,
        },
        searchable: ['assignments', 'opportunities'],
        menus: ADMIN_ROLE_MENU,
    },
    [MANAGEMENT_ROLE]: {
        features: {
            viewHome: true,
            viewHolidays: true,
            viewOccupancy: true,
            viewAssignments: true,
            viewOpportunities: true,
            viewAdmin: false,
        },
        searchable: ['assignments', 'opportunities'],
        menus: MANAGEMENT_ROLE_MENU,
    },
    [CONSULTANT_ROLE]: {
        features: {
            viewHome: true,
            viewHolidays: true,
            viewOccupancy: true,
            viewAssignments: true,
            viewOpportunities: false,
            viewAdmin: false,
        },
        searchable: ['assignments'],
        menus: CONSULTANT_ROLE_MENU,
    },
    [SALES_ROLE]: {
        features: {
            viewHome: true,
            viewHolidays: true,
            viewOccupancy: false,
            viewAssignments: false,
            viewOpportunities: true,
            viewAdmin: false,
        },
        searchable: ['opportunities'],
        menus: SALES_ROLE_MENU,
    },
};

/**
 * Check if a user has permission to access a specific feature
 */
export function hasPermission(userRole, permission) {
    if (!userRole || !ROLE_PERMISSIONS[userRole]) {
        return false;
    }
    return ROLE_PERMISSIONS[userRole].features[permission] || false;
}

/**
 * Get the menu items for a user role
 */
export function getMenuItems(userRole) {
    if (!userRole || !ROLE_PERMISSIONS[userRole]) {
        return [];
    }
    return ROLE_PERMISSIONS[userRole].menus;
}

/**
 * Get searchable content types for a user role
 */
export function getSearchableTypes(userRole) {
    if (!userRole || !ROLE_PERMISSIONS[userRole]) {
        return [];
    }
    return ROLE_PERMISSIONS[userRole].searchable;
}

/**
 * Filter search results based on user role permissions
 */
export function filterSearchResultsByRole(results, userRole) {
    const searchableTypes = getSearchableTypes(userRole);

    return {
        opportunities: searchableTypes.includes('opportunities') ? results.opportunities : [],
        assignments: searchableTypes.includes('assignments') ? results.assignments : [],
    };
}
