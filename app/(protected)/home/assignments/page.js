'use server';

import { getAssignmentsByEmployeeNumber } from '@/actions/salesforce/salesforce-actions';
import { AssignmentListComponent } from '@/components/application/assignment/assignments-list';
const AssignmentsPage = async () => {
    const employeeNumber = 'D003'; // You might want to get this from session or props

    let assignments = null;
    let error = null;
    try {
        assignments = await getAssignmentsByEmployeeNumber(employeeNumber);
    } catch (err) {
        console.log('Error on assignment page:', err.message);
        error = err;
    }

    return (
        <div className="py-4">
            <AssignmentListComponent
                error={error}
                assignments={assignments}
                employeeNumber={employeeNumber}
            />
        </div>
    );
};

export default AssignmentsPage;
