import { CalendarHolidays } from '@/components/application/holidays-calendar';
import { getAbsenceApplications } from '@/actions/flex/flex-actions';
import { HolidayCard } from '@/components/application/holidays-card';
import { employeeData } from '@/lib/mock-data';
import { timeReportingLinks } from '@/lib/external-links';
import { UsefulLinksGrid } from '@/components/application/useful-links-grid';

// Server action for refreshing data
async function refreshHolidayData() {
    'use server';
    const data = await getAbsenceApplications('D003', { cache: 'no-store' });
    return data;
}

export default async function CalendarPage() {
    let loading = true;
    let data = null;
    let error = null;

    try {
        // data = await getAbsenceApplications("D003");
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
                        isNavigationDisabled={true}
                        refreshAction={refreshHolidayData}
                    />
                    <CalendarHolidays
                        // holidays={data}
                        holidays={employeeData.holidays}
                    />
                </div>
                <div className="w-full">
                    <UsefulLinksGrid links={timeReportingLinks} title="Flex" />
                </div>
            </div>
        </div>
    );
}
