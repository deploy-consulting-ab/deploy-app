'use client';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { HeaderComponent } from '@/components/auth/header';
import { SocialComponent } from '@/components/auth/social';
import { BackButtonComponent } from '@/components/auth/back-button';

export const CardWrapperComponent = ({
    children,
    showLogo = true,
    showBackButton = true,
    showSocial = true,
    headerLabel,
    backButtonLabel,
    backButtonHref,
}) => {
    return (
        // bg-gray-800 interesting color
        <Card className="w-[350px] md:w-[400px] shadow-sm py-8">
            <CardHeader>
                {showLogo && <HeaderComponent label={headerLabel} />}
            </CardHeader>
            <CardContent>{children}</CardContent>
            {showSocial && (
                <CardFooter>
                    <SocialComponent />
                </CardFooter>
            )}
            <CardFooter>
                {showBackButton && (
                    <BackButtonComponent label={backButtonLabel} href={backButtonHref} />
                )}
            </CardFooter>
        </Card>
    );
};
