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
import { CreateSystemPermissionSchema, UpdateSystemPermissionSchema } from '@/schemas';
/**
 * Get all system permissions
 * @returns {Promise<SystemPermission[]>} All system permissions
 * @throws {Error} If the system permissions are not found
 */
export async function getSystemPermissionsAction() {
    try {
        return await getSystemPermissions();
    } catch (error) {
        throw error;
    }
}

/**
 * Get a system permission by id
 * @param {string} id
 * @returns {Promise<SystemPermission>} The system permission
 * @throws {Error} If the system permission is not found
 */
export async function getSystemPermissionByIdAction(id) {
    try {
        return await getSystemPermissionById(id);
    } catch (error) {
        throw error;
    }
}

/**
 * Get the assignments for a system permission
 * @param {string} systemPermissionId
 * @returns {Promise<SystemPermissionAssignments>} The system permission assignments
 * @throws {Error} If the system permission assignments are not found
 */
export async function getSystemPermissionAssignmentsByIdAction(systemPermissionId) {
    try {
        const permissionAssignments = await getSystemPermissionAssignmentsById(systemPermissionId);

        const allSystemPermissionAssignments = [
            ...(permissionAssignments?.profiles || []).map((profile) => {
                return {
                    ...profile,
                    entityName: 'Profile',
                };
            }),
            ...(permissionAssignments?.permissionSets || []).map((set) => {
                return {
                    ...set,
                    entityName: 'Permission Set',
                };
            }),
        ];

        permissionAssignments.allSystemPermissionAssignments = allSystemPermissionAssignments;
        return permissionAssignments;
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
export async function createSystemPermissionAction(data) {
    try {
        const validatedFields = CreateSystemPermissionSchema.safeParse(data);
        if (!validatedFields.success) {
            throw new Error('Invalid fields');
        }
        const validatedData = validatedFields.data;
        return await createSystemPermission(validatedData);
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
        return await deleteSystemPermission(id);
    } catch (error) {
        throw error;
    }
}

/**
 * Get the total number of permissions
 * @returns {Promise<number>} The total number of permissions
 * @throws {Error} If the total number of permissions is not found
 */
export async function getTotalSystemPermissionsCountAction() {
    try {
        return await getTotalSystemPermissionsCount();
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
export async function updateSystemPermissionAction(id, data) {
    try {
        const validatedFields = UpdateSystemPermissionSchema.safeParse(data);

        if (!validatedFields.success) {
            throw new Error('Invalid fields');
        }

        const payload = validatedFields.data;
        return await updateSystemPermission(id, payload);
    } catch (error) {
        throw error;
    }
}
