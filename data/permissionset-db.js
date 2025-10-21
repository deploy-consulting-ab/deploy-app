import { db } from '@/lib/db';

/**
 * Get all permission sets
 * @returns {Promise<PermissionSet[]>} All permission sets
 * @throws {Error} If the permission sets are not found
 */
export async function getPermissionSets() {
    try {
        const permissionSets = await db.permissionSet.findMany({
            include: {
                permissions: true,
                users: true,
            },
        });
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
export async function getPermissionSetById(id) {
    try {
        const permissionSet = await db.permissionSet.findUnique({
            where: { id },
            include: {
                permissions: true,
                users: true,
            },
        });
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
export async function createPermissionSet(data) {
    try {
        const permissionSet = await db.permissionSet.create({
            data: {
                name: data.name,
                description: data.description,
                permissions: {
                    connect: data.permissions || [],
                },
            },
            include: {
                permissions: true,
                users: true,
            },
        });
        return permissionSet;
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
export async function updatePermissionSet(id, data) {
    try {
        const permissionSet = await db.permissionSet.update({
            where: { id },
            data: {
                description: data.description,
            },
            include: {
                permissions: true,
                users: true,
            },
        });
        return permissionSet;
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
export async function deletePermissionSet(id) {
    try {
        const permissionSet = await db.permissionSet.delete({
            where: { id },
        });
        return permissionSet;
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
export async function addPermissionToPermissionSet(permissionSetId, permissionId) {
    try {
        const permissionSet = await db.permissionSet.update({
            where: { id: permissionSetId },
            data: {
                permissions: {
                    connect: { id: permissionId },
                },
            },
            include: {
                permissions: true,
                users: true,
            },
        });
        return permissionSet;
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
export async function removePermissionFromPermissionSet(permissionSetId, permissionId) {
    try {
        const permissionSet = await db.permissionSet.update({
            where: { id: permissionSetId },
            data: {
                permissions: {
                    disconnect: { id: permissionId },
                },
            },
            include: {
                permissions: true,
                users: true,
            },
        });
        return permissionSet;
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
export async function addUserToPermissionSet(permissionSetId, userId) {
    try {
        const permissionSet = await db.permissionSet.update({
            where: { id: permissionSetId },
            data: {
                users: {
                    connect: { id: userId },
                },
            },
            include: {
                permissions: true,
                users: true,
            },
        });
        return permissionSet;
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
export async function removeUserFromPermissionSet(permissionSetId, userId) {
    try {
        const permissionSet = await db.permissionSet.update({
            where: { id: permissionSetId },
            data: {
                users: {
                    disconnect: { id: userId },
                },
            },
            include: {
                permissions: true,
                users: true,
            },
        });
        return permissionSet;
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
export async function searchPermissionSets(searchTerm) {
    try {
        const permissionSets = await db.permissionSet.findMany({
            where: { name: { contains: searchTerm, mode: 'insensitive' } },
        });
        return permissionSets;
    } catch (error) {
        throw error;
    }
}

/**
 * Get the total number of permission sets
 * @returns {Promise<number>} The total number of permission sets
 * @throws {Error} If the total number of permission sets is not found
 */
export async function getTotalPermissionSetsCount() {
    try {
        const totalPermissionSetsCount = await db.permissionSet.count();
        return totalPermissionSetsCount;
    } catch (error) {
        throw error;
    }
}
