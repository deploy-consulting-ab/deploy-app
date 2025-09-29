'use server';

import { RegisterSchema } from '@/schemas';
import bcryptjs from 'bcryptjs';
import { createUser, getUserByEmail } from '@/data/user';

export const register = async (values) => {
    /**
     * Since a hacker can get this server action ID and execute it from postman,
     * we need to add extra layer of protection and check that the sent stuff is valid
     */
    // Validate the input values against the schema.
    const validatedFields = RegisterSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: 'Invalid fields' };
    }

    const { email, password, name, profile, employeeNumber } = validatedFields.data;

    const hashedPassword = await bcryptjs.hash(password, 10);

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
        return { error: 'User already existing' };
    }

    const createdUser = await createUser({ name, email, hashedPassword, profile, employeeNumber });

    if (!createdUser) {
        return { error: 'Failed to create user' };
    }

    return { success: 'User registered!' };
};
