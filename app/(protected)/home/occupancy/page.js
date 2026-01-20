import { redirect } from 'next/navigation';
import { OCCUPANCY_LIST_ROUTE } from '@/menus/routes';

export default function OccupancyPage() {
    redirect(OCCUPANCY_LIST_ROUTE);
}
