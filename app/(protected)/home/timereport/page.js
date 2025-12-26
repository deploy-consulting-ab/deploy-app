'use server';

import { auth } from '@/auth';
import { getCurrentAssignmentsByEmployeeNumber } from '@/actions/salesforce/salesforce-actions';
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

// Server action for refreshing projects data
async function refreshProjectsData(weekStart) {
    'use server';
    console.log('Refresh projects data!!!');
    const session = await auth();
    const employeeNumber = session.user.employeeNumber;
    return fetchProjectsForWeek(employeeNumber, weekStart);
}

export default async function TimereportPage() {
    const session = await auth();
    const { user } = session;
    const employeeNumber = user.employeeNumber;

    console.log('Inital load!!!');

    // Fetch initial projects for the current week
    let initialProjects = [];
    let error = null;

    try {
        initialProjects = await fetchProjectsForWeek(employeeNumber, new Date());
    } catch (err) {
        error = err;
        console.error('Failed to fetch initial projects:', err);
    }

    return (
        <div className="py-4">
            <TimereportCard
                employeeNumber={employeeNumber}
                initialProjects={initialProjects}
                refreshProjectsAction={refreshProjectsData}
                initialError={error}
            />
        </div>
    );
}
