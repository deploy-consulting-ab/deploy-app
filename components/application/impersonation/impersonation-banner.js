'use client';

import { useImpersonation } from '@/hooks/use-impersonation';
import { Button } from '@/components/ui/button';

export function ImpersonationBannerComponent() {
    const { isImpersonating, originalUser, impersonatedUser, endImpersonation, isLoading } =
        useImpersonation();

    if (!isImpersonating) return null;

    return (
        <div className="bg-yellow-100 dark:bg-yellow-900 px-4 py-2 flex items-center justify-between">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
                Viewing as {impersonatedUser?.name} ({impersonatedUser?.email}). You are signed in
                as {originalUser?.name} ({originalUser?.email})
            </p>
            <Button
                variant="outline"
                size="sm"
                onClick={endImpersonation}
                disabled={isLoading}
                className="bg-yellow-200 dark:bg-yellow-800 border-yellow-300 dark:border-yellow-700"
            >
                {isLoading ? 'Returning...' : 'Return to My Account'}
            </Button>
        </div>
    );
}
