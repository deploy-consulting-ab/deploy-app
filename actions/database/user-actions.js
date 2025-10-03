'use server';

import { CreateUserSchema } from '@/schemas';
import bcryptjs from 'bcryptjs';
import {
    createUser,
    getUserByEmail,
    getUserByIdWithPermissions,
    getUsersForProfile,
    deleteUser,
    searchUsers,
    updateUserProfile,
    addPermissionSetToUser,
} from '@/data/user-db';
import { getUsers } from '@/data/user-db';
import { updateUser } from '@/data/user-db';
import { UpdateUserSchema } from '@/schemas';

/**
 * Get all users
 * @returns {Promise<User[]>} All users
 * @throws {Error} If the users are not found
 */
export async function getUsersAction() {
    try {
        const users = await getUsers();
        return users;
    } catch (error) {
        throw error;
    }
}

/**
 * Get all users for a profile
 * @param {string} profileId
 * @returns {Promise<User[]>} All users for the profile
 * @throws {Error} If the users are not found
 */
export async function getUsersForProfileAction(profileId) {
    try {
        const users = await getUsersForProfile(profileId);
        return users;
    } catch (error) {
        throw error;
    }
}

/**
 * Create a user
 * @param {Object} values
 * @returns {Promise<User>} User created
 * @throws {Error} If the user is not created
 */
export async function createUserAction(values) {
    try {
        /**
         * Since a hacker can get this server action ID and execute it from postman,
         * we need to add extra layer of protection and check that the sent stuff is valid
         */
        // Validate the input values against the schema.
        const validatedFields = CreateUserSchema.safeParse(values);

        if (!validatedFields.success) {
            return { error: 'Invalid fields' };
        }

        const { email, password, name, profileId, employeeNumber } = validatedFields.data;

        const hashedPassword = await bcryptjs.hash(password, 10);

        const existingUser = await getUserByEmail(email);

        if (existingUser) {
            throw new Error('User already existing');
        }

        const createdUser = await createUser({
            name,
            email,
            password: hashedPassword,
            profileId,
            employeeNumber,
        });

        if (!createdUser) {
            return { error: 'Failed to create user' };
        }

        return { success: 'User registered!' };
    } catch (error) {
        throw error;
    }
}

/**
 * Update a user
 * @param {string} id
 * @param {Object} data
 * @returns {Promise<User>} User updated
 * @throws {Error} If the user is not updated
 */
export async function updateUserAction(id, data) {
    try {
        const validatedFields = UpdateUserSchema.safeParse(data);

        if (!validatedFields.success) {
            return { error: 'Invalid fields' };
        }
        const validatedData = validatedFields.data;
        await updateUser(id, validatedData);
        return { success: 'User updated!' };
    } catch (error) {
        throw error;
    }
}

/**
 * Get a user by id with permissions
 * @param {string} id
 * @returns {Promise<User>} User with permissions
 * @throws {Error} If the user is not found
 */
export async function getUserByIdWithPermissionsAction(id) {
    try {
        const user = await getUserByIdWithPermissions(id);
        return user;
    } catch (error) {
        throw error;
    }
}

/**
 * Delete a user
 * @param {string} id
 * @returns {Promise<{ success: string } | { error: string }>} Success or error message
 */
export async function deleteUserAction(id) {
    try {
        await deleteUser(id);
        return { success: 'User deleted successfully' };
    } catch (error) {
        throw error;
    }
}

/**
 * Search users by name or email
 * @param {string} searchTerm
 * @returns {Promise<User[]>} Users matching the search term
 * @throws {Error} If the search fails
 */
export async function searchUsersAction(searchTerm) {
    try {
        if (!searchTerm || searchTerm.trim() === '') {
            return [];
        }
        const users = await searchUsers(searchTerm);
        return users;
    } catch (error) {
        throw error;
    }
}

/**
 * Update a user's profile
 * @param {string} userId - The ID of the user to update
 * @param {string} profileId - The ID of the profile to assign
 * @returns {Promise<User>} The updated user
 * @throws {Error} If the update fails
 */
export async function updateUserProfileAction(userId, profileId) {
    try {
        if (!userId || !profileId) {
            throw new Error('User ID and Profile ID are required');
        }

        const updatedUser = await updateUserProfile(userId, profileId);

        return updatedUser;
    } catch (error) {
        throw error;
    }
}

/**
 * Add a permission set to a user
 * @param {string} userId
 * @param {string} permissionSetId
 * @returns {Promise<User>} The updated user
 * @throws {Error} If the update fails
 */
export async function addPermissionSetToUserAction(id, permissionSetId) {
    try {
        const user = await addPermissionSetToUser(id, permissionSetId);
        return user;
    } catch (error) {
        throw error;
    }
}
