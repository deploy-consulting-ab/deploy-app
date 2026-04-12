import { auth } from '@/auth';
import { OccupancyListComponent } from '@/components/application/occupancy/occupancy-list';
import { OccupancyStatsComponent } from '@/components/application/occupancy/occupancy-stats';
import { formatDateToISOString, getUTCToday } from '@/lib/utils';
import { getOccupancyHistory, getOccupancyStats } from '@/actions/salesforce/salesforce-actions';

export default async function OccupancyStatsPage() {
    const session = await auth();
    const employeeNumber = session.user.employeeNumber;

    const today = getUTCToday();
    const formattedToday = formatDateToISOString(today);

    let occupancyData = [];
    let statsError = null;
    let historyError = null;
    let stats = null;

    if (employeeNumber) {
        const [statsResult, historyResult] = await Promise.allSettled([
            getOccupancyStats(employeeNumber, formattedToday),
            getOccupancyHistory(employeeNumber, formattedToday),
        ]);

        if (statsResult.status === 'fulfilled') {
            stats = statsResult.value;
        } else {
            statsError = statsResult.reason;
        }

        if (historyResult.status === 'fulfilled') {
            occupancyData = historyResult.value;
        } else {
            historyError = historyResult.reason;
        }
    }

    return (
        <div className="flex flex-col">
            <div className="mb-6">
                <OccupancyStatsComponent stats={stats} error={statsError} />
            </div>
            <OccupancyListComponent
                occupancyData={occupancyData}
                employeeNumber={employeeNumber}
                formattedToday={formattedToday}
                error={historyError}
            />
        </div>
    );
}
