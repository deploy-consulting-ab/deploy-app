import { tool } from 'ai';
import { z } from 'zod';
import {
    getEmployeesByNameOrEmployeeId,
    getAssignmentsByEmployeeNumber,
    getOpportunities,
    getOpportunitiesByName,
    getOccupancyStats,
    getOccupancyHistory,
} from '@/actions/salesforce/salesforce-actions';
import { getHolidays, getTimereports } from '@/actions/flex/flex-actions';
import { getFinancialsAction } from '@/actions/database/financials-actions';
import { toPermissionSet } from '@/lib/utils';
import {
    VIEW_MANAGEMENT_PERMISSION,
    VIEW_OPPORTUNITIES_PERMISSION,
    VIEW_OCCUPANCY_PERMISSION,
    VIEW_ASSIGNMENTS_PERMISSION,
    VIEW_TIMEREPORT_PERMISSION,
} from '@/lib/rba-constants';

/**
 * Creates the full set of agent tools scoped to the logged-in user.
 * Tools default to the session user's employeeNumber / flexEmployeeId when
 * the caller does not provide an explicit value.
 *
 * @param {{ name: string, employeeNumber: string|null, flexEmployeeId: string|null, yearlyHolidays: number, carriedOverHolidays: number }} user
 * @returns {Record<string, import('ai').CoreTool>}
 */
export function createAgentTools(user) {
    const defaultEmployeeNumber = user?.employeeNumber ?? null;
    const defaultFlexEmployeeId = user?.flexEmployeeId ?? null;
    const defaultYearlyHolidays = user?.yearlyHolidays ?? 30;
    const defaultCarriedOverHolidays = user?.carriedOverHolidays ?? 0;

    const permissionsSet = toPermissionSet(user?.systemPermissions);
    const hasManagementViewPermission = permissionsSet.has(VIEW_MANAGEMENT_PERMISSION);
    const hasOpportunitiesViewPermission = permissionsSet.has(VIEW_OPPORTUNITIES_PERMISSION);
    const hasOccupancyViewPermission = permissionsSet.has(VIEW_OCCUPANCY_PERMISSION);
    const hasAssignmentsViewPermission = permissionsSet.has(VIEW_ASSIGNMENTS_PERMISSION);
    const hasFlexTimereportsViewPermission = permissionsSet.has(VIEW_TIMEREPORT_PERMISSION);

    console.log('hasOpportunitiesViewPermission', hasOpportunitiesViewPermission);

    return {
        // Public tools
        searchEmployees: tool({
            description:
                'Search for employees by name or employee ID. Returns a list of matching employees with their IDs and employment status.',
            inputSchema: z.object({
                query: z.string().describe('Name or employee ID to search for'),
            }),
            execute: async ({ query }) => {
                return getEmployeesByNameOrEmployeeId(query);
            },
        }),

        getFlexHolidays: tool({
            description:
                'Get holiday (absence) information from Flex for the logged-in employee: total holidays, used holidays, available holidays, and upcoming requests.',
            inputSchema: z.object({
                employeeNumber: z
                    .string()
                    .optional()
                    .describe('Employee number. Must match the logged-in user.'),
            }),
            execute: async ({ employeeNumber }) => {
                const number = employeeNumber ?? defaultEmployeeNumber;
                if (!number) {
                    return { error: 'No employee number available' };
                }
                if (number !== defaultEmployeeNumber) {
                    return {
                        error: 'Not authorized. You can only view your own holiday information.',
                    };
                }
                return getHolidays({
                    employeeNumber: number,
                    yearlyHolidays: defaultYearlyHolidays,
                    carriedOverHolidays: defaultCarriedOverHolidays,
                });
            },
        }),

        // Protected tools

        ...(hasFlexTimereportsViewPermission && {
            getFlexTimereports: tool({
                description:
                    'Get time reports from Flex for the logged-in employee for a specific week. Returns logged hours per day, project names, and absence entries.',
                inputSchema: z.object({
                    flexEmployeeId: z
                        .string()
                        .optional()
                        .describe('Flex employee ID. Must match the logged-in user.'),
                    weekStartDate: z.string().describe('Monday of the week in YYYY-MM-DD format'),
                    weekEndDate: z.string().describe('Sunday of the week in YYYY-MM-DD format'),
                }),
                execute: async ({ flexEmployeeId, weekStartDate, weekEndDate }) => {
                    const id = flexEmployeeId ?? defaultFlexEmployeeId;
                    if (!id) {
                        return { error: 'No Flex employee ID available' };
                    }
                    if (id !== defaultFlexEmployeeId) {
                        return {
                            error: 'Not authorized. You can only view your own time reports.',
                        };
                    }
                    const result = await getTimereports(id, weekStartDate, weekEndDate);
                    return result.timereportResponse;
                },
            }),
        }),

        ...(hasAssignmentsViewPermission && {
            getAssignments: tool({
                description: 'Get all project assignments for the logged-in employee.',
                inputSchema: z.object({
                    employeeNumber: z
                        .string()
                        .optional()
                        .describe('Employee number. Must match the logged-in user.'),
                }),
                execute: async ({ employeeNumber }) => {
                    const number = employeeNumber ?? defaultEmployeeNumber;
                    if (!number) {
                        return { error: 'No employee number available' };
                    }
                    if (number !== defaultEmployeeNumber) {
                        return { error: 'Not authorized. You can only view your own assignments.' };
                    }
                    return getAssignmentsByEmployeeNumber(number);
                },
            }),
        }),

        ...(hasOpportunitiesViewPermission && {
            searchOpportunities: tool({
                description:
                    'Search for sales opportunities by name. Omit name to retrieve all opportunities.',
                inputSchema: z.object({
                    name: z
                        .string()
                        .optional()
                        .describe(
                            'Opportunity name to search for. Leave empty to get all opportunities.'
                        ),
                }),
                execute: async ({ name }) => {
                    if (!name) {
                        return getOpportunities();
                    }
                    return getOpportunitiesByName(name);
                },
            }),
        }),

        ...(hasOccupancyViewPermission && {
            getOccupancyStats: tool({
                description:
                    'Get occupancy rate statistics for the logged-in employee: current month rate, fiscal-year-to-date average, and last fiscal year average.',
                inputSchema: z.object({
                    employeeNumber: z
                        .string()
                        .optional()
                        .describe('Employee number. Must match the logged-in user.'),
                    today: z.string().describe('Reference date in YYYY-MM-DD format'),
                }),
                execute: async ({ employeeNumber, today }) => {
                    const number = employeeNumber ?? defaultEmployeeNumber;
                    if (!number) {
                        return { error: 'No employee number available' };
                    }
                    if (number !== defaultEmployeeNumber) {
                        return {
                            error: 'Not authorized. You can only view your own occupancy stats.',
                        };
                    }
                    return getOccupancyStats(number, today);
                },
            }),
        }),

        ...(hasOccupancyViewPermission && {
            getOccupancyHistory: tool({
                description:
                    'Get the full monthly occupancy rate history for the logged-in employee, including hours breakdown per month.',
                inputSchema: z.object({
                    employeeNumber: z
                        .string()
                        .optional()
                        .describe('Employee number. Must match the logged-in user.'),
                    today: z.string().describe('Reference date in YYYY-MM-DD format'),
                }),
                execute: async ({ employeeNumber, today }) => {
                    const number = employeeNumber ?? defaultEmployeeNumber;
                    if (!number) {
                        return { error: 'No employee number available' };
                    }
                    if (number !== defaultEmployeeNumber) {
                        return {
                            error: 'Not authorized. You can only view your own occupancy history.',
                        };
                    }
                    return getOccupancyHistory(number, today);
                },
            }),
        }),

        ...(hasManagementViewPermission && {
            getFinancials: tool({
                description:
                    'Get financial records from the internal database. Returns revenue, cost, profit, and taxes. Fiscal year runs Feb 1 – Jan 31. Quarter 0 = full year total. Always return the results in Swedish currency (SEK).',
                inputSchema: z.object({
                    fiscalYear: z
                        .number()
                        .optional()
                        .describe('Fiscal year (e.g. 2025). Omit to get all years.'),
                    quarter: z
                        .number()
                        .min(0)
                        .max(4)
                        .optional()
                        .describe(
                            'Quarter 1-4, or 0 for full year total. Omit to get all quarters.'
                        ),
                }),
                execute: async ({ fiscalYear, quarter }) => {
                    const where = {};
                    if (fiscalYear !== undefined) where.fiscalYear = fiscalYear;
                    if (quarter !== undefined) where.quarter = quarter;
                    return await getFinancialsAction(where);
                },
            }),
        }),
    };
}
