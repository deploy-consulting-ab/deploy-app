'use server';

import { requireAuth } from '@/lib/require-auth';
import {
    getSystemPermissions,
    createSystemPermission,
    updateSystemPermission,
    deleteSystemPermission,
    getSystemPermissionById,
    getSystemPermissionAssignmentsById,
    getTotalSystemPermissionsCount,
    searchSystemPermissions,
} from '@/data/system-permissions-db';
import { CreateSystemPermissionSchema, UpdateSystemPermissionSchema } from '@/schemas';
/**
 * Get all system permissions
 * @returns {Promise<SystemPermission[]>} All system permissions
 * @throws {Error} If the system permissions are not found
 */
export async function getSystemPermissionsAction() {
    await requireAuth();
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
    await requireAuth();
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
    await requireAuth();
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
    await requireAuth();
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
    await requireAuth();
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
    await requireAuth();
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
    await requireAuth();
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

export async function searchSystemPermissionsAction(searchTerm) {
    await requireAuth();
    try {
        if (!searchTerm || searchTerm.trim() === '') {
            return [];
        }
        return await searchSystemPermissions(searchTerm);
    } catch (error) {
        throw error;
    }
}
