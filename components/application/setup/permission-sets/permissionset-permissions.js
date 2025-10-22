'use client';

import { useState } from 'react';
import { SystemPermissionsEditableCardComponent } from '@/components/application/setup/system-permissions/system-permissions-editable-card';
import {
    addPermissionToPermissionSetAction,
    removePermissionFromPermissionSetAction,
} from '@/actions/database/permissionset-actions';
import { useTransition } from 'react';

export function PermissionSetPermissions({ permissionSet, totalSystemPermissions }) {
    const [systemPermissionError, setSystemPermissionError] = useState('');
    const [systemPermissionSuccess, setSystemPermissionSuccess] = useState('');
    const [isPending, startTransition] = useTransition();
    const [currentSystemPermissions, setCurrentSystemPermissions] = useState(permissionSet.systemPermissions);

    const handleSystemPermissionClick = async (systemPermissionId, isAssigned) => {
        setSystemPermissionSuccess('');
        setSystemPermissionError('');

        // Optimistically update the UI
        if (isAssigned) {
            setCurrentSystemPermissions((prev) => prev.filter((p) => p.id !== systemPermissionId));
        } else {
            const newSystemPermission = totalSystemPermissions.find((p) => p.id === systemPermissionId);
            if (newSystemPermission) {
                setCurrentSystemPermissions((prev) => [...prev, newSystemPermission]);
            }
        }

        startTransition(async () => {
            try {
                isAssigned
                    ? await removePermissionFromPermissionSetAction(permissionSet.id, systemPermissionId)
                    : await addPermissionToPermissionSetAction(permissionSet.id, systemPermissionId);

                setSystemPermissionSuccess('System Permission added successfully');
            } catch (error) {
                // Revert the optimistic update on error
                if (isAssigned) {
                    const revertSystemPermission = totalSystemPermissions.find((p) => p.id === systemPermissionId);
                    if (revertSystemPermission) {
                        setCurrentSystemPermissions((prev) => [...prev, revertSystemPermission]);
                    }
                } else {
                    setCurrentSystemPermissions((prev) => prev.filter((p) => p.id !== systemPermissionId));
                }
                setSystemPermissionError(error.message);
            }
        });
    };

    return (
        <SystemPermissionsEditableCardComponent
            entityName="Permission Set"
            currentSystemPermissions={currentSystemPermissions}
            totalSystemPermissions={totalSystemPermissions}
            onSystemPermissionClick={handleSystemPermissionClick}
            success={systemPermissionSuccess}
            error={systemPermissionError}
        />
    );
}
