
import { auth } from '@/auth';
import { OccupancyChartComponent } from '@/components/application/occupancy/occupancy-chart';
import {
    getCurrentFiscalYear,
    getFiscalYearStartDate,
    formatDateToISOString,
    getUTCToday,
} from '@/lib/utils';
import { getFlexOccupancyRates } from '@/actions/flex/flex-actions';

export default async function OccupancyChartPage() {
    const session = await auth();
    const flexEmployeeId = session.user.flexEmployeeId;

    const today = getUTCToday();
    const formattedToday = formatDateToISOString(today);

    const currentFiscalYear = getCurrentFiscalYear();
    const previousFiscalYear = currentFiscalYear - 1;
    const previousFiscalYearStartDate = getFiscalYearStartDate(previousFiscalYear);
    const formattedPreviousFiscalYearStartDate = formatDateToISOString(previousFiscalYearStartDate);

    let occupancyRates = null;
    let error = null;

    try {
        occupancyRates = await getFlexOccupancyRates(
            flexEmployeeId,
            formattedPreviousFiscalYearStartDate,
            formattedToday
        );
    } catch (err) {
        error = err;
    }

    return (
        <div>
            <OccupancyChartComponent chartData={occupancyRates} error={error} />
        </div>
    );
}
