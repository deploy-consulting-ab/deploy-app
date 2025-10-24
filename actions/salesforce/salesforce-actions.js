'use server';

import { queryData } from './salesforce-service';
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
    getSubcontractorAssignmentsMetricsQuery,
} from './queries';

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

export async function getSubcontractorAssignmentsMetrics(employeeNumber) {
    try {
        const result = await queryData(getSubcontractorAssignmentsMetricsQuery(employeeNumber));

        const map = new Map();
        map.set('Total', 0);
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
                map.set('Total', map.get('Total') + assignment.assignmentsMetrics);
            }
        }

        for (const [status, count] of map.entries()) {
            assignmentsMetrics.push({
                status: status,
                count: count,
            });
        }

        console.log('## Assignments Metrics', assignmentsMetrics);

        return assignmentsMetrics;
    } catch (error) {
        throw error;
    }
}
