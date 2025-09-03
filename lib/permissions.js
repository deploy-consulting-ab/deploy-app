import { ADMIN_ROLE, CONSULTANT_ROLE, SALES_ROLE, MANAGEMENT_ROLE } from '@/menus/roles';

/**
 * Centralized permissions configuration for the application
 * This defines what each role can access and view
 */
export const ROLE_PERMISSIONS = {
  [ADMIN_ROLE]: {
    features: {
      viewAssignments: true,
      viewOpportunities: true,
      viewHolidays: true,
      viewOccupancy: true,
      viewAdmin: true,
      editAssignments: true,
      editOpportunities: true,
    },
    searchable: ['assignments', 'opportunities'],
  },
  [MANAGEMENT_ROLE]: {
    features: {
      viewAssignments: true,
      viewOpportunities: true,
      viewHolidays: true,
      viewOccupancy: true,
      viewAdmin: false,
      editAssignments: true,
      editOpportunities: true,
    },
    searchable: ['assignments', 'opportunities'],
  },
  [CONSULTANT_ROLE]: {
    features: {
      viewAssignments: true,
      viewOpportunities: false,
      viewHolidays: true,
      viewOccupancy: true,
      viewAdmin: false,
      editAssignments: false,
      editOpportunities: false,
    },
    searchable: ['assignments'],
  },
  [SALES_ROLE]: {
    features: {
      viewAssignments: false,
      viewOpportunities: true,
      viewHolidays: true,
      viewOccupancy: false,
      viewAdmin: false,
      editAssignments: false,
      editOpportunities: true,
    },
    searchable: ['opportunities'],
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
