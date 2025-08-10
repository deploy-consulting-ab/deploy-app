'use server';
import { auth } from '@/auth';

import { HolidayCard } from '@/components/application/holidays-card';
import { OccupancyCard } from '@/components/application/occupancy-card';
import { UsefulLinksGrid } from '@/components/application/useful-links-grid';
import { getAbsenceApplications } from '@/actions/flex/flex-actions';
import { employeeData } from '@/lib/mock-data';
import { homePageLinks } from '@/lib/external-links';

// Server action for refreshing data
async function refreshHolidayData() {
    'use server';
    const data = await getAbsenceApplications('D003', { cache: 'no-store' });
    return data;
}

export default async function HomePage() {
    let loading = true;
    let data = null;
    let error = null;

    const session = await auth();

    try {
        // data = await getAbsenceApplications(session.user.employeeNumber);
    } catch (err) {
        console.error('Error fetching dashboard data:', {
            name: err.name,
            message: err.message,
            status: err.status,
            code: err.code,
        });
        error = err;
    } finally {
        loading = false;
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen">
            <div className="flex-1 space-y-8 pt-6">
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                    <HolidayCard
                        // holidays={data}
                        holidays={employeeData.holidays}
                        error={error}
                        isNavigationDisabled={false}
                        refreshAction={refreshHolidayData}
                    />
                    <OccupancyCard occupancy={employeeData.occupancy} />
                </div>
                <div>
                    <h3 className="text-lg font-medium mb-4">Quick Access</h3>
                    <UsefulLinksGrid links={homePageLinks} />
                </div>
            </div>
        </div>
    );
}
