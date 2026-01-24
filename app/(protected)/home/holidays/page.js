'use server';

import { auth } from '@/auth';
import { getHolidays, getAllAbsence } from '@/actions/flex/flex-actions';
import { HolidaysWrapperComponent } from '@/components/application/holidays/holidays-wrapper';

// Server action for refreshing data
async function refreshHolidayData() {
    'use server';
    const session = await auth();
    const employeeNumber = session.user.employeeNumber;
    const data = await getHolidays(employeeNumber);
    return data;
}

// Server action for fetching all absences
async function fetchAllAbsences() {
    'use server';
    const session = await auth();
    const employeeNumber = session.user.employeeNumber;
    const data = await getAllAbsence(employeeNumber);
    return data;
}

export default async function HolidaysPage() {
    let data = null;
    let error = null;
    const session = await auth();
    const employeeNumber = session.user.employeeNumber;

    try {
        data = await getHolidays(employeeNumber);
    } catch (err) {
        error = err;
    }

    return (
        <div className="h-full">
            <HolidaysWrapperComponent
                initialData={data}
                refreshAction={refreshHolidayData}
                fetchAllAbsences={fetchAllAbsences}
                error={error}
                isNavigationDisabled={true}
            />
        </div>
    );
}
