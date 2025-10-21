import { Home, Calendar, Percent, ClipboardList, TrendingUp, Shield, Users, UserCircle, Box, Settings } from 'lucide-react';
import {
    HOME_ROUTE,
    SETUP_ROUTE,
    HOLIDAYS_ROUTE,
    OCCUPANCY_ROUTE,
    ASSIGNMENTS_ROUTE,
    OPPORTUNITIES_ROUTE,
    USERS_ROUTE,
    PROFILES_ROUTE,
    PERMISSION_SETS_ROUTE,
    SYSTEM_PERMISSIONS_ROUTE
} from '@/menus/routes';
import {
    VIEW_HOME_PERMISSION,
    VIEW_HOLIDAYS_PERMISSION,
    VIEW_OCCUPANCY_PERMISSION,
    VIEW_ASSIGNMENTS_PERMISSION,
    VIEW_OPPORTUNITIES_PERMISSION,
    VIEW_SETUP_PERMISSION,
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
    }
};

export const SETUP_MENU_ITEMS_MAP = {
    home: {
        title: 'Setup',
        url: SETUP_ROUTE,
        icon: Settings,
        permission: VIEW_HOME_PERMISSION,
    },
    users: {
        title: 'Users',
        url: USERS_ROUTE,
        icon: Users,
        permission: VIEW_SETUP_PERMISSION,
    },
    profiles: {
        title: 'Profiles',
        url: PROFILES_ROUTE,
        icon: UserCircle,
        permission: VIEW_SETUP_PERMISSION,
    },
    permissionSets: {
        title: 'Permission Sets',
        url: PERMISSION_SETS_ROUTE,
        icon: Box,
        permission: VIEW_SETUP_PERMISSION,
    },
    permissions: {
        title: 'System Permissions',
        url: SYSTEM_PERMISSIONS_ROUTE,
        icon: Shield,
        permission: VIEW_SETUP_PERMISSION,
    },
    
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