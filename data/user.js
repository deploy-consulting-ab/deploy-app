import { db } from '@/lib/db';

export const getUserByEmail = async (email) => {
    try {
        const existingUser = await db.user.findUnique({
            where: {
                email,
            },
        });
        return existingUser;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const getUserById = async (id) => {
    try {
        const existingUser = await db.user.findUnique({
            where: {
                id,
            },
        });
        return existingUser;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const createUser = async (data) => {
    try {
        const { name, email, hashedPassword } = data;

        const user = await db.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });

        return user;
    } catch (error) {}
};
