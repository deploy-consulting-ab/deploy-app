'use server';

import { auth } from '@/auth';
import { HolidaysCard } from '@/components/application/holidays-card';
import { OccupancyCard } from '@/components/application/occupancy-card';
import { UsefulLinksGrid } from '@/components/application/useful-links-grid';
import { getAbsenceApplications } from '@/actions/flex/flex-actions';
import { employeeData } from '@/lib/mock-data';
import { homePageLinks } from '@/lib/external-links';
import { Spinner } from '@/components/ui/spinner';

async function refreshHolidayData() {
    'use server';
    const session = await auth();
    const employeeNumber = session.user.employeeNumber;
    const data = await getAbsenceApplications(employeeNumber, { cache: 'no-store' });
    return data;
}

export default async function HomePage() {
    let loading = true;
    let data = null;
    let error = null;
    const session = await auth();
    const employeeNumber = session.user.employeeNumber;

    try {
        data = await getAbsenceApplications(employeeNumber);
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
        <div className="flex flex-col min-h-screen">
            <div className="flex-1 space-y-8 pt-4">
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                    <HolidaysCard
                        holidays={data}
                        error={error}
                        isNavigationDisabled={false}
                        refreshAction={refreshHolidayData}
                    />
                    <OccupancyCard occupancy={employeeData.occupancy} />
                </div>
                <div>
                    <UsefulLinksGrid links={homePageLinks} title="Quick Access" />
                </div>
            </div>
        </div>
    );
}
