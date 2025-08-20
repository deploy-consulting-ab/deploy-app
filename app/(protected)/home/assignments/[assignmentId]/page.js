import { AssignmentCard } from '@/components/application/assignment/assignment-card';
import { notFound } from 'next/navigation';
import { getAssignmentById } from '@/actions/salesforce/salesforce-actions';
import { sampleAssignmentData } from '@/lib/mock-data';

const AssignmentPage = async ({ params }) => {
    const { assignmentId } = await params;

    let realAssignment = null;
    let error = null;

    try {
        realAssignment = await getAssignmentById(assignmentId);
    } catch (err) {
        error = err;
    }

    // For testing: Merge real assignment data with sample timecard data
    const assignment = {
        ...realAssignment,
        timecards: sampleAssignmentData.timecards,
    };

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
