import { auth } from '@/auth';
import { OccupancyListComponent } from '@/components/application/occupancy/occupancy-list';
import { OccupancyStatsComponent } from '@/components/application/occupancy/occupancy-stats';
import { formatDateToISOString, getUTCToday } from '@/lib/utils';
import { getOccupancyHistory } from '@/actions/salesforce/salesforce-actions';

export default async function OccupancyStatsPage() {
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
        <div className="flex flex-col">
            <div className="mb-6">
                <OccupancyStatsComponent employeeNumber={employeeNumber} />
            </div>
            <OccupancyListComponent
                occupancyData={occupancyData}
                employeeNumber={employeeNumber}
                formattedToday={formattedToday}
                error={error}
            />
        </div>
    );
}

