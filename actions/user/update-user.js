'use server';

import { updateUser } from '@/data/user';
import { UpdateUserSchema } from '@/schemas';

export const updateUserAction = async (id, data) => {

    const validatedFields = UpdateUserSchema.safeParse(data);

    if (!validatedFields.success) {
        return { error: 'Invalid fields' };
    }

    const { employeeNumber, profile } = validatedFields.data;

    const result = await updateUser(id, { employeeNumber, profile });

    if (!result.success) {
        return { error: result.error };
    }

    return { success: 'User updated!' };
};