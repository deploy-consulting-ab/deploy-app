/**
 * Validation schema for the index file.
 * This schema defines the structure and types of the properties expected in the index file.
 */

import * as z from 'zod';
import { PROFILES } from '@/lib/permissions';

export const LoginSchema = z.object({
    email: z.email({ message: 'Email is required' }),
    password: z.string().min(1, {
        message: 'Password should not be empty',
    }),
});

export const RegisterSchema = z.object({
    email: z.email({ message: 'Email is required' }),
    password: z.string().min(6, {
        message: 'Minimum 6 characters required',
    }),
    name: z.string().min(1, {
        message: 'Name is required',
    }),
    employeeNumber: z.string().min(4, {
        message: 'Employee number is required',
    }),
    profileId: z.enum(PROFILES, {
        required_error: 'Profile is required',
    }),
});

export const UpdateUserSchema = z.object({
    employeeNumber: z.string().min(4, {
        message: 'Employee number is required',
    }),
    profileId: z.enum(PROFILES, {
        required_error: 'Profile is required',
    }),
});
