import {
    getEmployeeById,
    getAssignmentsByEmployeeNumber,
    getAssignmentsMetrics,
    getEmployeeFYAmounts,
} from '@/actions/salesforce/salesforce-actions';
import { OccupancyStatsComponent } from '@/components/application/occupancy/occupancy-stats';
import { OccupancyListComponent } from '@/components/application/occupancy/occupancy-list';
import {
    getFlexOccupancyStatsAnchored,
    getFlexOccupancyHistory,
} from '@/actions/flex/flex-actions';
import {
    formatDateToISOString,
    getUTCToday,
    getCurrentFiscalYear,
    getFiscalYearStartDate,
    getFiscalYearEndDate,
} from '@/lib/utils';
import { EmployeeRecordCardComponent } from '@/components/application/management/employees/employee-record-card';
import { AssignmentsListComponent } from '@/components/application/assignment/assignments-list';
import { EmployeePageComponent } from '@/components/application/management/employees/employee-page';
import { EMPLOYEES_LIST_ROUTE } from '@/menus/routes';
import { NoDataComponent } from '@/components/errors/no-data';

export default async function EmployeePage({ params }) {
    const { employeeId } = await params;
    const today = getUTCToday();
    const formattedToday = formatDateToISOString(today);

    let employee = null;
    let assignments = null;
    let assignmentsMetrics = null;
    let flexEmployeeId = null;
    let occupancyData = [];
    let stats = null;
    let fyAmounts = null;

    const errors = {
        employee: null,
        assignments: null,
        assignmentsMetrics: null,
        stats: null,
        history: null,
    };

    const fyStart = formatDateToISOString(getFiscalYearStartDate(getCurrentFiscalYear()));
    const fyEnd = formatDateToISOString(getFiscalYearEndDate(getCurrentFiscalYear()));

    try {
        employee = await getEmployeeById(employeeId);
        flexEmployeeId = employee.flexId;
        [assignments, assignmentsMetrics, fyAmounts] = await Promise.all([
            getAssignmentsByEmployeeNumber(employee.employeeId),
            getAssignmentsMetrics(employee.employeeId),
            getEmployeeFYAmounts(employee.employeeId, fyStart, fyEnd),
        ]);
    } catch (err) {
        errors.employee = err;
    }

    if (!employee) {
        return <NoDataComponent text="Employee not found" />;
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
            errors.stats = statsResult.reason;
        }

        if (historyResult.status === 'fulfilled') {
            occupancyData = historyResult.value;
        } else {
            errors.history = historyResult.reason;
        }
    }

    return (
        <EmployeePageComponent
            detailsTab={
                <>
                    <div className="mb-6">
                        <EmployeeRecordCardComponent
                            employee={employee}
                            fyAmounts={fyAmounts}
                            error={errors.employee}
                        />
                    </div>
                    <OccupancyStatsComponent stats={stats} error={errors.stats} />
                </>
            }
            occupancyTab={
                <>
                    <OccupancyListComponent
                        occupancyData={occupancyData}
                        flexEmployeeId={flexEmployeeId}
                        formattedToday={formattedToday}
                        historyStartDate={historyStartDate}
                        error={errors.history}
                        statsRoute={`${EMPLOYEES_LIST_ROUTE}/${employeeId}/stats`}
                    />
                </>
            }
            assignmentsTab={
                <AssignmentsListComponent
                    error={errors.assignments}
                    assignments={assignments}
                    employeeNumber={employee?.employeeId}
                    assignmentsMetrics={assignmentsMetrics}
                    assignmentRoute={`${EMPLOYEES_LIST_ROUTE}/${employeeId}`}
                />
            }
        />
    );
}
