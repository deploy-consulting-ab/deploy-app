import { Home, Calendar, Percent, ClipboardList, TrendingUp, Shield } from 'lucide-react';
import {
    HOME_ROUTE,
    HOLIDAYS_ROUTE,
    OCCUPANCY_ROUTE,
    ASSIGNMENTS_ROUTE,
    OPPORTUNITIES_ROUTE,
    ADMIN_ROUTE,
} from '@/menus/routes';

// Map of menu items with their required permissions and configurations
export const MENU_ITEMS_MAP = {
    home: {
        title: 'Home',
        url: HOME_ROUTE,
        icon: Home,
        permission: 'Home:View',
    },
    holidays: {
        title: 'Holidays',
        url: HOLIDAYS_ROUTE,
        icon: Calendar,
        permission: 'Holidays:View',
    },
    occupancy: {
        title: 'Occupancy',
        url: OCCUPANCY_ROUTE,
        icon: Percent,
        permission: 'Occupancy:View',
    },
    assignments: {
        title: 'Assignments',
        url: ASSIGNMENTS_ROUTE,
        icon: ClipboardList,
        permission: 'Assignments:View',
    },
    opportunities: {
        title: 'Opportunities',
        url: OPPORTUNITIES_ROUTE,
        icon: TrendingUp,
        permission: 'Opportunities:View',
    },
    admin: {
        title: 'Admin',
        url: ADMIN_ROUTE,
        icon: Shield,
        permission: 'Admin:View',
    },
};
