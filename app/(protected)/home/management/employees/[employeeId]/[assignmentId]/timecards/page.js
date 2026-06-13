import { TimecardListComponent } from '@/components/application/assignment/timecard-list';
import { getAssignmentTimereportsByProjectId } from '@/actions/flex/flex-actions';
import {
    getAssignmentByIdAndEmployeeNumber,
    getEmployeeById,
} from '@/actions/salesforce/salesforce-actions';

export default async function TimecardsPage({ params }) {
    const { employeeId, assignmentId } = await params;

    let timecards = null;
    let error = null;

    try {
        const employee = await getEmployeeById(employeeId);
        const assignment = await getAssignmentByIdAndEmployeeNumber(
            assignmentId,
            employee.employeeId
        );
        timecards = await getAssignmentTimereportsByProjectId(
            employee?.flexId,
            assignment?.flexId,
            assignment?.startDate,
            assignment?.endDate
        );
    } catch (err) {
        error = err;
    }

    return (
        <div>
            <TimecardListComponent error={error} timecards={timecards} />
        </div>
    );
}
