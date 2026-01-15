'use server';

import { HolidaysCardComponent } from '@/components/application/holidays/holidays-card';
import { OccupancyCardComponent } from '@/components/application/occupancy/occupancy-card';
import { UsefulLinksComponent } from '@/components/application/useful-links/useful-links-component';
import { getAbsenceApplications } from '@/actions/flex/flex-actions';
import { getHomePageLinks } from '@/lib/external-links';
import { Spinner } from '@/components/ui/spinner';
import {
    getAssignmentsMetrics,
    getRecentOccupancyRate,
} from '@/actions/salesforce/salesforce-actions';
import { formatDateToISOString, getUTCToday } from '@/lib/utils';
import { getHomeRequiredDataForProfile } from '@/components/application/home/home-layout-selector';
import { AssignmentsMetricsComponent } from '@/components/application/assignment/assignments-metrics';
import { ModernAdminHome } from '@/components/application/home/modern-admin-home';

export async function AdminHomeComponent({ profileId, employeeNumber, userName }) {
    // Initialize data and errors
    let loading = true;

    const data = {
        holidays: null,
        occupancyRates: null,
        assignmentsMetrics: null,
    };

    const errors = {
        holidays: null,
        occupancyRates: null,
        assignmentsMetrics: null,
    };

    async function refreshHolidays() {
        'use server';
        try {
            return await getAbsenceApplications(employeeNumber);
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async function refreshOccupancy() {
        'use server';
        try {
            const today = getUTCToday();
            const formattedToday = formatDateToISOString(today);
            return await getRecentOccupancyRate(employeeNumber, formattedToday);
        } catch (error) {
            throw new Error(error.message);
        }
    }

    // Determine what data this profile needs
    const dataRequirements = getHomeRequiredDataForProfile(profileId);
    const links = getHomePageLinks(profileId);

    // Fetch required data based on profile
    if (dataRequirements.holidays) {
        try {
            data.holidays = await getAbsenceApplications(employeeNumber);
        } catch (error) {
            errors.holidays = error;
        }
    }

    if (dataRequirements.occupancyRates) {
        try {
            const today = getUTCToday();
            const formattedToday = formatDateToISOString(today);
            data.occupancyRates = await getRecentOccupancyRate(employeeNumber, formattedToday);
        } catch (error) {
            errors.occupancyRates = error;
        }
    }

    if (dataRequirements.assignmentsMetrics) {
        try {
            const metrics = await getAssignmentsMetrics(employeeNumber);

            data.assignmentsMetrics = metrics.map((assignment) => ({
                ...assignment,
                title: assignment.status,
                description:
                    assignment.count === 0
                        ? `No ${assignment.status} assignments yet`
                        : `${assignment.status} assignments`,
            }));
        } catch (error) {
            errors.assignmentsMetrics = error;
        }
    }

    loading = false;

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Spinner size="lg" label="Loading dashboard..." />
            </div>
        );
    }

    return (
        <ModernAdminHome
            holidays={data.holidays}
            occupancyRates={data.occupancyRates}
            assignmentsMetrics={data.assignmentsMetrics}
            userName={userName || employeeNumber}
        />
    );
}
