'use server';

import { signIn } from '@/auth';
import { HOME_ROUTE } from '@/menus/routes';

export const loginGoogle = async (callbackUrl) => {
    await signIn('google', {
        redirectTo: callbackUrl || HOME_ROUTE,
    });
};