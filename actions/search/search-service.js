'use server';

import {
    getOpportunitiesByName,
    getAssignmentsByEmployeeNumberAndProjectName,
} from '@/actions/salesforce/salesforce-actions';
import { getSearchableTypes } from '@/lib/permissions';

export async function globalSearch(query, limit = 3, employeeNumber, userRole) {
    if (!query) {
        return { opportunities: [], assignments: [] };
    }

    try {
        // Get searchable types for the user's role
        const searchableTypes = getSearchableTypes(userRole);

        // Only fetch data that the user has permission to see
        const promises = [];

        if (searchableTypes.includes('opportunities')) {
            promises.push(searchOpportunities(query, limit));
        } else {
            promises.push([]);
        }

        if (searchableTypes.includes('assignments')) {
            promises.push(searchAssignments(query, employeeNumber, limit));
        } else {
            promises.push([]);
        }

        const [opportunitiesResults, assignmentsResults] = await Promise.all(promises);

        return {
            opportunitiesResults,
            assignmentsResults,
        };
    } catch (error) {
        console.error('Global search error:', error);
        throw new Error('Failed to perform global search');
    }
}

async function searchOpportunities(opportunityName, limit) {
    try {
        const opportunities = await getOpportunitiesByName(opportunityName);

        if (opportunities?.length === 0) {
            return [];
        }

        return {
            opportunities: opportunities.slice(0, limit),
            totalOpportunities: opportunities.length,
        };
    } catch (error) {
        console.error('Search opportunities error:', error);
        return {
            opportunities: [],
            totalOpportunities: 0,
        };
    }
}

async function searchAssignments(projectName, employeeNumber, limit) {
    try {
        const assignments = await getAssignmentsByEmployeeNumberAndProjectName(
            employeeNumber,
            projectName
        );

        if (assignments?.length === 0) {
            return [];
        }

        return {
            assignments: assignments.slice(0, limit),
            totalAssignments: assignments.length,
        };
    } catch (error) {
        console.error('Search assignments error:', error);
        return {
            assignments: [],
            totalAssignments: 0,
        };
    }
}
