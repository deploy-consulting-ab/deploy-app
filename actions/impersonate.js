'use server';

import { auth } from '@/auth';
import { getUserById, getCombinedPermissionsForUser } from '@/data/user-db';
import { ADMIN_PROFILE } from '@/lib/permissions';
import { revalidatePath } from 'next/cache';

export async function startImpersonation(userId) {
    try {
        const session = await auth();
        
        // Check if user is authenticated and is an admin
        if (!session || session.user.profileId !== ADMIN_PROFILE) {
            return { error: 'Unauthorized access' };
        }

        if (!userId) {
            return { error: 'User ID is required' };
        }

        // Get the target user and their permissions
        const targetUser = await getUserById(userId);
        
        if (!targetUser) {
            return { error: 'User not found' };
        }

        const targetPermissions = await getCombinedPermissionsForUser(userId);

        // Store the current session data for later restoration
        const impersonationData = {
            success: true,
            impersonatedUser: {
                id: targetUser.id,
                name: targetUser.name,
                email: targetUser.email,
                profileId: targetUser.profileId,
                employeeNumber: targetUser.employeeNumber,
                permissions: targetPermissions,
                image: targetUser.image,
            },
            originalUser: {
                id: session.user.sessionId,
                name: session.user.name,
                email: session.user.email,
                profileId: session.user.profileId,
                employeeNumber: session.user.employeeNumber,
                permissions: session.user.permissions,
                image: session.user.image,
            }
        };

        revalidatePath('/');
        return impersonationData;
    } catch (error) {
        console.error('[IMPERSONATION_ERROR]', error);
        return { error: 'Something went wrong' };
    }
}

export async function endImpersonation() {
    try {
        const session = await auth();
        
        if (!session) {
            return { error: 'Unauthorized access' };
        }

        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error('[END_IMPERSONATION_ERROR]', error);
        return { error: 'Something went wrong' };
    }
}
