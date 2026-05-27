'use server';

import { TimecardListComponent } from '@/components/application/assignment/timecard-list';
import { getAssignmentTimereportsByProjectId } from '@/actions/flex/flex-actions';
import { getAssignmentByIdAndEmployeeNumber } from '@/actions/salesforce/salesforce-actions';
import { auth } from '@/auth';

const TimecardsPage = async ({ params }) => {
    const { assignmentId } = await params;

    const session = await auth();
    const { user } = session;

    let timecards = null;
    let error = null;

    try {
        const assignment = await getAssignmentByIdAndEmployeeNumber(assignmentId, user?.employeeNumber);
        timecards = await getAssignmentTimereportsByProjectId(
            user?.flexEmployeeId,
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
