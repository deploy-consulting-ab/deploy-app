import { getUsers } from '@/data/user';

export const getUsersAction = async () => {
    try {
        const users = await getUsers();
        return users;
    } catch (error) {
        throw error;
    }
};
