'use server';

import { auth } from '@/auth';
import { OccupancyListComponent } from '@/components/application/occupancy/occupancy-list';
import { formatDateToISOString, getUTCToday } from '@/lib/utils';
import { getOccupancyHistory } from '@/actions/salesforce/salesforce-actions';

export default async function OccupancyListPage({ searchParams }) {
    const session = await auth();
    const employeeNumber = session.user.employeeNumber;

    const today = getUTCToday();
    const formattedToday = formatDateToISOString(today);

    const resolvedParams = await searchParams;
    const page = parseInt(resolvedParams?.page) || 1;
    const pageSize = 10;

    let occupancyHistory = null;
    let error = null;

    try {
        occupancyHistory = await getOccupancyHistory(
            employeeNumber,
            formattedToday,
            page,
            pageSize
        );
    } catch (err) {
        error = err;
    }

    return (
        <div>
            <OccupancyListComponent data={occupancyHistory} error={error} currentPage={page} />
        </div>
    );
}
