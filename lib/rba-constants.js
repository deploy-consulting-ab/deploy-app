/**
 * PROFILES
 */
export const ADMIN_PROFILE = 'deploy_admin';
export const CONSULTANT_PROFILE = 'deploy_consultant';
export const SALES_PROFILE = 'deploy_sales';
export const MANAGEMENT_PROFILE = 'deploy_management';
export const SUBCONTRACTOR_PROFILE = 'deploy_subcontractor';

/**
 * INDIVIDUAL SYSTEM PERMISSIONS
 */
export const VIEW_HOME_PERMISSION = 'perm_home_view';
export const VIEW_HOLIDAYS_PERMISSION = 'perm_holidays_view';
export const VIEW_OCCUPANCY_PERMISSION = 'perm_occupancy_view';
export const VIEW_ASSIGNMENTS_PERMISSION = 'perm_assignments_view';
export const VIEW_OPPORTUNITIES_PERMISSION = 'perm_opportunities_view';
export const VIEW_SETUP_PERMISSION = 'perm_setup_view';
export const VIEW_TIMEREPORT_PERMISSION = 'perm_timereport_view';
export const REQUEST_ABSENCE_PERMISSION = 'perm_absence_request';
export const VIEW_FLEX_PERMISSION = 'perm_flex_view';
export const EDIT_PAST_TIMEREPORT_ENTRIES_PERMISSION = 'perm_edit_past_timereport_entries';
export const VIEW_MANAGEMENT_PERMISSION = 'perm_management_view';
export const MANAGE_FINANCIALS_PERMISSION = 'perm_financials_manage';
export const VIEW_AGENT_PERMISSION = 'perm_agent_view';

/**
 * FIELD PERMISSION SYSTEMS
 */
export const SALESFORCE_SYSTEM = 'salesforce';
export const FLEX_SYSTEM = 'flex';

/**
 * SALESFORCE OBJECTS
 */
export const SF_OBJECT_ASSIGNMENT = 'Assignment__c';
export const SF_OBJECT_OPPORTUNITY = 'Opportunity';

/**
 * SALESFORCE ASSIGNMENT FIELDS
 * Fields that can be controlled by field-level permissions.
 * Always-included fields (Id, Name, StartDate__c, EndDate__c, ProjectStatus__c, Project__r.Name)
 * are never gated and are excluded from this list.
 */
export const SF_ASSIGNMENT_FIELD_ACTUAL_AMOUNT = 'ActualAmount__c';
export const SF_ASSIGNMENT_FIELD_ACTUAL_COST = 'ActualCost__c';
export const SF_ASSIGNMENT_FIELD_ACTUAL_PROFITABILITY = 'ActualProfitability__c';
export const SF_ASSIGNMENT_FIELD_ACTUAL_PROFITABILITY_PERCENTAGE =
    'ActualProfitabilityPercentage__c';
export const SF_ASSIGNMENT_FIELD_PROJECTED_HOURS = 'ProjectedHours__c';
export const SF_ASSIGNMENT_FIELD_ACTUAL_HOURS = 'ActualHours__c';

/**
 * SALESFORCE OPPORTUNITY FIELDS
 * Fields that can be controlled by field-level permissions.
 * Always-included fields (Id, Name, StageName, CloseDate, Account.Name, CurrencyIsoCode)
 * are never gated and are excluded from this list.
 */
export const SF_OPPORTUNITY_FIELD_AMOUNT = 'Amount';
export const SF_OPPORTUNITY_FIELD_PRODUCT_TYPE = 'ProductType__c';

/**
 * PROFILE SYSTEM PERMISSION MAP
 */
export const PROFILE_MAP = {
    ADMIN: ADMIN_PROFILE,
    CONSULTANT: CONSULTANT_PROFILE,
    SALES: SALES_PROFILE,
    MANAGEMENT: MANAGEMENT_PROFILE,
    SUBCONTRACTOR: SUBCONTRACTOR_PROFILE,
};

export const PROFILES = [
    ADMIN_PROFILE,
    CONSULTANT_PROFILE,
    SALES_PROFILE,
    MANAGEMENT_PROFILE,
    SUBCONTRACTOR_PROFILE,
];

export const PROFILE_LABELS = {
    [ADMIN_PROFILE]: 'Admin',
    [CONSULTANT_PROFILE]: 'Consultant',
    [SALES_PROFILE]: 'Sales',
    [MANAGEMENT_PROFILE]: 'Management',
    [SUBCONTRACTOR_PROFILE]: 'Subcontractor',
};
