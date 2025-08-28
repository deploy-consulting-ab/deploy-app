'use client';

import { FcGoogle } from 'react-icons/fc';
import { Button } from '@/components/ui/button';
import { CardWrapperComponent } from '@/components/auth/card-wrapper';
import { loginGoogle } from '@/actions/login-google';
import { useSearchParams } from 'next/navigation';

export const LoginFormGoogleComponent = () => {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl');

    const handleGoogleLogin = () => {
        loginGoogle(callbackUrl);
    };

    return (
        <CardWrapperComponent showSocial={false} showBackButton={false} showLogo={true}>
            <div className="flex flex-col items-center space-y-4">
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                    Sign in with your Deploy account to continue
                </p>
                <Button
                    size="lg"
                    className="w-full shadow-box dark:bg-white dark:hover:bg-white/60 flex items-center justify-center gap-x-2"
                    variant="outline"
                    onClick={handleGoogleLogin}
                >
                    <FcGoogle className="h-5 w-5" />
                    <span>Continue with Google</span>
                </Button>
            </div>
        </CardWrapperComponent>
    );
};
