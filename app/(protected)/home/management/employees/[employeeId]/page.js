import {
    getEmployeeById,
    getAssignmentsByEmployeeNumber,
    getAssignmentsMetrics,
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
} from '@/lib/utils';
import { EmployeeRecordCardComponent } from '@/components/application/management/employees/employee-record-card';
import { AssignmentsListComponent } from '@/components/application/assignment/assignments-list';
import { EmployeePageComponent } from '@/components/application/management/employees/employee-page';
import { EMPLOYEES_LIST_ROUTE } from '@/menus/routes';

const EmployeePage = async ({ params }) => {
    const { employeeId } = await params;
    const today = getUTCToday();
    const formattedToday = formatDateToISOString(today);

    let employee = null;
    let assignments = null;
    let assignmentsMetrics = null;
    let flexEmployeeId = null;
    let occupancyData = [];
    let stats = null;

    const errors = {
        employee: null,
        assignments: null,
        assignmentsMetrics: null,
        stats: null,
        history: null,
    };

    try {
        employee = await getEmployeeById(employeeId);
        flexEmployeeId = employee.flexId;
        assignments = await getAssignmentsByEmployeeNumber(employee.employeeId);
        assignmentsMetrics = await getAssignmentsMetrics(employee.employeeId);
    } catch (err) {
        errors.employee = err;
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
                        <EmployeeRecordCardComponent employee={employee} error={errors.employee} />
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
};

export default EmployeePage;
