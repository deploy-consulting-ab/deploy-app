import {
    getCurrentFiscalYear,
    getPreviousFiscalYear,
    getFiscalYearStartDate,
    formatDateToISOString,
    getUTCToday,
} from '@/lib/utils';
import { getOccupancyStats } from '@/actions/salesforce/salesforce-actions';
import { OccupancyStatCard } from '@/components/application/occupancy/occupancy-stat-card';
import { OccupancyDynamicAverageComponent } from '@/components/application/occupancy/occupancy-dynamic-average';
import { ErrorDisplayComponent } from '@/components/errors/error-display';

export async function OccupancyStatsComponent({ employeeNumber }) {
    const today = getUTCToday();
    const formattedToday = formatDateToISOString(today);

    const currentFY = getCurrentFiscalYear();
    const previousFY = getPreviousFiscalYear();

    const defaultStartDate = formatDateToISOString(getFiscalYearStartDate(currentFY));

    let stats = null;
    let error = null;

    try {
        stats = await getOccupancyStats(employeeNumber, formattedToday);
    } catch (err) {
        error = err;
    }

    if (error) {
        return <ErrorDisplayComponent error={error} />;
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                <OccupancyStatCard
                    title="Current Occupancy Rate"
                    rate={stats?.current}
                    subtitle={stats?.currentMonth ?? 'Most recent month'}
                />
                <OccupancyStatCard
                    title={`FY ${currentFY} YTD Occupancy Rate`}
                    rate={stats?.currentFYTD}
                    subtitle={`Feb ${currentFY} – today`}
                    monthCount={stats?.currentFYMonthCount}
                />
                <OccupancyStatCard
                    title={`FY ${previousFY} Occupancy Rate`}
                    rate={stats?.lastFY}
                    subtitle={`Feb ${previousFY} – Jan ${previousFY + 1}`}
                    monthCount={stats?.lastFYMonthCount}
                />
            </div>

            <div className="max-w-sm">
                <OccupancyDynamicAverageComponent
                    employeeNumber={employeeNumber}
                    defaultStartDate={defaultStartDate}
                    defaultEndDate={formattedToday}
                />
            </div>
        </div>
    );
}
