import * as z from 'zod';

export const RegisterWrapperSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().min(1, 'Description is required'),
    id: z.string().min(1, 'ID is required'),
});
