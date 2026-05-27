import { AssignmentRecordCardComponent } from '@/components/application/assignment/assignment-record-card';
import {
    getAssignmentByIdAndEmployeeNumber,
    getEmployeeById,
} from '@/actions/salesforce/salesforce-actions';
import { getAssignmentTimereportsByProjectId } from '@/actions/flex/flex-actions';
import { groupTimereportsByMonth } from '@/lib/utils';
import { EMPLOYEES_LIST_ROUTE } from '@/menus/routes';

const EmployeeAssignmentPage = async ({ params }) => {
    const { employeeId, assignmentId } = await params;

    let assignment = null;
    let timecardHours = null;
    let actualHours = 0;
    let error = null;

    try {
        const employee = await getEmployeeById(employeeId);

        if (!employee) {
            return <AssignmentRecordCardComponent assignment={null} />;
        }

        assignment = await getAssignmentByIdAndEmployeeNumber(assignmentId, employee.employeeId);

        if (assignment) {
            const weeklyTimereports = await getAssignmentTimereportsByProjectId(
                employee.flexId,
                assignment.flexId,
                assignment.startDate,
                assignment.endDate
            );
            timecardHours = groupTimereportsByMonth(weeklyTimereports);
            actualHours = weeklyTimereports.reduce(
                (sum, week) => sum + week.hours.reduce((s, h) => s + h, 0),
                0
            );
        }
    } catch (err) {
        error = err;
    }

    return (
        <AssignmentRecordCardComponent
            error={error}
            assignment={assignment}
            timecardHours={timecardHours}
            actualHours={actualHours}
            timecardsRoute={`${EMPLOYEES_LIST_ROUTE}/${employeeId}`}
        />
    );
};

export default EmployeeAssignmentPage;
