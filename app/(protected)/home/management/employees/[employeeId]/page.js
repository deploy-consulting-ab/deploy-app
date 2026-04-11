import { getEmployeeById } from '@/actions/salesforce/salesforce-actions';

const EmployeePage = async ({ params }) => {
    const { employeeId } = await params;

    let employee = null;
    let error = null;

    try {
        console.log('employeeId', employeeId);
        employee = await getEmployeeById(employeeId);
        console.log('employee', employee);
    } catch (err) {
        error = err;
    }

    return (
        <div>
            <p>
                {employee?.Name}
            </p>
        </div>
    );
};

export default EmployeePage;
