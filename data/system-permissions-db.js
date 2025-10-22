import { db } from '@/lib/db';

/**
 * GET METHODS
 */

/**
 * Get all permissions
 * @returns {Promise<SystemPermission[]>} All permissions
 * @throws {Error} If the permissions are not found
 */
export async function getSystemPermissions() {
    try {
        const permissions = await db.systemPermission.findMany();
        return permissions;
    } catch (error) {
        throw error;
    }
}

/**
 * Get a permission by id
 * @param {string} id
 * @returns {Promise<SystemPermission>} The permission
 * @throws {Error} If the permission is not found
 */
export async function getSystemPermissionById(id) {
    try {
        const permission = await db.systemPermission.findUnique({
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
 * @returns {Promise<SystemPermission>} The created permission
 * @throws {Error} If the permission is not created
 */
export async function createSystemPermission(data) {
    try {
        const permission = await db.systemPermission.create({
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
 * @returns {Promise<SystemPermission>} The updated permission
 * @throws {Error} If the permission is not updated
 */
export async function updateSystemPermission(id, data) {
    try {
        const permission = await db.systemPermission.update({
            where: { id },
            data: data,
            include: {
                profiles: {
                    select: {
                        id: true,
                        name: true,
                        description: true
                    }
                },
                permissionSets: {
                    select: {
                        id: true,
                        name: true,
                        description: true
                    }
                },
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
 * @returns {Promise<SystemPermission>} The deleted permission
 * @throws {Error} If the permission is not deleted
 */
export async function deleteSystemPermission(id) {
    try {
        const permission = await db.systemPermission.delete({
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
        const permission = await db.systemPermission.findUnique({
            where: { id: permissionId },
            include: {
                profiles: {
                    select: {
                        id: true,
                        name: true,
                        description: true
                    }
                },
                permissionSets: {
                    select: {
                        id: true,
                        name: true,
                        description: true
                    }
                },
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
        const totalPermissionsCount = await db.systemPermission.count();
        return totalPermissionsCount;
    } catch (error) {
        throw error;
    }
}
