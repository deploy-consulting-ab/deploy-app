import { db } from '@/lib/db';

/**
 * GET METHODS
 */

/**
 * Get all permissions
 * @returns {Promise<Permission[]>} All permissions
 * @throws {Error} If the permissions are not found
 */
export async function getSystemPermissions() {
    try {
        const permissions = await db.permission.findMany();
        return permissions;
    } catch (error) {
        throw error;
    }
}

/**
 * Get a permission by id
 * @param {string} id
 * @returns {Promise<Permission>} The permission
 * @throws {Error} If the permission is not found
 */
export async function getSystemPermissionById(id) {
    try {
        const permission = await db.permission.findUnique({
            where: { id },
        });
        return permission;
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
export async function createSystemPermission(data) {
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
 * Update a permission
 * @param {string} id
 * @param {Object} data
 * @returns {Promise<Permission>} The updated permission
 * @throws {Error} If the permission is not updated
 */
export async function updateSystemPermission(id, data) {
    try {
        const permission = await db.permission.update({
            where: { id },
            data: data,
            include: {
                profiles: true,
                permissionSets: true,
            },
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
export async function deleteSystemPermission(id) {
    try {
        const permission = await db.permission.delete({
            where: { id },
        });
        return permission;
    } catch (error) {
        throw error;
    }
}

/**
 * Get all PermissionSets and Profiles that use a specific Permission
 * @param {string} permissionId - The ID of the permission
 * @returns {Promise<{profiles: Profile[], permissionSets: PermissionSet[]}>} The profiles and permission sets that use this permission
 * @throws {Error} If the permission assignments are not found
 */
export async function getSystemPermissionAssignmentsById(permissionId) {
    try {
        const permission = await db.permission.findUnique({
            where: { id: permissionId },
            include: {
                profiles: true,
                permissionSets: true,
            },
        });
        return permission;
    } catch (error) {
        throw error;
    }
}

/**
 * Get the total number of permissions
 * @returns {Promise<number>} The total number of permissions
 * @throws {Error} If the total number of permissions is not found
 */
export async function getTotalSystemPermissionsCount() {
    try {
        const totalPermissionsCount = await db.permission.count();
        return totalPermissionsCount;
    } catch (error) {
        throw error;
    }
}
