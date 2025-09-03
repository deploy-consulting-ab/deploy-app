import { Home, Calendar, Percent, ClipboardList, TrendingUp, Shield } from 'lucide-react';

import {
    HOME_ROUTE,
    HOLIDAYS_ROUTE,
    OCCUPANCY_ROUTE,
    ASSIGNMENTS_ROUTE,
    OPPORTUNITIES_ROUTE,
    ADMIN_ROUTE,
} from '@/menus/routes';

export const ADMIN_ROLE_MENU = [
    {
        title: 'Home',
        url: HOME_ROUTE,
        icon: Home,
    },
    {
        title: 'Holidays',
        url: HOLIDAYS_ROUTE,
        icon: Calendar,
    },
    {
        title: 'Occupancy',
        url: OCCUPANCY_ROUTE,
        icon: Percent,
    },
    {
        title: 'Assignments',
        url: ASSIGNMENTS_ROUTE,
        icon: ClipboardList,
    },
    {
        title: 'Opportunities',
        url: OPPORTUNITIES_ROUTE,
        icon: TrendingUp,
    },
    {
        title: 'Admin',
        url: ADMIN_ROUTE,
        icon: Shield,
    },
];

export const MANAGEMENT_ROLE_MENU = [
    {
        title: 'Home',
        url: HOME_ROUTE,
        icon: Home,
    },
    {
        title: 'Holidays',
        url: HOLIDAYS_ROUTE,
        icon: Calendar,
    },
    {
        title: 'Occupancy',
        url: OCCUPANCY_ROUTE,
        icon: Percent,
    },
    {
        title: 'Assignments',
        url: ASSIGNMENTS_ROUTE,
        icon: ClipboardList,
    },
    {
        title: 'Opportunities',
        url: OPPORTUNITIES_ROUTE,
        icon: TrendingUp,
    },
];

export const CONSULTANT_ROLE_MENU = [
    {
        title: 'Home',
        url: HOME_ROUTE,
        icon: Home,
    },
    {
        title: 'Holidays',
        url: HOLIDAYS_ROUTE,
        icon: Calendar,
    },
    {
        title: 'Occupancy',
        url: OCCUPANCY_ROUTE,
        icon: Percent,
    },
    {
        title: 'Assignments',
        url: ASSIGNMENTS_ROUTE,
        icon: ClipboardList,
    },
];

export const SALES_ROLE_MENU = [
    {
        title: 'Home',
        url: HOME_ROUTE,
        icon: Home,
    },
    {
        title: 'Holidays',
        url: HOLIDAYS_ROUTE,
        icon: Calendar,
    },
    {
        title: 'Opportunities',
        url: OPPORTUNITIES_ROUTE,
        icon: TrendingUp,
    },
];
