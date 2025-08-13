import { AssignmentListComponent } from '@/components/application/assignment/assignments-list';
import { fetchAssignments } from '@/actions/salesforce/fetch-assignments';
import { getAssignmentsByEmployeeNumber } from '@/actions/salesforce/salesforce-actions';

const AssignmentsPage = async () => {
    const assignments = await getAssignmentsByEmployeeNumber('D003');
    return (
        <div className="py-4">
            <AssignmentListComponent assignments={assignments} />
        </div>
    );
};

export default AssignmentsPage;