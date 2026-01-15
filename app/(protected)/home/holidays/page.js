'use server';

import { auth } from '@/auth';
import { getAbsenceApplications } from '@/actions/flex/flex-actions';
import { HolidaysWrapperComponent } from '@/components/application/holidays/holidays-wrapper';

// Server action for refreshing data
async function refreshHolidayData() {
    'use server';
    const session = await auth();
    const employeeNumber = session.user.employeeNumber;
    const data = await getAbsenceApplications(employeeNumber);
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
        <div className="h-full">
            <HolidaysWrapperComponent
                initialData={data}
                refreshAction={refreshHolidayData}
                error={error}
            />
        </div>
    );
}
