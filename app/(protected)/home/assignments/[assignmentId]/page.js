import { AssignmentCard } from "@/components/application/assignment/assignment-card";
import { notFound } from "next/navigation";
import { getAssignmentById } from "@/actions/salesforce/salesforce-actions";

const AssignmentPage = async ({ params }) => {
    const { assignmentId } = await params;
    const assignment = await getAssignmentById(assignmentId);

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