'use client';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { HeaderComponent } from '@/components/auth/header';
import { SocialComponent } from '@/components/auth/social';
import { BackButtonComponent } from '@/components/auth/back-button';

export const CardWrapperComponent = ({
    children,
    headerLabel,
    backButtonLabel,
    backButtonHref,
    showSocial,
}) => {
    return (
        <Card className="w-[400px] shadow-md">
            <CardHeader>
                <HeaderComponent label={headerLabel} />
            </CardHeader>
            <CardContent>{children}</CardContent>
            {showSocial && (
                <CardFooter>
                    <SocialComponent />
                </CardFooter>
            )}
            <CardFooter>
                <BackButtonComponent label={backButtonLabel} href={backButtonHref} />
            </CardFooter>
        </Card>
    );
};
