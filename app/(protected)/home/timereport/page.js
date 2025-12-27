'use server';

import { auth } from '@/auth';
import {
    getCurrentAssignmentsByEmployeeNumber,
    getHolidays,
} from '@/actions/salesforce/salesforce-actions';
import { getTimereports } from '@/actions/flex/flex-actions';
import { TimereportCard } from '@/components/application/timereport/timereport-card';
import { getWeekMonday, formatDateToISOString } from '@/lib/utils';

/**
 * Fetch projects for a given week
 * Adds a grace period for assignments that start/end mid-week
 */
async function fetchProjectsForWeek(employeeNumber, weekStart) {
    const monday = getWeekMonday(new Date(weekStart));
    const weekEnd = new Date(monday);
    weekEnd.setDate(weekEnd.getDate() + 6);

    // Add grace period for mid-week assignment boundaries
    const adjustedStart = new Date(monday);
    adjustedStart.setDate(adjustedStart.getDate() + 6);

    const adjustedEnd = new Date(weekEnd);
    adjustedEnd.setDate(adjustedEnd.getDate() - 6);

    const formattedWeekStart = formatDateToISOString(adjustedStart);
    const formattedWeekEnd = formatDateToISOString(adjustedEnd);

    const data = await getCurrentAssignmentsByEmployeeNumber(
        employeeNumber,
        formattedWeekStart,
        formattedWeekEnd
    );
    return data || [];
}

/**
 * Fetch timereports for a given week
 */
async function fetchTimereportsForWeek(flexEmployeeId, weekStart) {
    const monday = getWeekMonday(new Date(weekStart));
    const weekEnd = new Date(monday);
    weekEnd.setDate(weekEnd.getDate() + 6);

    const formattedWeekStart = formatDateToISOString(monday);
    const formattedWeekEnd = formatDateToISOString(weekEnd);

    const response = await getTimereports(flexEmployeeId, formattedWeekStart, formattedWeekEnd);

    // Convert Set to Array for serialization (server actions can't pass Sets)
    return {
        timereportResponse: response.timereportResponse || [],
        selectedProjects: Array.from(response.selectedProjects || []),
    };
}

async function fetchHolidays() {
    return await getHolidays();
}

// Server action for refreshing projects data
async function refreshProjectsData(weekStart) {
    'use server';
    const session = await auth();
    const employeeNumber = session.user.employeeNumber;
    return fetchProjectsForWeek(employeeNumber, weekStart);
}

// Server action for refreshing timereports data
async function refreshTimereportsData(weekStart) {
    'use server';
    const session = await auth();
    const flexEmployeeId = session.user.flexEmployeeId;
    return fetchTimereportsForWeek(flexEmployeeId, weekStart);
}

export default async function TimereportPage() {
    const session = await auth();
    const { user } = session;
    const employeeNumber = user.employeeNumber;
    const flexEmployeeId = user.flexEmployeeId;

    console.log('## flexEmployeeId', flexEmployeeId);
    console.log('## employeeNumber', employeeNumber);

    // Fetch initial data for the current week
    let initialProjects = [];
    let initialTimereports = { timereportResponse: [], selectedProjects: [] };
    let error = null;
    let holidays = null;
    try {
        const [holidaysData, projects, timereports] = await Promise.all([
            fetchHolidays(),
            fetchProjectsForWeek(employeeNumber, new Date()),
            fetchTimereportsForWeek(flexEmployeeId, new Date()),
        ]);
        initialProjects = projects;
        initialTimereports = timereports;
        holidays = holidaysData;
    } catch (err) {
        error = err;
        console.error('Failed to fetch initial data:', err);
    }

    return (
        <div className="py-4">
            <TimereportCard
                flexEmployeeId={flexEmployeeId}
                initialProjects={initialProjects}
                initialTimereports={initialTimereports}
                refreshProjectsAction={refreshProjectsData}
                refreshTimereportsAction={refreshTimereportsData}
                initialError={error}
                holidays={holidays}
            />
        </div>
    );
}
