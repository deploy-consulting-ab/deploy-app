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
    const data = await getAbsenceApplications(employeeNumber, { cache: 'no-store' });
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
        <div className="h-full grid grid-rows-[auto_1fr] gap-4 pt-4">
            <HolidaysWrapper
                    initialData={data}
                    refreshAction={refreshHolidayData}
                    error={error}
                />
            <div className="self-start">
                <UsefulLinksGrid links={timeReportingLinks} title="Flex" />
            </div>
        </div>
    );
}
