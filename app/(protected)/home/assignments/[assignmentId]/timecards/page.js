
import { TimecardListComponent } from '@/components/application/assignment/timecard-list';
import { getAssignmentTimereportsByProjectId } from '@/actions/flex/flex-actions';
import { getAssignmentByIdAndEmployeeNumber } from '@/actions/salesforce/salesforce-actions';

export default async function TimecardsPage({ params }) {
    const { assignmentId } = await params;

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
