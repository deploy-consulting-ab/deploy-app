'use server';
import { getProfiles } from '@/data/profile-db';
import { UpdateProfileSchema } from '@/schemas';
import {
    updateProfile,
    getProfileById,
    addPermissionToProfile,
    removePermissionFromProfile,
    createProfile,
    deleteProfile,
    getTotalProfilesCount
} from '@/data/profile-db';

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

/**
 * Create a profile
 * @param {Object} data
 * @returns {Promise<Profile>} The created profile
 * @throws {Error} If the profile is not created
 */
export async function createProfileAction(data) {
    const payload = {
        ...data,
        permissions: data.permissions.map((permission) => ({ id: permission.id })),
    };
    try {
        const profile = await createProfile(payload);
        return profile;
    } catch (error) {
        throw error;
    }
}

/**
 * Delete a profile
 * @param {string} id
 * @returns {Promise<{ success: string } | { error: string }>} Success or error message
 */
export async function deleteProfileAction(id) {
    try {
        await deleteProfile(id);
        return { success: 'Profile deleted successfully' };
    } catch (error) {
        return { error: 'Failed to delete profile' };
    }
}

/**
 * Get the total number of profiles
 * @returns {Promise<number>} The total number of profiles
 * @throws {Error} If the total number of profiles is not found
 */
export async function getTotalProfilesCountAction() {
    try {
        const totalProfilesCount = await getTotalProfilesCount();
        return totalProfilesCount;
    } catch (error) {
        throw error;
    }
}