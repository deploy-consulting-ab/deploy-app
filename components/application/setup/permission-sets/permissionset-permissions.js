'use client';

import { useState, useMemo } from 'react';
import { SystemPermissionsEditableCardComponent } from '@/components/application/setup/system-permissions/system-permissions-editable-card';
import {
    addPermissionToPermissionSetAction,
    removePermissionFromPermissionSetAction,
} from '@/actions/database/permissionset-actions';
import { useTransition } from 'react';
import { toastRichSuccess } from '@/lib/toast-library';

export function PermissionSetPermissions({ permissionSet, totalSystemPermissions }) {
    const [systemPermissionError, setSystemPermissionError] = useState('');
    const [systemPermissionSuccess, setSystemPermissionSuccess] = useState('');
    const [isPending, startTransition] = useTransition();
    const [currentSystemPermissions, setCurrentSystemPermissions] = useState(
        permissionSet.systemPermissions
    );

    const systemPermissions = useMemo(
        () =>
            totalSystemPermissions
                .map((systemPermission) => ({
                    ...systemPermission,
                    assigned: currentSystemPermissions.some((p) => p.id === systemPermission.id),
                }))
                .sort((a, b) => (b.assigned ? 1 : -1)),
        [totalSystemPermissions, currentSystemPermissions]
    );

    const handleSystemPermissionClick = async (systemPermissionId, isAssigned) => {
        setSystemPermissionSuccess('');
        setSystemPermissionError('');

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
                    ? await removePermissionFromPermissionSetAction(
                          permissionSet.id,
                          systemPermissionId
                      )
                    : await addPermissionToPermissionSetAction(
                          permissionSet.id,
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
                setSystemPermissionError(error.message);
            }
        });
    };

    return (
        <SystemPermissionsEditableCardComponent
            entityName="Permission Set"
            totalSystemPermissions={systemPermissions}
            onSystemPermissionClick={handleSystemPermissionClick}
            success={systemPermissionSuccess}
            error={systemPermissionError}
        />
    );
}
