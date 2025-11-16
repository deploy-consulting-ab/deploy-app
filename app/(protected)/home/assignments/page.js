'use server';

import { getAssignmentsByEmployeeNumber } from '@/actions/salesforce/salesforce-actions';
import { AssignmentsListComponent } from '@/components/application/assignment/assignments-list';
import { auth } from '@/auth';

const AssignmentsPage = async () => {
    const session = await auth();
    const { user } = session;

    let assignments = null;
    let error = null;
    try {
        assignments = await getAssignmentsByEmployeeNumber(user?.employeeNumber);
    } catch (err) {
        error = err;
    }

    return (
        <div className="py-4">
            <AssignmentsListComponent
                error={error}
                assignments={assignments}
                employeeNumber={user?.employeeNumber}
            />
        </div>
    );
};

export default AssignmentsPage;
