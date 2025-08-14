'use server';

import { getAssignmentsByEmployeeNumber } from '@/actions/salesforce/salesforce-actions';
import { AssignmentListComponent } from '@/components/application/assignment/assignments-list';

const AssignmentsPage = async () => {
    const employeeNumber = 'D003'; // You might want to get this from session or props
    const assignments = await getAssignmentsByEmployeeNumber(employeeNumber);

    return (
        <div className="py-4">
            <AssignmentListComponent 
                assignments={assignments} 
                employeeNumber={employeeNumber}
            />
        </div>
    );
};

export default AssignmentsPage;