'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { getHolidays } from '@/actions/flex/flex-actions';
import { HolidaysWrapperComponent } from '@/components/application/holidays/holidays-wrapper';

// Server action for refreshing data
async function refreshHolidayData() {
    'use server';
    revalidatePath('/home/holidays');
}

export default async function HolidaysPage() {
    let holidays = null;
    let error = null;
    let absences = null;
    const session = await auth();
    const employeeNumber = session.user.employeeNumber;

    try {
        const absencesData = await getHolidays(employeeNumber);   
        holidays = absencesData.holidays;
        absences = absencesData.absences;
    } catch (err) {
        error = err;
    }

    return (
        <div className="h-full">
            <HolidaysWrapperComponent
                holidays={holidays}
                absences={absences}
                refreshAction={refreshHolidayData}
                error={error}
                isNavigationDisabled={true}
            />
        </div>
    );
}
