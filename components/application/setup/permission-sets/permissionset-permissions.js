'use client';

import { useState } from 'react';
import { SystemPermissionsEditableCardComponent } from '@/components/application/setup/system-permissions/system-permissions-editable-card';
import {
    addPermissionToPermissionSetAction,
    removePermissionFromPermissionSetAction,
} from '@/actions/database/permissionset-actions';
import { useTransition } from 'react';

export function PermissionSetPermissions({ permissionSet, totalPermissions }) {
    const [permissionError, setPermissionError] = useState('');
    const [permissionSuccess, setPermissionSuccess] = useState('');
    const [isPending, startTransition] = useTransition();
    const [currentPermissions, setCurrentPermissions] = useState(permissionSet.permissions);

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
                isAssigned
                    ? await removePermissionFromPermissionSetAction(permissionSet.id, permissionId)
                    : await addPermissionToPermissionSetAction(permissionSet.id, permissionId);

                setPermissionSuccess('Permission updated successfully');
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
                setPermissionError(error.message);
            }
        });
    };

    return (
        <SystemPermissionsEditableCardComponent
            entityName="Permission Set"
            entityPermissions={currentPermissions}
            totalPermissions={totalPermissions}
            onPermissionClick={handlePermissionClick}
            successProp={permissionSuccess}
            error={permissionError}
        />
    );
}
