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

export { ROUTES_MAP, TYPE_MAP, ICON_MAP };
