'use server';

import { queryData, queryCachedData } from './salesforce-service';
import {
    getAssignmentsByEmployeeNumberQuery,
    getAssignmentByIdQuery,
    getAssignmentTimecardsQuery,
    getOpportunitiesQuery,
    getRecentOccupancyRateQuery,
    getOccupancyRateFromLastFiscalYearQuery,
    getOpportunitiesByNameQuery,
    getAssignmentsByEmployeeNumberAndProjectNameQuery,
    getOpportunityByIdQuery,
    getAssignmentsMetricsQuery,
    getCurrentAssignmentsByEmployeeNumberQuery,
    getHolidaysQuery,
} from './queries';
import { PROJECT_TYPE_INTERNAL } from './constants';

export async function getAssignmentsByEmployeeNumber(employeeNumber) {
    try {
        const result = await queryData(getAssignmentsByEmployeeNumberQuery(employeeNumber));
        return result.map((assignment) => ({
            id: assignment.Id,
            name: assignment.Name,
            startDate: assignment.StartDate__c,
            endDate: assignment.EndDate__c,
            projectStatus: assignment.ProjectStatus__c,
            projectName: assignment.Project__r.Name,
        }));
    } catch (error) {
        throw error;
    }
}

export async function getAssignmentsByEmployeeNumberAndProjectName(employeeNumber, projectName) {
    try {
        const result = await queryData(
            getAssignmentsByEmployeeNumberAndProjectNameQuery(employeeNumber, projectName)
        );
        return result.map((assignment) => ({
            id: assignment.Id,
            name: assignment.Project__r.Name,
            accountName: assignment.Project__r.Account__r.Name,
            type: 'Assignment',
        }));
    } catch (error) {
        throw error;
    }
}

export async function getAssignmentById(assignmentId, employeeNumber) {
    try {
        const results = await queryData(getAssignmentByIdQuery(assignmentId, employeeNumber));

        if (results?.length === 0) {
            return null;
        }

        const result = results[0];

        return {
            id: result.Id,
            name: result.Name,
            startDate: result.StartDate__c,
            endDate: result.EndDate__c,
            projectStatus: result.ProjectStatus__c,
            projectName: result.Project__r.Name,
            projectedHours: result.ProjectedHours__c,
            actualHours: result.ActualHours__c,
        };
    } catch (error) {
        throw error;
    }
}

export async function getAssignmentTimecards(assignmentId, employeeNumber) {
    try {
        const result = await queryData(getAssignmentTimecardsQuery(assignmentId, employeeNumber));
        return result.map((timecard) => ({
            id: timecard.Id,
            weekStartDate: timecard.StartDate__c,
            weekEndDate: timecard.EndDate__c,
            hours: [
                timecard.MondayHours__c,
                timecard.TuesdayHours__c,
                timecard.WednesdayHours__c,
                timecard.ThursdayHours__c,
                timecard.FridayHours__c,
                timecard.SaturdayHours__c,
                timecard.SundayHours__c,
            ],
        }));
    } catch (error) {
        throw error;
    }
}

export async function getCurrentAssignmentsByEmployeeNumber(employeeNumber, weekStartDate, weekEndDate) {
    console.log('## getCurrentAssignmentsByEmployeeNumber - employeeNumber', employeeNumber);
    console.log('## getCurrentAssignmentsByEmployeeNumber - weekStartDate', weekStartDate);
    console.log('## getCurrentAssignmentsByEmployeeNumber - weekEndDate', weekEndDate);
    try {
        const result = await queryData(
            getCurrentAssignmentsByEmployeeNumberQuery(employeeNumber, weekStartDate, weekEndDate)
        );
        console.log('## getCurrentAssignmentsByEmployeeNumberQuery', result);
        return result.map((assignment) => ({
            id: assignment.Id,
            name: assignment.Project__r.Name,
            client: assignment.Project__r.Account__r.Name,
            startDate: assignment.StartDate__c,
            endDate: assignment.EndDate__c,
            projectType: assignment.ProjectType__c,
            flexId: assignment.Project__r.FlexID__c,
            projectStatus: assignment.ProjectStatus__c,
            color: assignment.ProjectType__c === PROJECT_TYPE_INTERNAL ? '#6b7280' : '#3b82f6',
        }));
    } catch (error) {
        throw error;
    }
}

export async function getOpportunities() {
    try {
        const result = await queryData(getOpportunitiesQuery());
        return result.map((opportunity) => ({
            id: opportunity.Id,
            name: opportunity.Name,
            stage: opportunity.StageName,
            closeDate: opportunity.CloseDate,
            amount: opportunity.Amount,
            accountName: opportunity.Account.Name,
            currency: opportunity.CurrencyIsoCode,
        }));
    } catch (error) {
        throw error;
    }
}

export async function getOpportunitiesByName(name) {
    try {
        const result = await queryData(getOpportunitiesByNameQuery(name));
        return result.map((opportunity) => ({
            id: opportunity.Id,
            name: opportunity.Name,
            stage: opportunity.StageName,
            closeDate: opportunity.CloseDate,
            amount: opportunity.Amount,
            accountName: opportunity.Account.Name,
            currency: opportunity.CurrencyIsoCode,
            type: 'Opportunity',
        }));
    } catch (error) {
        throw error;
    }
}

export async function getOpportunityById(opportunityId) {
    try {
        const results = await queryData(getOpportunityByIdQuery(opportunityId));
        const result = results[0];
        return {
            id: result.Id,
            name: result.Name,
            stage: result.StageName,
            closeDate: result.CloseDate,
            amount: result.Amount,
            accountName: result.Account.Name,
            currency: result.CurrencyIsoCode,
        };
    } catch (error) {
        throw error;
    }
}

export async function getRecentOccupancyRate(employeeNumber, dates) {
    try {
        const result = await queryData(getRecentOccupancyRateQuery(employeeNumber, dates));

        if (result?.length === 0) {
            return null;
        }

        return {
            current: result[0].OccupancyRate__c,
            history: result.slice(1).map((occupancyRate) => ({
                month: occupancyRate.Month__c,
                rate: occupancyRate.OccupancyRate__c,
            })),
        };
    } catch (error) {
        throw error;
    }
}

export async function getOccupancyRateFromLastFiscalYear(employeeNumber, today, lastFiscalYear) {
    try {
        const result = await queryData(
            getOccupancyRateFromLastFiscalYearQuery(employeeNumber, today, lastFiscalYear)
        );

        if (result?.length === 0) {
            return null;
        }

        return result.map((occupancyRate) => ({
            month: occupancyRate.Month__c + ' ' + occupancyRate.Year__c,
            date: occupancyRate.Date__c,
            rate: occupancyRate.OccupancyRate__c,
        }));
    } catch (error) {
        throw error;
    }
}

export async function getAssignmentsMetrics(employeeNumber) {
    try {
        const result = await queryData(getAssignmentsMetricsQuery(employeeNumber));

        const map = new Map();
        map.set('All', 0);
        map.set('Ongoing', 0);
        map.set('Completed', 0);
        map.set('Not Started', 0);

        const assignmentsMetrics = [];

        for (const assignment of result) {
            if (map.has(assignment.Status__c)) {
                map.set(
                    assignment.Status__c,
                    map.get(assignment.Status__c) + assignment.assignmentsMetrics
                );
                map.set('All', map.get('All') + assignment.assignmentsMetrics);
            }
        }

        for (const [status, count] of map.entries()) {
            assignmentsMetrics.push({
                status: status,
                count: count,
            });
        }

        return assignmentsMetrics;
    } catch (error) {
        throw error;
    }
}

export async function getHolidays() {
    try {
        const result = await queryCachedData(getHolidaysQuery(), {
            tags: ['holidays'],
            cacheKey: 'holidays-list',
            revalidate: 86400, // 24 hours
        });
        const holidaysSet = new Set();
        for (const holiday of result) {
            holidaysSet.add(holiday.ActivityDate);
        }
        return holidaysSet;
    } catch (error) {
        throw error;
    }
}
