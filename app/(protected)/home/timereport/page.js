'use server';

import { auth } from '@/auth';
import {
    getCurrentAssignmentsByEmployeeNumber,
    getSalesforcePublicHolidays,
} from '@/actions/salesforce/salesforce-actions';
import { getTimereports } from '@/actions/flex/flex-actions';
import {
    getTimereportCheckmarkAction,
    createTimereportCheckmarkAction,
    deleteTimereportCheckmarkAction,
} from '@/actions/database/timereport-checkmark-actions';
import { TimereportCardComponent } from '@/components/application/timereport/timereport-card';
import { getWeekMonday, formatDateToISOString, getUTCToday } from '@/lib/utils';

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

async function fetchSalesforcePublicHolidays() {
    return await getSalesforcePublicHolidays();
}

/**
 * Fetch checkmark status for a given week
 */
async function fetchCheckmarkStatus(userId, weekStart) {
    const monday = getWeekMonday(new Date(weekStart));
    try {
        const checkmark = await getTimereportCheckmarkAction(userId, monday);
        return !!checkmark;
    } catch (error) {
        console.error('Failed to fetch checkmark status:', error);
        return false;
    }
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
    const userId = session.user.sessionId;
    const timereports = await fetchTimereportsForWeek(flexEmployeeId, weekStart);
    const isCheckmarked = await fetchCheckmarkStatus(userId, weekStart);
    return { ...timereports, isCheckmarked };
}

// Server action for toggling checkmark
async function toggleCheckmarkData(weekStart, isCurrentlyCheckmarked) {
    'use server';
    const session = await auth();
    const userId = session.user.sessionId;
    const monday = getWeekMonday(new Date(weekStart));

    try {
        if (isCurrentlyCheckmarked) {
            await deleteTimereportCheckmarkAction(userId, monday);
            return false;
        } else {
            await createTimereportCheckmarkAction(userId, monday);
            return true;
        }
    } catch (error) {
        console.error('Failed to toggle checkmark:', error);
        throw error;
    }
}

export default async function TimereportPage() {
    const session = await auth();
    const { user } = session;
    const employeeNumber = user.employeeNumber;
    const employeeName = user.name;
    const flexEmployeeId = user.flexEmployeeId;
    const userId = user.sessionId;

    // Fetch initial data for the current week
    let initialProjects = [];
    let initialTimereports = { timereportResponse: [], selectedProjects: [], isCheckmarked: false };
    let error = null;
    let holidays = null;
    try {
        const today = getUTCToday();
        const [holidaysData, projects, timereports, isCheckmarked] = await Promise.all([
            fetchSalesforcePublicHolidays(),
            fetchProjectsForWeek(employeeNumber, today),
            fetchTimereportsForWeek(flexEmployeeId, today),
            fetchCheckmarkStatus(userId, today),
        ]);
        initialProjects = projects;
        initialTimereports = { ...timereports, isCheckmarked };
        holidays = holidaysData;
    } catch (err) {
        error = err;
        console.error('Failed to fetch initial data:', err);
    }

    return (
        <div>
            <TimereportCardComponent
                employeeNumber={employeeNumber}
                employeeName={employeeName}
                flexEmployeeId={flexEmployeeId}
                initialProjects={initialProjects}
                initialTimereports={initialTimereports}
                refreshProjectsAction={refreshProjectsData}
                refreshTimereportsAction={refreshTimereportsData}
                toggleCheckmarkAction={toggleCheckmarkData}
                initialError={error}
                holidays={holidays}
            />
        </div>
    );
}
