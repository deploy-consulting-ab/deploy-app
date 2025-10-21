import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import { LoginSchema } from '@/schemas';
import { getUserByEmail } from '@/data/user-db';
import bcryptjs from 'bcryptjs';
import { CredentialsSignin } from 'next-auth';

class CustomCredentialsSigninError extends CredentialsSignin {
    constructor(message) {
        super();
        this.message = message;
    }
}

const authObject = {
    providers: [
        Credentials({
            async authorize(credentials) {
                const validatedFields = LoginSchema.safeParse(credentials);

                if (validatedFields.success) {
                    const { email, password } = validatedFields.data;

                    const user = await getUserByEmail(email);

                    // No user
                    if (!user) {
                        throw new CustomCredentialsSigninError("User not found");
                    }

                    // Inactive user
                    if (!user.isActive) {
                        throw new CustomCredentialsSigninError("User is inactive");
                    }

                    // User does not have password (Google auth)
                    if (!user.password) {
                        throw new CustomCredentialsSigninError("Please login with Google");
                    }

                    const passwordMatch = await bcryptjs.compare(password, user.password);

                    if (passwordMatch) {
                        return user;
                    }

                    throw new CustomCredentialsSigninError("Invalid password");
                }

                throw new CustomCredentialsSigninError("Invalid credentials");
            },
        }),
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            allowDangerousEmailAccountLinking: true,
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
