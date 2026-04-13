import { redirect } from 'next/navigation';
import { OCCUPANCY_STATS_ROUTE } from '@/menus/routes';

export default function OccupancyPage() {
    redirect(OCCUPANCY_STATS_ROUTE);
}
