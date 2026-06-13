import { AssignmentRecordCardComponent } from '@/components/application/assignment/assignment-record-card';
import { getAssignmentByIdAndEmployeeNumber } from '@/actions/salesforce/salesforce-actions';
import { getAssignmentTimereportsByProjectId } from '@/actions/flex/flex-actions';
import { groupTimereportsByMonth } from '@/lib/utils';
import { auth } from '@/auth';
import { ASSIGNMENTS_ROUTE } from '@/menus/routes';

export default async function AssignmentPage({ params }) {
    const [{ assignmentId }, session] = await Promise.all([params, auth()]);
    const { user } = session;

    let assignment = null;
    let timecardHours = null;
    let actualHours = 0;
    let error = null;

    try {
        assignment = await getAssignmentByIdAndEmployeeNumber(assignmentId, user?.employeeNumber);
        const weeklyTimereports = await getAssignmentTimereportsByProjectId(
            user?.flexEmployeeId,
            assignment?.flexId,
            assignment?.startDate,
            assignment?.endDate
        );
        timecardHours = groupTimereportsByMonth(weeklyTimereports);
        actualHours = weeklyTimereports.reduce(
            (sum, week) => sum + week.hours.reduce((s, h) => s + h, 0),
            0
        );
    } catch (err) {
        error = err;
    }

    return (
        <AssignmentRecordCardComponent
            error={error}
            assignment={assignment}
            timecardHours={timecardHours}
            actualHours={actualHours}
            timecardsRoute={`${ASSIGNMENTS_ROUTE}`}
        />
    );
}
