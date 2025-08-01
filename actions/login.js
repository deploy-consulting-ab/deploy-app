'use server';

import { LoginSchema } from '@/schemas';
import { success } from 'zod';

export const login = async (values) => {
    /**
     * Since a hacker can get this server action ID and execute it from postman,
     * we need to add extra layer of protection and check that the sent stuff is valid
     */

    // Validate the input values against the schema.
    const validatedFields = LoginSchema.safeParse(values);

    if (!validatedFields.success) {
        console.log('Fields are not correct');
        return { error: 'Invalid fields' };
    }

    return { success: 'Logged in!' };
};
