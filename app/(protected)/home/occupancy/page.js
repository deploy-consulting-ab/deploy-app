'use server';

import { auth } from '@/auth';
import { OccupancyChartComponent } from '@/components/application/occupancy/occupancy-chart';
import {
    getCurrentFiscalYear,
    getFiscalYearStartDate,
    formatDateToISOString,
    getUTCToday,
} from '@/lib/utils';
import { getOccupancyRateFromLastFiscalYear } from '@/actions/salesforce/salesforce-actions';

export default async function OccupancyPage() {
    const session = await auth();
    const employeeNumber = session.user.employeeNumber;

    const today = getUTCToday();
    const formattedToday = formatDateToISOString(today);

    const currentFiscalYear = getCurrentFiscalYear();

    const previousFiscalYear = currentFiscalYear - 1;
    const previousFiscalYearStartDate = getFiscalYearStartDate(previousFiscalYear);
    const formattedPreviousFiscalYearStartDate = formatDateToISOString(previousFiscalYearStartDate);

    let occupancyRates = null;
    let error = null;

    try {
        occupancyRates = await getOccupancyRateFromLastFiscalYear(
            employeeNumber,
            formattedToday,
            formattedPreviousFiscalYearStartDate
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
