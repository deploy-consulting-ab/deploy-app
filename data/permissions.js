import { db } from '@/lib/db';

/**
 * GET METHODS
 */

/**
 * Get all permissions
 * @returns {Promise<Permission[]>} All permissions
 * @throws {Error} If the permissions are not found
 */
export async function getPermissions() {
    try {
        const permissions = await db.permission.findMany();
        return permissions;
    } catch (error) {
        throw error;
    }
}
