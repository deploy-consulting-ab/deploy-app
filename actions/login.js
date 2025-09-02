'use server';

import { LoginSchema } from '@/schemas';
import { signIn } from '@/auth';
import { HOME_ROUTE } from '@/routes';
import { AuthError } from 'next-auth';

export const login = async (values, callbackUrl) => {
    /**
     * Since a hacker can get this server action ID and execute it from postman,
     * we need to add extra layer of protection and check that the sent stuff is valid
     */

    // Validate the input values against the schema.

    const validatedFields = LoginSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: 'Credentials are not correct' };
    }

    const { email, password } = validatedFields.data;

    try {
        await signIn('credentials', {
            email,
            password,
            redirectTo: callbackUrl || HOME_ROUTE,
        });
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return { error: 'Invalid credentials.' };
                default:
                    return { error: 'Something went wrong.' };
            }
        }
        // This needs to be added for getting proper redirection when succesful login
        throw error;
    }

    return { success: 'Login succesful' };
};
