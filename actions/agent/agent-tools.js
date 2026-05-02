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
import { db } from '@/lib/db';

/**
 * Creates the full set of agent tools scoped to the logged-in user.
 * Tools default to the session user's employeeNumber / flexEmployeeId when
 * the caller does not provide an explicit value.
 *
 * @param {{ name: string, employeeNumber: string|null, flexEmployeeId: string|null, yearlyHolidays: number, carriedOverHolidays: number }} user
 * @returns {Record<string, import('ai').CoreTool>}
 */
export function createAgentTools (user) {
    const defaultEmployeeNumber = user?.employeeNumber ?? null;
    const defaultFlexEmployeeId = user?.flexEmployeeId ?? null;
    const defaultYearlyHolidays = user?.yearlyHolidays ?? 30;
    const defaultCarriedOverHolidays = user?.carriedOverHolidays ?? 0;

    return {
        searchEmployees: tool({
            description: 'Search for employees by name or employee ID. Returns a list of matching employees with their IDs and employment status.',
            inputSchema: z.object({
                query: z.string().describe('Name or employee ID to search for'),
            }),
            execute: async ({ query }) => {
                return getEmployeesByNameOrEmployeeId(query);
            },
        }),

        getAssignments: tool({
            description: 'Get all project assignments for an employee. Returns assignment names, project names, start/end dates, and status.',
            inputSchema: z.object({
                employeeNumber: z.string().optional().describe('Employee number. Defaults to the logged-in user.'),
            }),
            execute: async ({ employeeNumber }) => {
                const number = employeeNumber ?? defaultEmployeeNumber;
                if (!number) return { error: 'No employee number available' };
                return getAssignmentsByEmployeeNumber(number);
            },
        }),

        searchOpportunities: tool({
            description: 'Search for sales opportunities by name. Omit name to retrieve all opportunities.',
            inputSchema: z.object({
                name: z.string().optional().describe('Opportunity name to search for. Leave empty to get all opportunities.'),
            }),
            execute: async ({ name }) => {
                if (!name) return getOpportunities();
                return getOpportunitiesByName(name);
            },
        }),

        getOccupancyStats: tool({
            description: 'Get occupancy rate statistics for an employee: current month rate, fiscal-year-to-date average, and last fiscal year average.',
            inputSchema: z.object({
                employeeNumber: z.string().optional().describe('Employee number. Defaults to the logged-in user.'),
                today: z.string().describe('Reference date in YYYY-MM-DD format'),
            }),
            execute: async ({ employeeNumber, today }) => {
                const number = employeeNumber ?? defaultEmployeeNumber;
                if (!number) return { error: 'No employee number available' };
                return getOccupancyStats(number, today);
            },
        }),

        getOccupancyHistory: tool({
            description: 'Get the full monthly occupancy rate history for an employee, including hours breakdown per month.',
            inputSchema: z.object({
                employeeNumber: z.string().optional().describe('Employee number. Defaults to the logged-in user.'),
                today: z.string().describe('Reference date in YYYY-MM-DD format'),
            }),
            execute: async ({ employeeNumber, today }) => {
                const number = employeeNumber ?? defaultEmployeeNumber;
                if (!number) return { error: 'No employee number available' };
                return getOccupancyHistory(number, today);
            },
        }),

        getFlexTimereports: tool({
            description: 'Get time reports from Flex for an employee for a specific week. Returns logged hours per day, project names, and absence entries.',
            inputSchema: z.object({
                flexEmployeeId: z.string().optional().describe('Flex employee ID. Defaults to the logged-in user.'),
                weekStartDate: z.string().describe('Monday of the week in YYYY-MM-DD format'),
                weekEndDate: z.string().describe('Sunday of the week in YYYY-MM-DD format'),
            }),
            execute: async ({ flexEmployeeId, weekStartDate, weekEndDate }) => {
                const id = flexEmployeeId ?? defaultFlexEmployeeId;
                if (!id) return { error: 'No Flex employee ID available' };
                const result = await getTimereports(id, weekStartDate, weekEndDate);
                return result.timereportResponse;
            },
        }),

        getFlexHolidays: tool({
            description: 'Get holiday (absence) information from Flex for an employee: total holidays, used holidays, available holidays, and upcoming requests.',
            inputSchema: z.object({
                employeeNumber: z.string().optional().describe('Employee number. Defaults to the logged-in user.'),
            }),
            execute: async ({ employeeNumber }) => {
                const number = employeeNumber ?? defaultEmployeeNumber;
                if (!number) return { error: 'No employee number available' };
                return getHolidays({
                    employeeNumber: number,
                    yearlyHolidays: defaultYearlyHolidays,
                    carriedOverHolidays: defaultCarriedOverHolidays,
                });
            },
        }),

        getFinancials: tool({
            description: 'Get financial records from the internal database. Returns revenue, cost, profit, and taxes. Fiscal year runs Feb 1 – Jan 31. Quarter 0 = full year total.',
            inputSchema: z.object({
                fiscalYear: z.number().optional().describe('Fiscal year (e.g. 2025). Omit to get all years.'),
                quarter: z.number().min(0).max(4).optional().describe('Quarter 1-4, or 0 for full year total. Omit to get all quarters.'),
            }),
            execute: async ({ fiscalYear, quarter }) => {
                const where = {};
                if (fiscalYear !== undefined) where.fiscalYear = fiscalYear;
                if (quarter !== undefined) where.quarter = quarter;
                return db.financialRecord.findMany({
                    where,
                    orderBy: [{ fiscalYear: 'desc' }, { quarter: 'asc' }],
                });
            },
        }),
    };
}
