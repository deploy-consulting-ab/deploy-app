'use client';

import { useState, useMemo } from 'react';
import { SystemPermissionsEditableCardComponent } from '@/components/application/setup/system-permissions/system-permissions-editable-card';
import {
    addSystemPermissionToProfileAction,
    removeSystemPermissionFromProfileAction,
} from '@/actions/database/profile-actions';
import { useTransition } from 'react';
import { toastRichSuccess } from '@/lib/toast-library';

export function ProfilePermissions({ profile, totalSystemPermissions }) {
    const [permissionError, setPermissionError] = useState('');
    const [permissionSuccess, setPermissionSuccess] = useState('');
    const [isPending, startTransition] = useTransition();
    const [currentSystemPermissions, setCurrentSystemPermissions] = useState(
        profile.systemPermissions
    );

    const systemPermissions = useMemo(
        () =>
            totalSystemPermissions
                .map((systemPermission) => ({
                    ...systemPermission,
                    assigned: currentSystemPermissions.some((p) => p.id === systemPermission.id),
                }))
                .sort((a, b) => (b.assigned ? 1 : -1)), // Sort by assigned status (assigned permissions first)
        [totalSystemPermissions, currentSystemPermissions]
    );

    const handleSystemPermissionClick = async (systemPermissionId, isAssigned) => {
        setPermissionSuccess('');
        setPermissionError('');

        // Optimistically update the UI
        const targetPermission = totalSystemPermissions.find((p) => p.id === systemPermissionId);
        if (!targetPermission) return;

        if (isAssigned) {
            setCurrentSystemPermissions((prev) => prev.filter((p) => p.id !== systemPermissionId));
        } else {
            setCurrentSystemPermissions((prev) => [...prev, targetPermission]);
        }

        startTransition(async () => {
            try {
                isAssigned
                    ? await removeSystemPermissionFromProfileAction(
                          profile.id,
                          systemPermissionId
                      )
                    : await addSystemPermissionToProfileAction(
                          profile.id,
                          systemPermissionId
                      );

                toastRichSuccess({
                    message: isAssigned
                        ? 'System permission removed successfully'
                        : 'System permission added successfully',
                });
            } catch (error) {
                // Revert the optimistic update on error
                if (isAssigned) {
                    setCurrentSystemPermissions((prev) => [...prev, targetPermission]);
                } else {
                    setCurrentSystemPermissions((prev) =>
                        prev.filter((p) => p.id !== systemPermissionId)
                    );
                }
                setPermissionError(error.message);
            }
        });
    };

    return (
        <SystemPermissionsEditableCardComponent
            entityName="Profile"
            totalSystemPermissions={systemPermissions}
            onSystemPermissionClick={handleSystemPermissionClick}
            success={permissionSuccess}
            error={permissionError}
        />
    );
}
