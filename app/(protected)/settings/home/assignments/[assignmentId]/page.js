const AssignmentPage = ({ params }) => {
    
    const { assignmentId } = params

    return <div>
        Visiting assignment: {assignmentId}
    </div>;
};

export default AssignmentPage;
