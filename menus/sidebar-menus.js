import { getMenuForRole } from '@/menus/menu-builder';
import { ROLE_PERMISSIONS } from '@/lib/permissions';

export function getMenuItems(userRole) {
    return getMenuForRole(userRole, ROLE_PERMISSIONS);
}
