'use server';

import {
    getOpportunitiesByName,
    getAssignmentsByEmployeeNumberAndProjectName,
    getEmployeesByNameOrEmployeeId,
} from '@/actions/salesforce/salesforce-actions';
import { auth } from '@/auth';
import {
    VIEW_OPPORTUNITIES_PERMISSION,
    VIEW_ASSIGNMENTS_PERMISSION,
    VIEW_MANAGEMENT_PERMISSION,
} from '@/lib/rba-constants';
import { toPermissionSet } from '@/lib/utils';
import { searchUsersAction } from '@/actions/database/user-actions';
import { searchProfilesAction } from '@/actions/database/profile-actions';

export async function globalSearch(query, limit = 3, employeeNumber, location) {
    if (!query) {
        return { opportunities: [], assignments: [], employees: [] };
    }

    const session = await auth();
    const { user } = session;
    const permissionsSet = toPermissionSet(user?.systemPermissions);

    try {
        return await searchByLocation(query, limit, location, permissionsSet, employeeNumber);
    } catch (error) {
        console.error('Global search error:', error);
        throw new Error('Failed to perform global search');
    }
}

async function searchByLocation(query, limit, location, permissionsSet, employeeNumber) {
    if (location === 'home') {
        // Only fetch data that the user has permission to see
        const promises = [];

        if (permissionsSet.has(VIEW_OPPORTUNITIES_PERMISSION)) {
            promises.push(searchOpportunities(query, limit));
        } else {
            promises.push([]);
        }

        if (permissionsSet.has(VIEW_ASSIGNMENTS_PERMISSION)) {
            promises.push(searchAssignments(query, employeeNumber, limit));
        } else {
            promises.push([]);
        }

        if (permissionsSet.has(VIEW_MANAGEMENT_PERMISSION)) {
            promises.push(searchEmployees(query));
        } else {
            promises.push([]);
        }

        const [opportunities, assignments, employees] = await Promise.all(promises);

        const records = [...opportunities, ...assignments, ...employees];
        const slicedRecords = records.slice(0, limit);

        return {
            records,
            slicedRecords,
        };
    } else if (location === 'setup') {
        if (!permissionsSet.has(VIEW_MANAGEMENT_PERMISSION)) {
            return {
                records: [],
                slicedRecords: [],
            };
        }

        const promises = [];

        promises.push(searchUsers(query));
        promises.push(searchProfiles(query));

        const [users, profiles] = await Promise.all(promises);
        const records = [...users, ...profiles];
        const slicedRecords = records.slice(0, limit);

        return {
            records,
            slicedRecords,
        };
    } else {
        return [];
    }
}

async function searchOpportunities(opportunityName, limit) {
    try {
        const opportunities = await getOpportunitiesByName(opportunityName);

        if (opportunities?.length === 0) {
            return [];
        }

        return opportunities;
    } catch (error) {
        console.error('Search opportunities error:', error);
        return [];
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

        return assignments;
    } catch (error) {
        console.error('Search assignments error:', error);
        return [];
    }
}

async function searchEmployees(query) {
    try {
        const employees = await getEmployeesByNameOrEmployeeId(query);

        if (employees?.length === 0) {
            return [];
        }

        return employees;
    } catch (error) {
        console.error('Search employees error:', error);
        return [];
    }
}

async function searchUsers(query) {
    try {
        const users = await searchUsersAction(query);

        if (users?.length === 0) {
            return [];
        }

        return users.map((user) => ({
            ...user,
            type: 'User',
            subType: user.employeeNumber,
        }));
    } catch (error) {
        console.error('Search users error:', error);
        return [];
    }
}

async function searchProfiles(query) {
    try {
        const profiles = await searchProfilesAction(query);

        if (profiles?.length === 0) {
            return [];
        }

        return profiles.map((profile) => ({
            ...profile,
            type: 'Profile',
            subType: profile.name,
        }));
    } catch (error) {
        console.error('Search profiles error:', error);
        return [];
    }
}
