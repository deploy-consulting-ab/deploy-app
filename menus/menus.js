import {
    Home,
    Calendar,
    Percent,
    ClipboardList,
    TrendingUp,
    Shield,
    Users,
    UserCircle,
    Box,
    Settings,
} from 'lucide-react';
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
    SYSTEM_PERMISSIONS_ROUTE,
} from '@/menus/routes';
import {
    VIEW_HOME_PERMISSION,
    VIEW_HOLIDAYS_PERMISSION,
    VIEW_OCCUPANCY_PERMISSION,
    VIEW_ASSIGNMENTS_PERMISSION,
    VIEW_OPPORTUNITIES_PERMISSION,
    VIEW_SETUP_PERMISSION,
} from '@/lib/rba-constants';

// Map of menu items with their required permissions and configurations
export const MENU_ITEMS_MAP = {
    home: {
        title: 'Home',
        url: HOME_ROUTE,
        icon: Home,
        systemPermission: VIEW_HOME_PERMISSION,
    },
    holidays: {
        title: 'Holidays',
        url: HOLIDAYS_ROUTE,
        icon: Calendar,
        systemPermission: VIEW_HOLIDAYS_PERMISSION,
    },
    occupancy: {
        title: 'Occupancy',
        url: OCCUPANCY_ROUTE,
        icon: Percent,
        systemPermission: VIEW_OCCUPANCY_PERMISSION,
    },
    assignments: {
        title: 'Assignments',
        url: ASSIGNMENTS_ROUTE,
        icon: ClipboardList,
        systemPermission: VIEW_ASSIGNMENTS_PERMISSION,
    },
    opportunities: {
        title: 'Opportunities',
        url: OPPORTUNITIES_ROUTE,
        icon: TrendingUp,
        systemPermission: VIEW_OPPORTUNITIES_PERMISSION,
    },
};

export const SETUP_MENU_ITEMS_MAP = {
    home: {
        title: 'Setup',
        url: SETUP_ROUTE,
        icon: Settings,
        systemPermission: VIEW_HOME_PERMISSION,
    },
    users: {
        title: 'Users',
        url: USERS_ROUTE,
        icon: Users,
        systemPermission: VIEW_SETUP_PERMISSION,
    },
    profiles: {
        title: 'Profiles',
        url: PROFILES_ROUTE,
        icon: UserCircle,
        systemPermission: VIEW_SETUP_PERMISSION,
    },
    permissionSets: {
        title: 'Permission Sets',
        url: PERMISSION_SETS_ROUTE,
        icon: Box,
        systemPermission: VIEW_SETUP_PERMISSION,
    },
    systemPermissions: {
        title: 'System Permissions',
        url: SYSTEM_PERMISSIONS_ROUTE,
        icon: Shield,
        systemPermission: VIEW_SETUP_PERMISSION,
    },
};
