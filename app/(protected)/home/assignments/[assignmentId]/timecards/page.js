import { TimecardListComponent } from '@/components/application/assignment/timecard-list';
import { getAssignmentTimereportsByProjectId } from '@/actions/flex/flex-actions';
import { getAssignmentByIdAndEmployeeNumber } from '@/actions/salesforce/salesforce-actions';
import { auth } from '@/auth';

export default async function TimecardsPage({ params }) {
    const [{ assignmentId }, session] = await Promise.all([params, auth()]);
    const { user } = session;

    let timecards = null;
    let error = null;

    try {
        const assignment = await getAssignmentByIdAndEmployeeNumber(
            assignmentId,
            user?.employeeNumber
        );
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
}
