'use server';

import { RegisterSchema } from '@/schemas';
import bcryptjs from 'bcryptjs';
import {
    createUser,
    getUserByEmail,
    getUserByIdWithPermissions,
    getUsersForProfile,
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
    /**
     * Since a hacker can get this server action ID and execute it from postman,
     * we need to add extra layer of protection and check that the sent stuff is valid
     */
    // Validate the input values against the schema.
    const validatedFields = RegisterSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: 'Invalid fields' };
    }

    const { email, password, name, profileId, employeeNumber } = validatedFields.data;

    const hashedPassword = await bcryptjs.hash(password, 10);

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
        return { error: 'User already existing' };
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

        console.log('validatedData', validatedData);

        await updateUser(id, validatedData);

        return { success: 'User updated!' };
    } catch (error) {
        return { error: error.message };
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
