'use client';

import { useState } from 'react';
import { SystemPermissionsEditableCardComponent } from '@/components/application/setup/system-permissions/system-permissions-editable-card';
import {
    addSystemPermissionToProfileAction,
    removeSystemPermissionFromProfileAction,
} from '@/actions/database/profile-actions';
import { useTransition } from 'react';

export function ProfilePermissions({ profile, totalSystemPermissions }) {
    const [permissionError, setPermissionError] = useState('');
    const [permissionSuccess, setPermissionSuccess] = useState('');
    const [isPending, startTransition] = useTransition();
    const [currentSystemPermissions, setCurrentSystemPermissions] = useState(profile.systemPermissions);

    const handleSystemPermissionClick = async (systemPermissionId, isAssigned) => {
        setPermissionSuccess('');
        setPermissionError('');

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
                    ? await removeSystemPermissionFromProfileAction(profile.id, systemPermissionId)
                    : await addSystemPermissionToProfileAction(profile.id, systemPermissionId);

                setPermissionSuccess('System permission added successfully');
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
                setPermissionError(error.message);
            }
        });
    };

    return (
        <SystemPermissionsEditableCardComponent
            entityName="Profile"
            currentSystemPermissions={currentSystemPermissions}
            totalSystemPermissions={totalSystemPermissions}
            onSystemPermissionClick={handleSystemPermissionClick}
            success={permissionSuccess}
            error={permissionError}
        />
    );
}
