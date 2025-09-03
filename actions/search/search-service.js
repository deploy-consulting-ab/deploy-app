'use server';

import { fetchOpportunities } from '@/actions/salesforce/salesforce-service';
import { fetchAssignments } from '@/actions/salesforce/fetch-assignments';
import { getOpportunitiesByName } from '@/actions/salesforce/salesforce-actions';
import { getSearchableTypes } from '@/lib/permissions';

export async function globalSearch(query, limit = 5, userRole) {
    if (!query) return { opportunities: [], assignments: [] };

    console.log('##### userRole', userRole);

    try {
        // Get searchable types for the user's role
        const searchableTypes = getSearchableTypes(userRole);

        console.log('##### searchableTypes', searchableTypes);

        // Only fetch data that the user has permission to see
        const promises = [];
        
        if (searchableTypes.includes('opportunities')) {
            promises.push(searchOpportunities(query, limit));
        } else {
            promises.push([]);
        }

        if (searchableTypes.includes('assignments')) {
            promises.push(searchAssignments(query, limit));
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

async function searchOpportunities(query, limit) {
    try {
        const opportunities = await getOpportunitiesByName(query);
        console.log('opportunities', opportunities);
        return opportunities.slice(0, limit);
    } catch (error) {
        console.error('Search opportunities error:', error);
        return [];
    }
}

async function searchAssignments(query, limit) {
    try {
        const assignments = await fetchAssignments();
        return assignments
            .filter(
                (assignment) =>
                    assignment.Name?.toLowerCase().includes(query.toLowerCase()) ||
                    assignment.Project_Name__c?.toLowerCase().includes(query.toLowerCase()) ||
                    assignment.Resource_Name__c?.toLowerCase().includes(query.toLowerCase())
            )
            .slice(0, limit);
    } catch (error) {
        console.error('Search assignments error:', error);
        return [];
    }
}
