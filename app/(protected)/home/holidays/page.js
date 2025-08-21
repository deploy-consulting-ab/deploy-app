'use server';

import { auth } from '@/auth';
import { getAbsenceApplications } from '@/actions/flex/flex-actions';
import { timeReportingLinks } from '@/lib/external-links';
import { UsefulLinksGrid } from '@/components/application/useful-links-grid';
import { HolidaysWrapper } from '@/components/application/holidays-wrapper';

// Server action for refreshing data
async function refreshHolidayData() {
    'use server';
    const session = await auth();
    const employeeNumber = session.user.employeeNumber;
    const data = await getAbsenceApplications('D001', { cache: 'no-store' });
    return data;
}

export default async function HolidaysPage() {
    let data = null;
    let error = null;
    const session = await auth();
    const employeeNumber = session.user.employeeNumber;

    try {
        data = await getAbsenceApplications(employeeNumber);
    } catch (err) {
        error = err;
    }

    return (
        <div className="flex flex-col min-h-screen">
            <div className="flex-1 space-y-8 pt-4">
                <HolidaysWrapper
                    initialData={data}
                    refreshAction={refreshHolidayData}
                    error={error}
                />
                <div className="w-full">
                    <UsefulLinksGrid links={timeReportingLinks} title="Flex" />
                </div>
            </div>
        </div>
    );
}
