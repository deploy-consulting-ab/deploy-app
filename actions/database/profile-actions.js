'use server';
import { getProfiles } from '@/data/profile';
import { UpdateProfileSchema } from '@/schemas';
import { updateProfile, getProfileById } from '@/data/profile';

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