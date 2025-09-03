'use server';

import { fetchOpportunities } from '@/actions/salesforce/salesforce-service';
import { fetchAssignments } from '@/actions/salesforce/fetch-assignments';

import { getOpportunitiesByName } from '@/actions/salesforce/salesforce-actions';

export async function globalSearch(query, limit = 5) {
    
    console.log('query', query);
    
    if (!query) return { opportunities: [], assignments: [] };

    try {
        // Fetch data in parallel
        const [opportunities, assignments] = await Promise.all([
            searchOpportunities(query, limit),
            //   searchAssignments(query, limit)
        ]);

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
