import { auth } from '@/auth';
import { OccupancyListComponent } from '@/components/application/occupancy/occupancy-list';
import { OccupancyStatsComponent } from '@/components/application/occupancy/occupancy-stats';
import { formatDateToISOString, getUTCToday } from '@/lib/utils';
import { getOccupancyHistory } from '@/actions/salesforce/salesforce-actions';

export default async function OccupancyListPage() {
    const session = await auth();
    const employeeNumber = session.user.employeeNumber;

    const today = getUTCToday();
    const formattedToday = formatDateToISOString(today);

    let occupancyData = [];
    let error = null;

    try {
        occupancyData = await getOccupancyHistory(employeeNumber, formattedToday);
    } catch (err) {
        error = err;
    }

    return (
        <div className="flex flex-col space-y-6">
            <OccupancyStatsComponent employeeNumber={employeeNumber} />
            <OccupancyListComponent
                occupancyData={occupancyData}
                employeeNumber={employeeNumber}
                formattedToday={formattedToday}
                error={error}
            />
        </div>
    );
}
