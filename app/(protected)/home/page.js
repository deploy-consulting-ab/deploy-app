'use server';

import { auth } from '@/auth';
import { HolidaysCard } from '@/components/application/holidays-card';
import { OccupancyCard } from '@/components/application/occupancy-card';
import { UsefulLinksGrid } from '@/components/application/useful-links-grid';
import { getAbsenceApplications } from '@/actions/flex/flex-actions';
import { homePageLinks } from '@/lib/external-links';
import { Spinner } from '@/components/ui/spinner';
import { getRecentOccupancyRate } from '@/actions/salesforce/salesforce-actions';
import { formatDateToISOString } from '@/lib/utils';

async function refreshHolidayData() {
    'use server';
    const session = await auth();
    const employeeNumber = session.user.employeeNumber;
    const data = await getAbsenceApplications(employeeNumber, { cache: 'no-store' });
    return data;
}

export default async function HomePage() {
    let loading = true;
    let holidays = null;
    let occupancyRates = null;
    let error = null;
    const session = await auth();
    const employeeNumber = session.user.employeeNumber;

    try {
        holidays = await getAbsenceApplications(employeeNumber);

        const today = new Date();
        const formattedToday = formatDateToISOString(today);

        occupancyRates = await getRecentOccupancyRate(employeeNumber, formattedToday);
    } catch (err) {
        error = err;
    } finally {
        loading = false;
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Spinner size="lg" label="Loading dashboard..." />
            </div>
        );
    }

    return (
        <div className="h-full grid grid-rows-[auto_1fr] gap-4 pt-4">
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                <HolidaysCard
                    holidays={holidays}
                    error={error}
                    isNavigationDisabled={false}
                    refreshAction={refreshHolidayData}
                />
                <OccupancyCard
                    occupancy={occupancyRates}
                    error={error}
                />
            </div>
            <div className="self-start">
                <UsefulLinksGrid links={homePageLinks} title="Quick Access" />
            </div>
        </div>
    );
}
