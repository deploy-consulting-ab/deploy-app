import { AssignmentListComponent } from '@/components/application/assignment/assignments-list';
import { fetchAssignments } from '@/actions/salesforce/fetch-assignments';

const AssignmentsPage = async () => {
    const data = await fetchAssignments();
    return <div className="py-4">
        <AssignmentListComponent assignments={data} />
    </div>;
};

export default AssignmentsPage;
