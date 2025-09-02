import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import { LoginSchema } from '@/schemas';
import { getUserByEmail } from '@/data/user';
import bcryptjs from 'bcryptjs';

const authObject = {
    // Add this callbacks to the auth config because NextAuth is not using the callbacks from the auth.js file due to Prisma and Edge Runtime issues
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role;
                token.salesforceId = user.salesforce_id;
                token.employeeNumber = user.employee_number;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.role = token.role;
                session.user.salesforceId = token.salesforceId;
                session.user.employeeNumber = token.employeeNumber;
            }
            return session;
        }
    },
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
