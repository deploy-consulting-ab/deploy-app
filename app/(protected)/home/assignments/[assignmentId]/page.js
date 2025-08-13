import { AssignmentCard } from "@/components/application/assignment/assignment-card";
import { fetchAssignmentById } from "@/actions/salesforce/fetch-assignments";
import { notFound } from "next/navigation";

const AssignmentPage = async ({ params }) => {
    const { assignmentId } = await params;
    const assignment = await fetchAssignmentById(assignmentId);

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