import { redirect } from 'next/navigation';
import { EMPLOYEES_LIST_ROUTE } from '@/menus/routes';

export default async function EmployeeOccupancyStatsPage({ params }) {
    const { employeeId } = await params;
    redirect(`${EMPLOYEES_LIST_ROUTE}/${employeeId}`);
}
