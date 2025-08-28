'use client';

import { FcGoogle } from 'react-icons/fc';
import { Button } from '@/components/ui/button';
import { ModeToggleComponent } from '@/components/application/mode-toggle';
import { loginGoogle } from '@/actions/login-google';

export const SocialComponent = () => {
    const handleGoogleLogin = () => {
        loginGoogle();
    };

    return (
        <div className="flex items-center w-full gap-x-2">
            <Button
                size="lg"
                className="shadow-box dark:bg-white dark:hover:bg-white/60 flex-1"
                variant="outline"
                onClick={handleGoogleLogin}
            >
                <FcGoogle className="h-5 w-5" />
            </Button>

            <ModeToggleComponent className="flex-1" />
        </div>
    );
};
