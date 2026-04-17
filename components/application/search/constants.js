import {
    OPPORTUNITIES_ROUTE,
    ASSIGNMENTS_ROUTE,
    EMPLOYEES_LIST_ROUTE,
    USERS_ROUTE,
    PROFILES_ROUTE,
} from '@/menus/routes';
import { TrendingUp, ClipboardList, Users, User, UserCircle } from 'lucide-react';

const TYPE_MAP = {
    Opportunity: 'Opportunity',
    Assignment: 'Assignment',
    Employee: 'Employee',
    User: 'User',
    Profile: 'Profile',
};

const ROUTES_MAP = {
    [TYPE_MAP.Opportunity]: OPPORTUNITIES_ROUTE,
    [TYPE_MAP.Assignment]: ASSIGNMENTS_ROUTE,
    [TYPE_MAP.Employee]: EMPLOYEES_LIST_ROUTE,
    [TYPE_MAP.User]: USERS_ROUTE,
    [TYPE_MAP.Profile]: PROFILES_ROUTE,
};

const ICON_MAP = {
    [TYPE_MAP.Opportunity]: TrendingUp,
    [TYPE_MAP.Assignment]: ClipboardList,
    [TYPE_MAP.Employee]: Users,
    [TYPE_MAP.User]: User,
    [TYPE_MAP.Profile]: UserCircle,
};

// Extra columns to show when a given type is present in the result set.
// Each entry is a standard TanStack column definition.
const EXTRA_COLUMNS_BY_TYPE = {
    [TYPE_MAP.Opportunity]: [{ accessorKey: 'subType', header: 'Account' }],
    [TYPE_MAP.Assignment]: [{ accessorKey: 'subType', header: 'Account' }],
    [TYPE_MAP.Employee]: [{ accessorKey: 'subType', header: 'Employee ID' }],
    [TYPE_MAP.User]: [{ accessorKey: 'subType', header: 'Profile' }],
    [TYPE_MAP.Profile]: [{ accessorKey: 'subType', header: 'Profile' }],
};

export { ROUTES_MAP, TYPE_MAP, ICON_MAP, EXTRA_COLUMNS_BY_TYPE };
