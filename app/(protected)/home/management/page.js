import { redirect } from 'next/navigation';
import { MANAGEMENT_ROUTE } from '@/menus/routes';

export default function ManagementPage() {
    redirect(MANAGEMENT_ROUTE);
}