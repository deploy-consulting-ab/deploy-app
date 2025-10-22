import { db } from '@/lib/db';

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
                systemPermissions: true,
                users: true,
            },
        });
        return profile;
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
export async function createProfile(data) {
    try {
        const profile = await db.profile.create({
            data: {
                ...data,
                systemPermissions: {
                    connect: data.systemPermissions,
                },
            },
        });
        return profile;
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
export async function updateProfile(id, data) {
    try {
        const profile = await db.profile.update({
            where: { id },
            data: data,
            include: {
                systemPermissions: true,
                users: true,
            },
        });
        return profile;
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
export async function deleteProfile(id) {
    try {
        const profile = await db.profile.delete({ where: { id } });
        return profile;
    } catch (error) {
        throw error;
    }
}

/**
 * Add a system permission to a profile
 * @param {string} profileId
 * @param {string} systemPermissionId
 * @returns {Promise<Profile>} The updated profile
 */
export async function addSystemPermissionToProfile(profileId, systemPermissionId) {
    try {
        const profile = await db.profile.update({
            where: { id: profileId },
            data: {
                systemPermissions: {
                    connect: { id: systemPermissionId },
                },
            },
            include: {
                systemPermissions: true,
            },
        });
        return profile;
    } catch (error) {
        throw error;
    }
}

/**
 * Remove a system permission from a profile
 * @param {string} profileId
 * @param {string} systemPermissionId
 * @returns {Promise<Profile>} The updated profile
 */
export async function removeSystemPermissionFromProfile(profileId, systemPermissionId) {
    try {
        const profile = await db.profile.update({
            where: { id: profileId },
            data: {
                systemPermissions: {
                    disconnect: { id: systemPermissionId },
                },
            },
            include: {
                systemPermissions: true,
            },
        });
        return profile;
    } catch (error) {
        throw error;
    }
}

/**
 * Get the total number of profiles
 * @returns {Promise<number>} The total number of profiles
 * @throws {Error} If the total number of profiles is not found
 */
export async function getTotalProfilesCount() {
    try {
        const totalProfilesCount = await db.profile.count();
        return totalProfilesCount;
    } catch (error) {
        throw error;
    }
}
