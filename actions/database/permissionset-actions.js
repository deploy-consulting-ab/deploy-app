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
} from '@/data/permissionset-db';
import { UpdatePermissionSetSchema } from '@/schemas';

/**
 * Get all permission sets
 * @returns {Promise<PermissionSet[]>} All permission sets
 * @throws {Error} If the permission sets are not found
 */
export async function getPermissionSetsAction() {
    try {
        const permissionSets = await getPermissionSets();
        return permissionSets;
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
        const permissionSet = await getPermissionSetById(id);
        return permissionSet;
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
        permissions: data.permissions.map((permission) => ({ id: permission.id })),
    };
    try {
        const permissionSet = await createPermissionSet(payload);
        return permissionSet;
    } catch (error) {
        throw error;
    }
}

/**
 * Update a permission set
 * @param {string} id
 * @param {Object} data
 * @returns {Promise<{ success: string } | { error: string }>} Success or error message
 */
export async function updatePermissionSetAction(id, data) {
    try {
        const validatedFields = UpdatePermissionSetSchema.safeParse(data);

        if (!validatedFields.success) {
            return { error: 'Invalid fields' };
        }

        const { description } = validatedFields.data;

        await updatePermissionSet(id, { description });

        return { success: 'Permission Set updated!' };
    } catch (error) {
        throw error;
    }
}

/**
 * Delete a permission set
 * @param {string} id
 * @returns {Promise<{ success: string } | { error: string }>} Success or error message
 */
export async function deletePermissionSetAction(id) {
    try {
        await deletePermissionSet(id);
        return { success: 'Permission Set deleted successfully' };
    } catch (error) {
        return { error: 'Failed to delete permission set' };
    }
}

/**
 * Add a permission to a permission set
 * @param {string} permissionSetId
 * @param {string} permissionId
 * @returns {Promise<{ success: string } | { error: string }>} Success or error message
 */
export async function addPermissionToPermissionSetAction(permissionSetId, permissionId) {
    try {
        await addPermissionToPermissionSet(permissionSetId, permissionId);
        return { success: 'Permission added successfully' };
    } catch (error) {
        return { error: 'Failed to add permission' };
    }
}

/**
 * Remove a permission from a permission set
 * @param {string} permissionSetId
 * @param {string} permissionId
 * @returns {Promise<{ success: string } | { error: string }>} Success or error message
 */
export async function removePermissionFromPermissionSetAction(permissionSetId, permissionId) {
    try {
        await removePermissionFromPermissionSet(permissionSetId, permissionId);
        return { success: 'Permission removed successfully' };
    } catch (error) {
        return { error: 'Failed to remove permission' };
    }
}

/**
 * Add a user to a permission set
 * @param {string} permissionSetId
 * @param {string} userId
 * @returns {Promise<{ success: string } | { error: string }>} Success or error message
 */
export async function addUserToPermissionSetAction(permissionSetId, userId) {
    try {
        await addUserToPermissionSet(permissionSetId, userId);
        return { success: 'User added successfully' };
    } catch (error) {
        return { error: 'Failed to add user' };
    }
}

/**
 * Remove a user from a permission set
 * @param {string} permissionSetId
 * @param {string} userId
 * @returns {Promise<{ success: string } | { error: string }>} Success or error message
 */
export async function removeUserFromPermissionSetAction(permissionSetId, userId) {
    try {
        await removeUserFromPermissionSet(permissionSetId, userId);
        return { success: 'User removed successfully' };
    } catch (error) {
        return { error: 'Failed to remove user' };
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
        const permissionSets = await searchPermissionSets(searchTerm);
        return permissionSets;
    } catch (error) {
        throw error;
    }
}