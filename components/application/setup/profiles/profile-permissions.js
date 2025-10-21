'use client';

import { useState } from 'react';
import { SystemPermissionsEditableCardComponent } from '@/components/application/setup/system-permissions/system-permissions-editable-card';
import {
    addPermissionToProfileAction,
    removePermissionFromProfileAction,
} from '@/actions/database/profile-actions';
import { useTransition } from 'react';

export function ProfilePermissions({ profile, totalPermissions }) {
    const [permissionError, setPermissionError] = useState('');
    const [permissionSuccess, setPermissionSuccess] = useState('');
    const [isPending, startTransition] = useTransition();
    const [currentPermissions, setCurrentPermissions] = useState(profile.permissions);

    const handlePermissionClick = async (permissionId, isAssigned) => {
        setPermissionSuccess('');
        setPermissionError('');
        
        // Optimistically update the UI
        if (isAssigned) {
            setCurrentPermissions((prev) => prev.filter((p) => p.id !== permissionId));
        } else {
            const newPermission = totalPermissions.find((p) => p.id === permissionId);
            if (newPermission) {
                setCurrentPermissions((prev) => [...prev, newPermission]);
            }
        }

        startTransition(async () => {
            try {
                const response = isAssigned
                    ? await removePermissionFromProfileAction(profile.id, permissionId)
                    : await addPermissionToProfileAction(profile.id, permissionId);

                if (response.success) {
                    setPermissionSuccess(response.success);
                } else {
                    // Revert the optimistic update on error
                    if (isAssigned) {
                        const revertPermission = totalPermissions.find(
                            (p) => p.id === permissionId
                        );
                        if (revertPermission) {
                            setCurrentPermissions((prev) => [...prev, revertPermission]);
                        }
                    } else {
                        setCurrentPermissions((prev) => prev.filter((p) => p.id !== permissionId));
                    }
                    setPermissionError(response.error);
                }
            } catch (error) {
                // Revert the optimistic update on error
                if (isAssigned) {
                    const revertPermission = totalPermissions.find((p) => p.id === permissionId);
                    if (revertPermission) {
                        setCurrentPermissions((prev) => [...prev, revertPermission]);
                    }
                } else {
                    setCurrentPermissions((prev) => prev.filter((p) => p.id !== permissionId));
                }
                setPermissionError('Failed to update permission');
            }
        });
    };

    return (
        <SystemPermissionsEditableCardComponent
            entityName="Profile"
            entityPermissions={currentPermissions}
            totalPermissions={totalPermissions}
            onPermissionClick={handlePermissionClick}
            successProp={permissionSuccess}
            error={permissionError}
        />
    );
}
