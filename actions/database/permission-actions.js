'use server';
import { getPermissions, createPermission, deletePermission } from '@/data/permissions-db';
import { CreatePermissionSchema } from '@/schemas';
/**
 * Get all permissions
 * @returns {Promise<Permission[]>} All permissions
 * @throws {Error} If the permissions are not found
 */
export async function getPermissionsAction() {
    try {
        const permissions = await getPermissions();
        return permissions;
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
export async function createPermissionAction(data) {
    try {
        const validatedFields = CreatePermissionSchema.safeParse(data);
        if (!validatedFields.success) {
            return { error: 'Invalid fields' };
        }
        const validatedData = validatedFields.data;
        const permission = await createPermission(validatedData);
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
export async function deletePermissionAction(id) {
    try {
        await deletePermission(id);
        return { success: 'Permission deleted successfully' };
    } catch (error) {
        return { error: 'Failed to delete permission' };
    }
}