import { getEmployeeById } from '@/actions/salesforce/salesforce-actions';
import { getUTCToday, formatDateToISOString, getLastDayOfMonth } from '@/lib/utils';
import { OCCUPANCY_STATS_ROUTE } from '@/menus/routes';
import { OccupancyCalendarComponent } from '@/components/application/occupancy/occupancy-calendar';
import { getTimereports } from '@/actions/flex/flex-actions';

export default async function EmployeeOccupancyPage({ params }) {
    const { employeeId, period } = await params;

    const employee = await getEmployeeById(employeeId);
    const flexEmployeeId = employee.flexId;

    const startDate = period;
    const endDate = getLastDayOfMonth(period);
    const today = formatDateToISOString(getUTCToday());

    let timereports = null;
    let error = null;

    if (flexEmployeeId) {
        try {
            const result = await getTimereports(flexEmployeeId, startDate, endDate);
            timereports = result.timereportResponse;
        } catch (err) {
            error = err;
        }
    }

    return (
        <OccupancyCalendarComponent
            timereports={timereports}
            startDate={startDate}
            endDate={endDate}
            today={today}
            error={error}
            statsRoute={OCCUPANCY_STATS_ROUTE}
        />
    );
}
