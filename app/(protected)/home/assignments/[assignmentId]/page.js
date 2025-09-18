import { AssignmentCard } from '@/components/application/assignment/assignment-card';
import { getAssignmentById } from '@/actions/salesforce/salesforce-actions';
import { auth } from '@/auth';

const AssignmentPage = async ({ params }) => {
    const { assignmentId } = await params;

    const session = await auth();
    const { user } = session;

    let assignment = null;
    let error = null;

    try {
        assignment = await getAssignmentById(assignmentId, user?.employeeNumber);
    } catch (err) {
        console.error('#### err', err);
        error = err;
    }

    return (
        <div className="py-4">
            <AssignmentCard error={error} assignment={assignment} />
        </div>
    );
};

export default AssignmentPage;
