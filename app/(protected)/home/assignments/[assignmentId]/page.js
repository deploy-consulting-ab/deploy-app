import { AssignmentCard } from "@/components/application/assignment/assignment-card";

const AssignmentPage = ({ params }) => {
    const { assignmentId } = params;

    return <div>
        Visiting assignment: {assignmentId}
        <AssignmentCard />
    </div>;
};

export default AssignmentPage;
