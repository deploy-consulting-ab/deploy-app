'use server';
import { getPermissions } from '@/data/permissions-db';

/**
 * Get all permissions
 * @returns {Promise<Permission[]>} All permissions
 * @throws {Error} If the permissions are not found
 */
export async function getPermissionsAction() {
    try {
        const permissions = await getPermissions();
        return permissions;
    } catch (error) {
        throw error;
    }
}
