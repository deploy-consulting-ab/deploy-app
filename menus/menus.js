import { Home, Calendar, Percent, ClipboardList, TrendingUp, Shield } from 'lucide-react';
import {
    HOME_ROUTE,
    HOLIDAYS_ROUTE,
    OCCUPANCY_ROUTE,
    ASSIGNMENTS_ROUTE,
    OPPORTUNITIES_ROUTE,
    ADMIN_ROUTE,
} from '@/menus/routes';
import {
    VIEW_HOME_PERMISSION,
    VIEW_HOLIDAYS_PERMISSION,
    VIEW_OCCUPANCY_PERMISSION,
    VIEW_ASSIGNMENTS_PERMISSION,
    VIEW_OPPORTUNITIES_PERMISSION,
    VIEW_ADMIN_PERMISSION,
} from '@/lib/permissions';

// Map of menu items with their required permissions and configurations
export const MENU_ITEMS_MAP = {
    home: {
        title: 'Home',
        url: HOME_ROUTE,
        icon: Home,
        permission: VIEW_HOME_PERMISSION,
    },
    holidays: {
        title: 'Holidays',
        url: HOLIDAYS_ROUTE,
        icon: Calendar,
        permission: VIEW_HOLIDAYS_PERMISSION,
    },
    occupancy: {
        title: 'Occupancy',
        url: OCCUPANCY_ROUTE,
        icon: Percent,
        permission: VIEW_OCCUPANCY_PERMISSION,
    },
    assignments: {
        title: 'Assignments',
        url: ASSIGNMENTS_ROUTE,
        icon: ClipboardList,
        permission: VIEW_ASSIGNMENTS_PERMISSION,
    },
    opportunities: {
        title: 'Opportunities',
        url: OPPORTUNITIES_ROUTE,
        icon: TrendingUp,
        permission: VIEW_OPPORTUNITIES_PERMISSION,
    },
    admin: {
        title: 'Admin',
        url: ADMIN_ROUTE,
        icon: Shield,
        permission: VIEW_ADMIN_PERMISSION,
    },
};

export const SETUP_MENU_ITEMS_MAP = {
    home: {
        title: 'Home',
        url: HOME_ROUTE,
        icon: Home,
        permission: VIEW_HOME_PERMISSION,
    }
    /**
     * User
     *  Create User
     *  Edit User - data table with users
     * Profile
     *  Create Profile, select permission sets
     *  Edit Profile - data table with profiles
     * Permission Set
     *  Create Permission Set
     *  Edit Permission Set - data table with permission sets
     * Permission
     *  Create Permission
     *  Edit Permission - data table with permissions     * 
     */
};