import NextAuth from 'next-auth';
import authConfig from '@/auth.config';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { db } from '@/lib/db';
import { getUserById, getUserByEmail, getCombinedPermissionsForUser } from '@/data/user';

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

            if (token.permissions) {
                session.user.permissions = token.permissions;
            }

            if (token.profileId) {
                session.user.profileId = token.profileId;
            }

            return session;
        },
        async jwt({ token, user }) {
            // Only populated on sign in
            if (user) {
                const permissions = await getCombinedPermissionsForUser(user.id);

                token.permissions = permissions;
                token.employeeNumber = user.employee_number;
                token.sub = user.id;
                token.profileId = user.profileId;
            }
            return token;
        },
    },
});
