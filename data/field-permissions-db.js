import { db } from '@/lib/db';

/**
 * GET METHODS
 */

/**
 * Get all field permissions
 * @returns {Promise<FieldPermission[]>} All field permissions
 * @throws {Error} If the field permissions are not found
 */
export async function getFieldPermissions() {
    try {
        const fieldPermissions = await db.fieldPermission.findMany({
            orderBy: [{ system: 'asc' }, { objectName: 'asc' }, { label: 'asc' }],
        });
        return fieldPermissions;
    } catch (error) {
        throw error;
    }
}

/**
 * Get a field permission by id including profile and permission set assignments
 * @param {string} id
 * @returns {Promise<FieldPermission>} The field permission with assignments
 * @throws {Error} If the field permission is not found
 */
export async function getFieldPermissionById(id) {
    try {
        const fieldPermission = await db.fieldPermission.findUnique({
            where: { id },
            include: {
                profiles: {
                    select: { id: true, name: true, description: true },
                },
                permissionSets: {
                    select: { id: true, name: true, description: true },
                },
            },
        });
        return fieldPermission;
    } catch (error) {
        throw error;
    }
}

/**
 * Search field permissions by label, fieldName, or objectName
 * @param {string} searchTerm
 * @returns {Promise<FieldPermission[]>} Field permissions matching the search term
 * @throws {Error} If the search fails
 */
export async function searchFieldPermissions(searchTerm) {
    try {
        return await db.fieldPermission.findMany({
            where: {
                OR: [
                    { label: { contains: searchTerm, mode: 'insensitive' } },
                    { fieldName: { contains: searchTerm, mode: 'insensitive' } },
                    { objectName: { contains: searchTerm, mode: 'insensitive' } },
                    { description: { contains: searchTerm, mode: 'insensitive' } },
                ],
            },
            orderBy: [{ system: 'asc' }, { objectName: 'asc' }, { label: 'asc' }],
        });
    } catch (error) {
        throw error;
    }
}

/**
 * CREATE METHODS
 */

/**
 * Create a field permission
 * @param {Object} data
 * @returns {Promise<FieldPermission>} The created field permission
 * @throws {Error} If the field permission is not created
 */
export async function createFieldPermission(data) {
    try {
        return await db.fieldPermission.create({ data });
    } catch (error) {
        throw error;
    }
}

/**
 * UPDATE METHODS
 */

/**
 * Update a field permission
 * @param {string} id
 * @param {Object} data
 * @returns {Promise<FieldPermission>} The updated field permission
 * @throws {Error} If the field permission is not updated
 */
export async function updateFieldPermission(id, data) {
    try {
        return await db.fieldPermission.update({
            where: { id },
            data,
            include: {
                profiles: { select: { id: true, name: true, description: true } },
                permissionSets: { select: { id: true, name: true, description: true } },
            },
        });
    } catch (error) {
        throw error;
    }
}

/**
 * DELETE METHODS
 */

/**
 * Delete a field permission
 * @param {string} id
 * @returns {Promise<FieldPermission>} The deleted field permission
 * @throws {Error} If the field permission is not deleted
 */
export async function deleteFieldPermission(id) {
    try {
        return await db.fieldPermission.delete({ where: { id } });
    } catch (error) {
        throw error;
    }
}

/**
 * PROFILE ASSIGNMENT METHODS
 */

/**
 * Add a field permission to a profile
 * @param {string} profileId
 * @param {string} fieldPermissionId
 * @returns {Promise<Profile>} The updated profile
 * @throws {Error} If the assignment fails
 */
export async function addFieldPermissionToProfile(profileId, fieldPermissionId) {
    try {
        return await db.profile.update({
            where: { id: profileId },
            data: { fieldPermissions: { connect: { id: fieldPermissionId } } },
            include: { fieldPermissions: true },
        });
    } catch (error) {
        throw error;
    }
}

/**
 * Remove a field permission from a profile
 * @param {string} profileId
 * @param {string} fieldPermissionId
 * @returns {Promise<Profile>} The updated profile
 * @throws {Error} If the removal fails
 */
export async function removeFieldPermissionFromProfile(profileId, fieldPermissionId) {
    try {
        return await db.profile.update({
            where: { id: profileId },
            data: { fieldPermissions: { disconnect: { id: fieldPermissionId } } },
            include: { fieldPermissions: true },
        });
    } catch (error) {
        throw error;
    }
}

/**
 * PERMISSION SET ASSIGNMENT METHODS
 */

/**
 * Add a field permission to a permission set
 * @param {string} permissionSetId
 * @param {string} fieldPermissionId
 * @returns {Promise<PermissionSet>} The updated permission set
 * @throws {Error} If the assignment fails
 */
export async function addFieldPermissionToPermissionSet(permissionSetId, fieldPermissionId) {
    try {
        return await db.permissionSet.update({
            where: { id: permissionSetId },
            data: { fieldPermissions: { connect: { id: fieldPermissionId } } },
            include: { fieldPermissions: true },
        });
    } catch (error) {
        throw error;
    }
}

/**
 * Remove a field permission from a permission set
 * @param {string} permissionSetId
 * @param {string} fieldPermissionId
 * @returns {Promise<PermissionSet>} The updated permission set
 * @throws {Error} If the removal fails
 */
export async function removeFieldPermissionFromPermissionSet(permissionSetId, fieldPermissionId) {
    try {
        return await db.permissionSet.update({
            where: { id: permissionSetId },
            data: { fieldPermissions: { disconnect: { id: fieldPermissionId } } },
            include: { fieldPermissions: true },
        });
    } catch (error) {
        throw error;
    }
}
