'use server';
import { getProfiles } from '@/data/profile-db';
import { UpdateProfileSchema } from '@/schemas';
import {
    updateProfile,
    getProfileById,
    addSystemPermissionToProfile,
    removeSystemPermissionFromProfile,
    createProfile,
    deleteProfile,
    getTotalProfilesCount,
} from '@/data/profile-db';

/**
 * Get all profiles
 * @returns {Promise<Profile[]>} All profiles
 * @throws {Error} If the profiles are not found
 */
export async function getProfilesAction() {
    try {
        return await getProfiles();
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
            throw new Error('Invalid fields');
        }

        const payload = validatedFields.data;
        return await updateProfile(id, payload);
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
        return await getProfileById(id);
    } catch (error) {
        throw error;
    }
}

/**
 * Add a system permission to a profile
 * @param {string} profileId
 * @param {string} systemPermissionId
 * @returns {Promise<Profile>} The updated profile
 * @throws {Error} If the permission is not added
 */
export async function addSystemPermissionToProfileAction(profileId, systemPermissionId) {
    try {
        return await addSystemPermissionToProfile(profileId, systemPermissionId);
    } catch (error) {
        throw error;
    }
}

/**
 * Remove a system permission from a profile
 * @param {string} profileId
 * @param {string} systemPermissionId
 * @returns {Promise<Profile>} The updated profile
 * @throws {Error} If the permission is not removed
 */
export async function removeSystemPermissionFromProfileAction(profileId, systemPermissionId) {
    try {
        return await removeSystemPermissionFromProfile(profileId, systemPermissionId);
    } catch (error) {
        throw error;
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
        systemPermissions: data.systemPermissions.map((systemPermission) => ({
            id: systemPermission.id,
        })),
    };
    try {
        return await createProfile(payload);
    } catch (error) {
        throw error;
    }
}

/**
 * Delete a profile
 * @param {string} id
 * @returns {Promise<Profile>} The deleted profile
 * @throws {Error} If the profile is not deleted
 */
export async function deleteProfileAction(id) {
    try {
        return await deleteProfile(id);
    } catch (error) {
        throw error;
    }
}

/**
 * Get the total number of profiles
 * @returns {Promise<number>} The total number of profiles
 * @throws {Error} If the total number of profiles is not found
 */
export async function getTotalProfilesCountAction() {
    try {
        return await getTotalProfilesCount();
    } catch (error) {
        throw error;
    }
}
