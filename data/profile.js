import { db } from '@/lib/db';

/**
 * GET METHODS
 */

/**
 * Get all profiles
 * @returns {Promise<Profile[]>} All profiles
 * @throws {Error} If the profiles are not found
 */
export async function getProfiles() {
    try {
        const profiles = await db.profile.findMany();
        return profiles;
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
export async function getProfileById(id) {
    try {
        const profile = await db.profile.findUnique({
            where: { id },
            include: {
                permissions: true,
            },
        });
        return profile;
    } catch (error) {
        throw error;
    }
}

export async function updateProfile(id, data) {
    try {
        const profile = await db.profile.update({ where: { id }, data });
        return profile;
    } catch (error) {
        throw error;
    }
}

/**
 * Add a permission to a profile
 * @param {string} profileId
 * @param {string} permissionId
 * @returns {Promise<Profile>} The updated profile
 */
export async function addPermissionToProfile(profileId, permissionId) {
    try {
        const profile = await db.profile.update({
            where: { id: profileId },
            data: {
                permissions: {
                    connect: { id: permissionId }
                }
            },
            include: {
                permissions: true
            }
        });
        return profile;
    } catch (error) {
        throw error;
    }
}

/**
 * Remove a permission from a profile
 * @param {string} profileId
 * @param {string} permissionId
 * @returns {Promise<Profile>} The updated profile
 */
export async function removePermissionFromProfile(profileId, permissionId) {
    try {
        const profile = await db.profile.update({
            where: { id: profileId },
            data: {
                permissions: {
                    disconnect: { id: permissionId }
                }
            },
            include: {
                permissions: true
            }
        });
        return profile;
    } catch (error) {
        throw error;
    }
}