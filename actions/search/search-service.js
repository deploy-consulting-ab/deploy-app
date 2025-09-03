'use server';

import { getOpportunitiesByName, getAssignmentsByEmployeeNumberAndProjectName } from '@/actions/salesforce/salesforce-actions';
import { getSearchableTypes } from '@/lib/permissions';

export async function globalSearch(query, limit = 5, employeeNumber, userRole) {
    if (!query) return { opportunities: [], assignments: [] };

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

        const [opportunities, assignments] = await Promise.all(promises);

        return {
            opportunities,
            assignments,
        };
    } catch (error) {
        console.error('Global search error:', error);
        throw new Error('Failed to perform global search');
    }
}

async function searchOpportunities(opportunityName, limit) {
    try {
        const opportunities = await getOpportunitiesByName(opportunityName);
        return opportunities.slice(0, limit);
    } catch (error) {
        console.error('Search opportunities error:', error);
        return [];
    }
}

async function searchAssignments(projectName, employeeNumber, limit) {
    try {
        const assignments = await getAssignmentsByEmployeeNumberAndProjectName(employeeNumber, projectName);
        return assignments.slice(0, limit);
    } catch (error) {
        console.error('Search assignments error:', error);
        return [];
    }
}
