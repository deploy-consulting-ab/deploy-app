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

/**
 * Create a permission
 * @param {Object} data
 * @returns {Promise<Permission>} The created permission
 * @throws {Error} If the permission is not created
 */
export async function createPermission(data) {
    try {
        const permission = await db.permission.create({
            data,
        });
        return permission;
    } catch (error) {
        throw error;
    }
}

/**
 * Delete a permission
 * @param {string} id
 * @returns {Promise<Permission>} The deleted permission
 * @throws {Error} If the permission is not deleted
 */
export async function deletePermission(id) {
    try {
        const permission = await db.permission.delete({
            where: { id },
        });
        return permission;
    } catch (error) {
        throw error;
    }
}
