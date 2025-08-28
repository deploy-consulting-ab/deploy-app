'use server';

import { signIn } from '@/auth';
import { DEFAULT_REDIRECT_ROUTE } from '@/routes';

export const loginGoogle = async () => {
    await signIn('google', {
        redirectTo: DEFAULT_REDIRECT_ROUTE,
    });
};