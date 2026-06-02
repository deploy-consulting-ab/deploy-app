import { auth } from '@/auth';
import { getTimereports } from '@/actions/flex/flex-actions';
import { formatDateToISOString, getLastDayOfMonth, getUTCToday } from '@/lib/utils';
import { OccupancyCalendarComponent } from '@/components/application/occupancy/occupancy-calendar';

export default async function OccupancyPeriodPage({ params }) {
    const { period } = await params;
    const session = await auth();
    const flexEmployeeId = session.user.flexEmployeeId;

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
        />
    );
}
