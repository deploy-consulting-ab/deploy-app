'use server';

import { updateUser } from '@/data/user';
import { UpdateUserSchema } from '@/schemas';

export const updateUserAction = async (id, data) => {
    try {
        const validatedFields = UpdateUserSchema.safeParse(data);

        if (!validatedFields.success) {
            return { error: 'Invalid fields' };
        }

        const { employeeNumber, profile } = validatedFields.data;

        await updateUser(id, { employeeNumber, profile });

        return { success: 'User updated!' };
    } catch (error) {
        return { error: error.message };
    }
};
