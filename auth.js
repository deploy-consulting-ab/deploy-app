import NextAuth from 'next-auth';
import authConfig from '@/auth.config';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { db } from '@/lib/db';
import { getUserById, getUserByEmail, getCombinedSystemPermissionsForUser } from '@/data/user-db';

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

                // Add isActive check
                if (!existingUser || !existingUser.isActive) {
                    return false;
                }

                return true;
            }

            const existingUser = await getUserById(user.id);

            // Add isActive check
            if (!existingUser || !existingUser.isActive) {
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

            if (token.employeeNumber) {
                session.user.employeeNumber = token.employeeNumber;
            }

            if (token.flexEmployeeId) {
                session.user.flexEmployeeId = token.flexEmployeeId;
            }

            if (token.systemPermissions) {
                session.user.systemPermissions = token.systemPermissions;
            }

            if (token.profileId) {
                session.user.profileId = token.profileId;
            }

            if (token.isActive) {
                session.user.isActive = token.isActive;
            }

            // Add impersonation data if present
            if (token.impersonating) {
                session.user.impersonating = true;
                session.user.originalUser = token.originalUser;
                // Override session with impersonated user data
                session.user.sessionId = token.impersonatedUser.id;
                session.user.name = token.impersonatedUser.name;
                session.user.email = token.impersonatedUser.email;
                session.user.profileId = token.impersonatedUser.profileId;
                session.user.flexEmployeeId = token.impersonatedUser.flexEmployeeId;
                session.user.employeeNumber = token.impersonatedUser.employeeNumber;
                session.user.systemPermissions = token.impersonatedUser.systemPermissions;
                session.user.image = token.impersonatedUser.image;
                session.user.isActive = token.impersonatedUser.isActive;
            }
            return session;
        },
        async jwt({ token, user, trigger, session }) {
            if (trigger === 'update' && session) {
                // START IMPERSONATING
                if (session.impersonating) {
                    token.originalUser = session.originalUser; // Save original user
                    token.impersonatedUser = session.impersonatedUser; // Save impersonated user details
                    token.impersonating = true;
                }

                // STOP IMPERSONATING
                if (!session.impersonating) {
                    token.impersonating = false;
                    token.originalUser = undefined;
                    token.impersonatedUser = undefined;
                }
            }
            // Only populated on sign in
            if (user) {
                const systemPermissions = await getCombinedSystemPermissionsForUser(user.id);
                
                token.systemPermissions = systemPermissions;
                token.employeeNumber = user.employeeNumber;
                token.flexEmployeeId = user.flexEmployeeId;
                token.sub = user.id;
                token.profileId = user.profileId;
                token.isActive = user.isActive;
            }
            return token;
        },
    },
});
