'use server';
import {
    getPermissionSets,
    getPermissionSetById,
    createPermissionSet,
    updatePermissionSet,
    deletePermissionSet,
    addPermissionToPermissionSet,
    removePermissionFromPermissionSet,
    addUserToPermissionSet,
    removeUserFromPermissionSet,
    searchPermissionSets,
    getTotalPermissionSetsCount,
} from '@/data/permissionset-db';
import { UpdatePermissionSetSchema } from '@/schemas';

/**
 * Get all permission sets
 * @returns {Promise<PermissionSet[]>} All permission sets
 * @throws {Error} If the permission sets are not found
 */
export async function getPermissionSetsAction() {
    try {
        return await getPermissionSets();
    } catch (error) {
        throw error;
    }
}

/**
 * Get a permission set by id
 * @param {string} id
 * @returns {Promise<PermissionSet>} The permission set
 * @throws {Error} If the permission set is not found
 */
export async function getPermissionSetByIdAction(id) {
    try {
        return await getPermissionSetById(id);
    } catch (error) {
        throw error;
    }
}

/**
 * Create a permission set
 * @param {Object} data
 * @returns {Promise<PermissionSet>} The created permission set
 * @throws {Error} If the permission set is not created
 */
export async function createPermissionSetAction(data) {
    const payload = {
        ...data,
        systemPermissions: data.systemPermissions.map((systemPermission) => ({
            id: systemPermission.id,
        })),
    };
    try {
        return await createPermissionSet(payload);
    } catch (error) {
        throw error;
    }
}

/**
 * Update a permission set
 * @param {string} id
 * @param {Object} data
 * @returns {Promise<PermissionSet>} The updated permission set
 * @throws {Error} If the permission set is not updated
 */
export async function updatePermissionSetAction(id, data) {
    try {
        const validatedFields = UpdatePermissionSetSchema.safeParse(data);

        if (!validatedFields.success) {
            throw new Error('Invalid fields');
        }

        return await updatePermissionSet(id, validatedFields.data);
    } catch (error) {
        throw error;
    }
}

/**
 * Delete a permission set
 * @param {string} id
 * @returns {Promise<PermissionSet>} The deleted permission set
 * @throws {Error} If the permission set is not deleted
 */
export async function deletePermissionSetAction(id) {
    try {
        return await deletePermissionSet(id);
    } catch (error) {
        throw error;
    }
}

/**
 * Add a permission to a permission set
 * @param {string} permissionSetId
 * @param {string} permissionId
 * @returns {Promise<PermissionSet>} The updated permission set
 * @throws {Error} If the permission is not added
 */
export async function addPermissionToPermissionSetAction(permissionSetId, permissionId) {
    try {
        return await addPermissionToPermissionSet(permissionSetId, permissionId);
    } catch (error) {
        throw error;
    }
}

/**
 * Remove a permission from a permission set
 * @param {string} permissionSetId
 * @param {string} permissionId
 * @returns {Promise<PermissionSet>} The updated permission set
 * @throws {Error} If the permission is not removed
 */
export async function removePermissionFromPermissionSetAction(permissionSetId, permissionId) {
    try {
        return await removePermissionFromPermissionSet(permissionSetId, permissionId);
    } catch (error) {
        throw error;
    }
}

/**
 * Add a user to a permission set
 * @param {string} permissionSetId
 * @param {string} userId
 * @returns {Promise<PermissionSet>} The updated permission set
 * @throws {Error} If the user is not added
 */
export async function addUserToPermissionSetAction(permissionSetId, userId) {
    try {
        return await addUserToPermissionSet(permissionSetId, userId);
    } catch (error) {
        throw error;
    }
}

/**
 * Remove a user from a permission set
 * @param {string} permissionSetId
 * @param {string} userId
 * @returns {Promise<PermissionSet>} The updated permission set
 * @throws {Error} If the user is not removed
 */
export async function removeUserFromPermissionSetAction(permissionSetId, userId) {
    try {
        return await removeUserFromPermissionSet(permissionSetId, userId);
    } catch (error) {
        throw error;
    }
}

/**
 * Search permission sets by name or description
 * @param {string} searchTerm
 * @returns {Promise<PermissionSet[]>} Permission sets matching the search term
 * @throws {Error} If the search fails
 */
export async function searchPermissionSetsAction(searchTerm) {
    try {
        return await searchPermissionSets(searchTerm);
    } catch (error) {
        throw error;
    }
}

/**
 * Get the total number of permission sets
 * @returns {Promise<number>} The total number of permission sets
 * @throws {Error} If the total number of permission sets is not found
 */
export async function getTotalPermissionSetsCountAction() {
    try {
        return await getTotalPermissionSetsCount();
    } catch (error) {
        throw error;
    }
}
