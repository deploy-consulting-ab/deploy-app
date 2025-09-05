'use server';
import { signOut } from '@/auth';
import { LOGIN_ROUTE } from '@/menus/routes';

export const logout = async () => {
    await signOut({
        redirectTo: LOGIN_ROUTE, // This was not happening automatically, might be a bug
    });
};
