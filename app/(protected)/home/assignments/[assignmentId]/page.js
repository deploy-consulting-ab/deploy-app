import { AssignmentCard } from "@/components/application/assignment/assignment-card";
import { notFound } from "next/navigation";
import { getAssignmentById } from "@/actions/salesforce/salesforce-actions";
import { sampleAssignmentData } from "@/lib/mock-data";

const AssignmentPage = async ({ params }) => {
    const { assignmentId } = await params;
    // For testing: Merge real assignment data with sample timecard data
    const realAssignment = await getAssignmentById(assignmentId);
    const assignment = {
        ...realAssignment,
        timecards: sampleAssignmentData.timecards
    };

    if (!assignment) {
        notFound();
    }

    return (
        <div className="container mx-auto py-6">
            <AssignmentCard assignment={assignment} />
        </div>
    );
};

export default AssignmentPage;