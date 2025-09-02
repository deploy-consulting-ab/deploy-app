'use server';

import { signIn } from '@/auth';
import { HOME_ROUTE } from '@/routes';

export const loginGoogle = async (callbackUrl) => {
    await signIn('google', {
        redirectTo: callbackUrl || HOME_ROUTE,
    });
};