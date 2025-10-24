'use server';

import { auth } from '@/auth';
import { getAbsenceApplications } from '@/actions/flex/flex-actions';
import { getHomePageLinks } from '@/lib/external-links';
import { Spinner } from '@/components/ui/spinner';
import { getRecentOccupancyRate } from '@/actions/salesforce/salesforce-actions';
import { formatDateToISOString } from '@/lib/utils';
import {
    getHomeLayoutForProfile,
    getHomeRequiredDataForProfile,
} from '@/components/application/home/home-layout-selector';

async function refreshHolidays() {
    'use server';
    const session = await auth();
    const employeeNumber = session.user.employeeNumber;
    return await getAbsenceApplications(employeeNumber, { cache: 'no-store' });
}

async function refreshOccupancy() {
    'use server';
    const session = await auth();
    const employeeNumber = session.user.employeeNumber;
    const today = new Date();
    const formattedToday = formatDateToISOString(today);
    return await getRecentOccupancyRate(employeeNumber, formattedToday);
}

const refreshActions = {
    holidays: refreshHolidays,
    occupancy: refreshOccupancy,
};

export default async function HomePage() {
    const session = await auth();
    const { employeeNumber, profileId } = session.user;

    // Determine what data this profile needs
    const dataRequirements = getHomeRequiredDataForProfile(profileId);

    // Initialize data and errors
    let loading = true;
    const data = {
        holidays: null,
        occupancyRates: null,
    };
    const errors = {
        holidays: null,
        occupancyRates: null,
    };

    // Fetch required data based on profile
    if (dataRequirements.holidays) {
        try {
            data.holidays = await getAbsenceApplications(employeeNumber);
        } catch (err) {
            errors.holidays = err;
        }
    }

    if (dataRequirements.occupancyRates) {
        try {
            const today = new Date();
            const formattedToday = formatDateToISOString(today);
            data.occupancyRates = await getRecentOccupancyRate(employeeNumber, formattedToday);
        } catch (err) {
            errors.occupancyRates = err;
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

    // Get the appropriate layout component for this profile
    const LayoutComponent = getHomeLayoutForProfile(profileId);

    // Render the layout with the fetched data
    return (
        <LayoutComponent
            {...data}
            errors={errors}
            refreshActions={refreshActions}
            links={getHomePageLinks(profileId)}
        />
    );
}
