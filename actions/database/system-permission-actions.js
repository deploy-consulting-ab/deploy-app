'use server';
import {
    getSystemPermissions,
    createSystemPermission,
    updateSystemPermission,
    deleteSystemPermission,
    getSystemPermissionById,
    getSystemPermissionAssignmentsById,
    getTotalSystemPermissionsCount,
} from '@/data/system-permissions-db';
import { CreateSystemPermissionSchema } from '@/schemas';
/**
 * Get all permissions
 * @returns {Promise<Permission[]>} All permissions
 * @throws {Error} If the permissions are not found
 */
export async function getSystemPermissionsAction() {
    try {
        const permissions = await getSystemPermissions();
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
export async function getSystemPermissionByIdAction(id) {
    try {
        const permission = await getSystemPermissionById(id);
        return permission;
    } catch (error) {
        throw error;
    }
}

export async function getSystemPermissionAssignmentsByIdAction(id) {
    try {
        const permissionAssignments = await getSystemPermissionAssignmentsById(id);

        const allPermissionAssignments = [
            ...permissionAssignments.profiles.map((profile) => {
                return {
                    ...profile,
                    entityName: 'Profile',
                };
            }),
            ...permissionAssignments.permissionSets.map((set) => {
                return {
                    ...set,
                    entityName: 'Permission Set',
                };
            }),
        ];

        permissionAssignments.allPermissionAssignments = allPermissionAssignments;
        return permissionAssignments;
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
export async function createSystemPermissionAction(data) {
    try {
        const validatedFields = CreateSystemPermissionSchema.safeParse(data);
        if (!validatedFields.success) {
            return { error: 'Invalid fields' };
        }
        const validatedData = validatedFields.data;
        const permission = await createSystemPermission(validatedData);
        return permission;
    } catch (error) {
        throw error;
    }
}
/**
 * Delete a permission
 * @param {string} id
 * @returns {Promise<{ success: string } | { error: string }>} Success or error message
 */
export async function deleteSystemPermissionAction(id) {
    try {
        await deleteSystemPermission(id);
        return { success: 'Permission deleted successfully' };
    } catch (error) {
        return { error: 'Failed to delete permission' };
    }
}

/**
 * Get the total number of permissions
 * @returns {Promise<number>} The total number of permissions
 * @throws {Error} If the total number of permissions is not found
 */
export async function getTotalSystemPermissionsCountAction() {
    try {
        const totalPermissionsCount = await getTotalSystemPermissionsCount();
        return totalPermissionsCount;
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
export async function updateSystemPermissionAction(id, data) {
    try {
        const permission = await updateSystemPermission(id, data);
        return permission;
    } catch (error) {
        throw error;
    }
}
