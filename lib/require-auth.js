import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { LOGIN_ROUTE } from '@/menus/routes';

/**
 * Verify the caller is authenticated before running a server action.
 * @returns {Promise<import('next-auth').Session>} The active session
 */
export async function requireAuth() {
    const session = await auth();

    if (!session?.user?.isActive) {
        redirect(LOGIN_ROUTE);
    }

    return session;
}
