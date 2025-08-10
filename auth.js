import NextAuth from 'next-auth';
import authConfig from '@/auth.config';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { db } from '@/lib/db';
import { getUserById } from '@/data/user';

export const { handlers, signIn, signOut, auth } = NextAuth({
    ...authConfig,
    adapter: PrismaAdapter(db),
    callbacks: {
        async signIn({ user }) {
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

            return session;
        },
        async jwt({ token }) {
            // Check if I am logged out
            if (!token.sub) {
                return token;
            }

            // Token sub equals to the user id in the database
            const loggedUser = await getUserById(token.sub);
            if (!loggedUser) {
                return token;
            }

            token.salesforceId = loggedUser['salesforce_id'];
            token.employeeNumber = loggedUser['employee_number'];
            return token;
        },
    },
});
