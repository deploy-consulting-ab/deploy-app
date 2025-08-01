/**
 * Validation schema for the index file.
 * This schema defines the structure and types of the properties expected in the index file.
 */

import * as z from 'zod';

export const LoginSchema = z.object({
    email: z.email({ message : "Email is required" }),
    password: z.string().min(1, {
        message: 'Password should not be empty',
    }),
});
