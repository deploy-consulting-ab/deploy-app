import { getEmployeeById } from '@/actions/salesforce/salesforce-actions';
import { OccupancyStatsComponent } from '@/components/application/occupancy/occupancy-stats';
import { OccupancyListComponent } from '@/components/application/occupancy/occupancy-list';
import { getFlexOccupancyStatsAnchored, getFlexOccupancyHistory } from '@/actions/flex/flex-actions';
import {
    formatDateToISOString,
    getUTCToday,
    getCurrentFiscalYear,
    getFiscalYearStartDate,
} from '@/lib/utils';
import { EmployeeRecordCardComponent } from '@/components/application/management/employees/employee-record-card';

const EmployeePage = async ({ params }) => {
    const { employeeId } = await params;
    const today = getUTCToday();
    const formattedToday = formatDateToISOString(today);

    let employee = null;
    let flexEmployeeId = null;
    let occupancyData = [];
    let stats = null;

    let employeeError = null;
    let statsError = null;
    let historyError = null;

    try {
        employee = await getEmployeeById(employeeId);
        flexEmployeeId = employee.flexId;
    } catch (err) {
        employeeError = err;
    }

    const currentFY = getCurrentFiscalYear();
    const historyStartDate = formatDateToISOString(getFiscalYearStartDate(currentFY - 2));

    if (flexEmployeeId) {
        const [statsResult, historyResult] = await Promise.allSettled([
            getFlexOccupancyStatsAnchored(flexEmployeeId, formattedToday),
            getFlexOccupancyHistory(flexEmployeeId, formattedToday, historyStartDate),
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
                <EmployeeRecordCardComponent employee={employee} error={employeeError} />
            </div>
            <div className="mb-6">
                <OccupancyStatsComponent stats={stats} error={statsError} />
            </div>
            <OccupancyListComponent
                occupancyData={occupancyData}
                flexEmployeeId={flexEmployeeId}
                formattedToday={formattedToday}
                historyStartDate={historyStartDate}
                error={historyError}
            />
        </div>
    );
};

export default EmployeePage;
