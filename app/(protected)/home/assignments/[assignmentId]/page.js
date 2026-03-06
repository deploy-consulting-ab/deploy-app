import { AssignmentCard } from '@/components/application/assignment/assignment-card';
import { getAssignmentById, getTimecardHoursCountByAssignmentId } from '@/actions/salesforce/salesforce-actions';
import { auth } from '@/auth';

const AssignmentPage = async ({ params }) => {
    const { assignmentId } = await params;

    const session = await auth();
    const { user } = session;

    let assignment = null;
    let timecardHours = null;
    let error = null;

    try {
        assignment = await getAssignmentById(assignmentId, user?.employeeNumber);
        timecardHours = await getTimecardHoursCountByAssignmentId(assignmentId);
    } catch (err) {
        error = err;
    }

    return (
        <div>
            <AssignmentCard error={error} assignment={assignment} timecardHours={timecardHours} />
        </div>
    );
};

export default AssignmentPage;
