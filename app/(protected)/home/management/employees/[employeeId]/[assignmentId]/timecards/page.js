'use server';

import { TimecardListComponent } from '@/components/application/assignment/timecard-list';
import { getAssignmentTimereportsByProjectId } from '@/actions/flex/flex-actions';
import { getAssignmentByIdAndEmployeeNumber, getEmployeeById } from '@/actions/salesforce/salesforce-actions';
import { auth } from '@/auth';

const TimecardsPage = async ({ params }) => {
    const { employeeId, assignmentId } = await params;

    const session = await auth();
    const { user } = session;

    let timecards = null;
    let error = null;

    try {
        const employee = await getEmployeeById(employeeId);
        const assignment = await getAssignmentByIdAndEmployeeNumber(assignmentId, employee.employeeId);
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
};

export default TimecardsPage;
