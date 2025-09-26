import { getMenuForRole } from '@/menus/menu-builder';
import { ROLE_PERMISSIONS } from '@/lib/permissions';

export function getMenuItems(userRole, userPermissions) {
    return getMenuForRole(userRole, userPermissions);
}
