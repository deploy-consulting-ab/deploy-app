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

            if (token.employeeNumber) {
                session.user.employeeNumber = token.employeeNumber;
            }

            if (token.permissions) {
                session.user.permissions = token.permissions;
            }

            if (token.profileId) {
                session.user.profileId = token.profileId;
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
                session.user.employeeNumber = token.impersonatedUser.employeeNumber;
                session.user.permissions = token.impersonatedUser.permissions;
            }

            return session;
        },
        async jwt({ token, user, trigger, session }) {
            if (trigger === "update" && session) {
                // START IMPERSONATING
                if (session.impersonating) {
                    token.originalUser = session.originalUser; // Save original user
                    token.impersonatedUser = session.impersonatedUser; // Save impersonated user details
                    token.impersonating = true;
                }
                
                // STOP IMPERSONATING
                if (session.stopImpersonating) {
                    console.log('#### STOP IMPERSONATING');
                    token.impersonating = false;
                    token.originalUser = undefined;
                    token.impersonatedId = undefined;
                    token.impersonatedName = undefined;
                    token.impersonatedEmail = undefined;
                    token.impersonatedProfileId = undefined;
                    token.impersonatedEmployeeNumber = undefined;
                    token.impersonatedPermissions = undefined;
                    token.impersonatedUser = undefined;
                }
            }
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
