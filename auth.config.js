import Credentials from 'next-auth/providers/credentials';
import { LoginSchema } from '@/schemas';
import { getUserByEmail } from '@/data/user';
import bcryptjs from 'bcryptjs';

const authObject = {
    providers: [
        Credentials({
            async authorize(credentials) {
                const validatedFields = LoginSchema.safeParse(credentials);

                if (validatedFields.success) {
                    const { email, password } = validatedFields.data;

                    const user = await getUserByEmail(email);

                    // No user, or user does not have a password (Google auth)
                    if (!user || !user.password) {
                        return null;
                    }

                    const passwordMatch = await bcryptjs.compare(password, user.password);

                    if (passwordMatch) {
                        return user;
                    }
                }

                return null;
            },
        }),
    ],
    jwt: {
        maxAge: 6 * 60 * 60, // 12 hours in seconds
    },
    session: {
        strategy: 'jwt',
        maxAge: 6 * 60 * 60, // 12 hours in seconds
        updateAge: 60 * 60, // Optional: refresh session every hour
    },
};

export default authObject;
