'use server';

import { signIn } from '@/auth';
import { DEFAULT_REDIRECT_ROUTE } from '@/routes';

export const loginGoogle = async (callbackUrl) => {
    await signIn('google', {
        redirectTo: callbackUrl || DEFAULT_REDIRECT_ROUTE,
    });
};