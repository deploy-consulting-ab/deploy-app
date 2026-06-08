'use server';

import {
    getFieldPermissions,
    getFieldPermissionById,
    getFieldPermissionAssignmentsById,
    getTotalFieldPermissionsCount,
    searchFieldPermissions,
    createFieldPermission,
    updateFieldPermission,
    deleteFieldPermission,
    addFieldPermissionToProfile,
    removeFieldPermissionFromProfile,
    addFieldPermissionToPermissionSet,
    removeFieldPermissionFromPermissionSet,
} from '@/data/field-permissions-db';
import { CreateFieldPermissionSchema, UpdateFieldPermissionSchema } from '@/schemas';

/**
 * Get all field permissions
 * @returns {Promise<FieldPermission[]>} All field permissions
 */
export async function getFieldPermissionsAction() {
    try {
        return await getFieldPermissions();
    } catch (error) {
        throw error;
    }
}

/**
 * Get a field permission by id
 * @param {string} id
 * @returns {Promise<FieldPermission>} The field permission
 */
export async function getFieldPermissionByIdAction(id) {
    try {
        return await getFieldPermissionById(id);
    } catch (error) {
        throw error;
    }
}

/**
 * Get a field permission with its profile and permission set assignments
 * @param {string} id
 * @returns {Promise<FieldPermission>} The field permission with assignments
 */
export async function getFieldPermissionAssignmentsByIdAction(id) {
    try {
        const fieldPermission = await getFieldPermissionAssignmentsById(id);

        const allAssignments = [
            ...(fieldPermission?.profiles || []).map((profile) => ({
                ...profile,
                entityName: 'Profile',
            })),
            ...(fieldPermission?.permissionSets || []).map((set) => ({
                ...set,
                entityName: 'Permission Set',
            })),
        ];

        fieldPermission.allAssignments = allAssignments;
        return fieldPermission;
    } catch (error) {
        throw error;
    }
}

/**
 * Get the total number of field permissions
 * @returns {Promise<number>} The total count
 */
export async function getTotalFieldPermissionsCountAction() {
    try {
        return await getTotalFieldPermissionsCount();
    } catch (error) {
        throw error;
    }
}

/**
 * Search field permissions
 * @param {string} searchTerm
 * @returns {Promise<FieldPermission[]>} Matching field permissions
 */
export async function searchFieldPermissionsAction(searchTerm) {
    try {
        if (!searchTerm || searchTerm.trim() === '') {
            return [];
        }
        return await searchFieldPermissions(searchTerm);
    } catch (error) {
        throw error;
    }
}

/**
 * Create a field permission
 * @param {Object} data
 * @returns {Promise<FieldPermission>} The created field permission
 */
export async function createFieldPermissionAction(data) {
    try {
        const validatedFields = CreateFieldPermissionSchema.safeParse(data);
        if (!validatedFields.success) {
            throw new Error('Invalid fields');
        }
        return await createFieldPermission(validatedFields.data);
    } catch (error) {
        throw error;
    }
}

/**
 * Update a field permission
 * @param {string} id
 * @param {Object} data
 * @returns {Promise<FieldPermission>} The updated field permission
 */
export async function updateFieldPermissionAction(id, data) {
    try {
        const validatedFields = UpdateFieldPermissionSchema.safeParse(data);
        if (!validatedFields.success) {
            throw new Error('Invalid fields');
        }
        return await updateFieldPermission(id, validatedFields.data);
    } catch (error) {
        throw error;
    }
}

/**
 * Delete a field permission
 * @param {string} id
 * @returns {Promise<FieldPermission>} The deleted field permission
 */
export async function deleteFieldPermissionAction(id) {
    try {
        return await deleteFieldPermission(id);
    } catch (error) {
        throw error;
    }
}

/**
 * Add a field permission to a profile
 * @param {string} profileId
 * @param {string} fieldPermissionId
 */
export async function addFieldPermissionToProfileAction(profileId, fieldPermissionId) {
    try {
        return await addFieldPermissionToProfile(profileId, fieldPermissionId);
    } catch (error) {
        throw error;
    }
}

/**
 * Remove a field permission from a profile
 * @param {string} profileId
 * @param {string} fieldPermissionId
 */
export async function removeFieldPermissionFromProfileAction(profileId, fieldPermissionId) {
    try {
        return await removeFieldPermissionFromProfile(profileId, fieldPermissionId);
    } catch (error) {
        throw error;
    }
}

/**
 * Add a field permission to a permission set
 * @param {string} permissionSetId
 * @param {string} fieldPermissionId
 */
export async function addFieldPermissionToPermissionSetAction(permissionSetId, fieldPermissionId) {
    try {
        return await addFieldPermissionToPermissionSet(permissionSetId, fieldPermissionId);
    } catch (error) {
        throw error;
    }
}

/**
 * Remove a field permission from a permission set
 * @param {string} permissionSetId
 * @param {string} fieldPermissionId
 */
export async function removeFieldPermissionFromPermissionSetAction(
    permissionSetId,
    fieldPermissionId
) {
    try {
        return await removeFieldPermissionFromPermissionSet(permissionSetId, fieldPermissionId);
    } catch (error) {
        throw error;
    }
}
