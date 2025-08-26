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

            // FAKE USER FOR TESTING AND PREVENT NEON OVERLOADED
            return true;

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
            // const loggedUser = await getUserById(token.sub);
            
            // FAKE USER FOR TESTING AND PREVENT NEON OVERLOADED
            const loggedUser = {
                salesforce_id: '001234567890',
                employee_number: 'D003',
                email: 'asas@test.com',
                name: 'UUJEKS',
                role: 'admin',
                department: 'IT',
                location: 'New York',
                phone: '1234567890',
                address: '123 Main St, Anytown, USA',
            }

            console.info('Remove user', loggedUser);

            if (!loggedUser) {
                return token;
            }
            

            token.salesforceId = loggedUser['salesforce_id'];
            token.employeeNumber = loggedUser['employee_number'];
            return token;
        },
    },
});
