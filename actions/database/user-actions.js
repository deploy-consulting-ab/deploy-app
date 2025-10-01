'use server';

import { RegisterSchema } from '@/schemas';
import bcryptjs from 'bcryptjs';
import { createUser, getUserByEmail, getUserByIdWithPermissions } from '@/data/user';
import { getUsers } from '@/data/user';
import { updateUser } from '@/data/user';
import { UpdateUserSchema } from '@/schemas';

export async function getUsersAction() {
    try {
        const users = await getUsers();
        return users;
    } catch (error) {
        throw error;
    }
}

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

export async function getUserByIdWithPermissionsAction(id) {
    try {
        const user = await getUserByIdWithPermissions(id);
        return user;
    } catch (error) {
        throw error;
    }
}
