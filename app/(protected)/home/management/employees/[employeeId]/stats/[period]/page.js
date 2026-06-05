import { getEmployeeById } from '@/actions/salesforce/salesforce-actions';
import { getUTCToday, formatDateToISOString, getLastDayOfMonth } from '@/lib/utils';
import { EMPLOYEES_LIST_ROUTE } from '@/menus/routes';
import { OccupancyCalendarComponent } from '@/components/application/occupancy/occupancy-calendar';
import { getTimereports } from '@/actions/flex/flex-actions';
import { ErrorDisplayComponent } from '@/components/errors/error-display';

export default async function EmployeeOccupancyPage({ params }) {
    const { employeeId, period } = await params;

    let employee = null;
    let employeeError = null;

    try {
        employee = await getEmployeeById(employeeId);
    } catch (err) {
        employeeError = err;
    }

    if (employeeError || !employee) {
        return (
            <ErrorDisplayComponent
                error={employeeError}
            />
        );
    }

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
            statsRoute={`${EMPLOYEES_LIST_ROUTE}/${employeeId}/stats`}
        />
    );
}
