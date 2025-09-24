import NextAuth from 'next-auth';
import authConfig from '@/auth.config';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { db } from '@/lib/db';
import { getUserById, getUserByEmail } from '@/data/user';

export const { handlers, signIn, signOut, auth } = NextAuth({
    ...authConfig,
    adapter: PrismaAdapter(db),
    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider !== 'credentials') {

                if (process.env.ENABLE_AUTO_REGISTRATION === 'true') {
                    return true;
                }
                
                const existingUser = await getUserByEmail(user.email);

                if (!existingUser) {
                    return false;
                }

                return true;
            }

            const existingUser = await getUserById(user.id);

            if (!existingUser) {
                return false;
            }

            return true;
        },
        async session({ session, token }) {
            if (!session.user) {
                return session;
            }

            if (token.sub) {
                session.user.sessionId = token.sub;
            }

            if (token.salesforceId) {
                session.user.salesforceId = token.salesforceId;
            }

            if (token.employeeNumber) {
                session.user.employeeNumber = token.employeeNumber;
            }

            if (token.role) {
                session.user.role = token.role;
            }

            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                // This runs only on sign in
                token.salesforceId = user.salesforce_id;
                token.employeeNumber = user.employee_number;
                token.role = user.role;
            }
            return token;
        },
    },
});
