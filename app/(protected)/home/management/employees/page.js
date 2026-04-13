'use server';

import { EmployeesListComponent } from '@/components/application/management/employees/employees-list';
import { getEmployees } from '@/actions/salesforce/salesforce-actions';

const EmployeesPage = async () => {
    let employees = null;
    let error = null;

    try {
        employees = await getEmployees();
    } catch (err) {
        error = err;
    }

    return (
        <div>
            <EmployeesListComponent error={error} employees={employees} />
        </div>
    );
};

export default EmployeesPage;
