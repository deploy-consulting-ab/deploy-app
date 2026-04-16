import { OPPORTUNITIES_ROUTE, ASSIGNMENTS_ROUTE, EMPLOYEES_LIST_ROUTE } from '@/menus/routes';
import { TrendingUp, ClipboardList, Users } from 'lucide-react';

const TYPE_MAP = {
    Opportunity: 'Opportunity',
    Assignment: 'Assignment',
    Employee: 'Employee',
};

const ROUTES_MAP = {
    [TYPE_MAP.Opportunity]: OPPORTUNITIES_ROUTE,
    [TYPE_MAP.Assignment]: ASSIGNMENTS_ROUTE,
    [TYPE_MAP.Employee]: EMPLOYEES_LIST_ROUTE,
};

const ICON_MAP = {
    [TYPE_MAP.Opportunity]: TrendingUp,
    [TYPE_MAP.Assignment]: ClipboardList,
    [TYPE_MAP.Employee]: Users,
};

// Extra columns to show when a given type is present in the result set.
// Each entry is a standard TanStack column definition.
const EXTRA_COLUMNS_BY_TYPE = {
    [TYPE_MAP.Opportunity]: [
        { accessorKey: 'subType', header: 'Account' },
    ],
    [TYPE_MAP.Assignment]: [
        { accessorKey: 'subType', header: 'Account' },
    ],
    [TYPE_MAP.Employee]: [
        { accessorKey: 'subType', header: 'Employee ID' },
    ],
};

export { ROUTES_MAP, TYPE_MAP, ICON_MAP, EXTRA_COLUMNS_BY_TYPE };
