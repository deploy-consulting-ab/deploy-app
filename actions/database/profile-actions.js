'use server';
import { getProfiles } from '@/data/profile';
import { UpdateProfileSchema } from '@/schemas';
import {
    updateProfile,
    getProfileById,
    addPermissionToProfile,
    removePermissionFromProfile,
} from '@/data/profile';

/**
 * Get all profiles
 * @returns {Promise<Profile[]>} All profiles
 * @throws {Error} If the profiles are not found
 */
export async function getProfilesAction() {
    try {
        const profiles = await getProfiles();
        return profiles;
    } catch (error) {
        throw error;
    }
}

/**
 * Update a profile
 * @param {string} id
 * @param {Object} data
 * @returns {Promise<Profile>} The updated profile
 * @throws {Error} If the profile is not updated
 */
export async function updateProfileAction(id, data) {
    try {
        const validatedFields = UpdateProfileSchema.safeParse(data);

        if (!validatedFields.success) {
            return { error: 'Invalid fields' };
        }

        const { description } = validatedFields.data;

        await updateProfile(id, { description });

        return { success: 'Profile updated!' };
    } catch (error) {
        throw error;
    }
}

/**
 * Get a profile by id
 * @param {string} id
 * @returns {Promise<Profile>} The profile
 * @throws {Error} If the profile is not found
 */
export async function getProfileByIdAction(id) {
    try {
        const profile = await getProfileById(id);
        return profile;
    } catch (error) {
        throw error;
    }
}

/**
 * Add a permission to a profile
 * @param {string} profileId
 * @param {string} permissionId
 * @returns {Promise<{ success: string } | { error: string }>} Success or error message
 */
export async function addPermissionToProfileAction(profileId, permissionId) {
    try {
        await addPermissionToProfile(profileId, permissionId);
        return { success: 'Permission added successfully' };
    } catch (error) {
        return { error: 'Failed to add permission' };
    }
}

/**
 * Remove a permission from a profile
 * @param {string} profileId
 * @param {string} permissionId
 * @returns {Promise<{ success: string } | { error: string }>} Success or error message
 */
export async function removePermissionFromProfileAction(profileId, permissionId) {
    try {
        await removePermissionFromProfile(profileId, permissionId);
        return { success: 'Permission removed successfully' };
    } catch (error) {
        return { error: 'Failed to remove permission' };
    }
}
