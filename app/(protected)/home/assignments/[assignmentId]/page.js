import { AssignmentCard } from '@/components/application/assignment/assignment-card';
import { notFound } from 'next/navigation';
import { getAssignmentById } from '@/actions/salesforce/salesforce-actions';

const AssignmentPage = async ({ params }) => {
    const { assignmentId } = await params;

    let assignment = null;
    let error = null;

    try {
        assignment = await getAssignmentById(assignmentId);
    } catch (err) {
        error = err;
    }

    if (!assignment) {
        notFound();
    }

    return (
        <div className="py-4">
            <AssignmentCard error={error} assignment={assignment} />
        </div>
    );
};

export default AssignmentPage;
