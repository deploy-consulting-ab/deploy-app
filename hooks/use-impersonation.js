'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, redirect } from 'next/navigation';
import { startImpersonation, endImpersonation } from '@/actions/impersonate';

export const useImpersonation = () => {
    const { data: session, update } = useSession();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleStartImpersonation = async (userId) => {
        try {
            setIsLoading(true);

            const result = await startImpersonation(userId);

            if (result.error) {
                throw new Error(result.error);
            }

            // Update the session with impersonation data
            await update({
                impersonating: true,
                originalUser: result.originalUser,
                impersonatedUser: {
                    id: result.impersonatedUser.id,
                    name: result.impersonatedUser.name,
                    email: result.impersonatedUser.email,
                    profileId: result.impersonatedUser.profileId,
                    employeeNumber: result.impersonatedUser.employeeNumber,
                    permissions: result.impersonatedUser.permissions,
                    image: result.impersonatedUser.image,
                },
            });

            // Refresh the page to update all components with new user data
            router.refresh();
        } catch (error) {
            console.error('Impersonation error:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const handleEndImpersonation = async () => {
        try {
            setIsLoading(true);

            const result = await endImpersonation();

            if (result.error) {
                throw new Error(result.error);
            }

            // Restore original user data
            if (session?.user?.originalUser) {
                await update({
                    impersonating: false,
                    originalUser: null,
                    impersonatedUser: null,
                    image: null,
                });
            }

            // Refresh the page to update all components
            router.refresh();
        } catch (error) {
            console.error('End impersonation error:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isImpersonating: session?.user?.impersonating || false,
        originalUser: session?.user?.originalUser,
        impersonatedUser: session?.user,
        startImpersonation: handleStartImpersonation,
        endImpersonation: handleEndImpersonation,
        isLoading,
    };
};
