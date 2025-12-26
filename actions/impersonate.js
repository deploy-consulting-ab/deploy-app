'use server';

import { auth } from '@/auth';
import { getUserById, getCombinedSystemPermissionsForUser } from '@/data/user-db';
import { ADMIN_PROFILE } from '@/lib/rba-constants';
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

        // Get the target user and their system permissions
        const targetUser = await getUserById(userId);
        
        if (!targetUser) {
            return { error: 'User not found' };
        }

        const targetSystemPermissions = await getCombinedSystemPermissionsForUser(userId);

        // Store the current session data for later restoration
        const impersonationData = {
            success: true,
            impersonatedUser: {
                id: targetUser.id,
                name: targetUser.name,
                email: targetUser.email,
                profileId: targetUser.profileId,
                employeeNumber: targetUser.employeeNumber,
                flexEmployeeId: targetUser.flexEmployeeId,
                systemPermissions: targetSystemPermissions,
                image: targetUser.image,
                isActive: targetUser.isActive,
            },
            originalUser: {
                id: session.user.sessionId,
                name: session.user.name,
                email: session.user.email,
                profileId: session.user.profileId,
                employeeNumber: session.user.employeeNumber,
                flexEmployeeId: session.user.flexEmployeeId,
                systemPermissions: session.user.systemPermissions,
                image: session.user.image,
                isActive: session.user.isActive,
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
