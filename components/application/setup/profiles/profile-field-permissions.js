'use client';

import { useState, useMemo, useTransition } from 'react';
import { FieldPermissionsEditableCardComponent } from '@/components/application/setup/field-permissions/field-permissions-editable-card';
import {
    addFieldPermissionToProfileAction,
    removeFieldPermissionFromProfileAction,
} from '@/actions/database/field-permission-actions';
import { toastRichSuccess } from '@/lib/toast-library';

export function ProfileFieldPermissions({ profile, totalFieldPermissions }) {
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isPending, startTransition] = useTransition();
    const [currentFieldPermissions, setCurrentFieldPermissions] = useState(
        profile.fieldPermissions
    );

    const fieldPermissions = useMemo(
        () =>
            totalFieldPermissions.map((fp) => ({
                ...fp,
                assigned: currentFieldPermissions.some((p) => p.id === fp.id),
            })),
        [totalFieldPermissions, currentFieldPermissions]
    );

    const handleFieldPermissionClick = (fieldPermissionId, isAssigned) => {
        setSuccess('');
        setError('');

        const targetPermission = totalFieldPermissions.find((p) => p.id === fieldPermissionId);
        if (!targetPermission) return;

        if (isAssigned) {
            setCurrentFieldPermissions((prev) => prev.filter((p) => p.id !== fieldPermissionId));
        } else {
            setCurrentFieldPermissions((prev) => [...prev, targetPermission]);
        }

        startTransition(async () => {
            try {
                isAssigned
                    ? await removeFieldPermissionFromProfileAction(profile.id, fieldPermissionId)
                    : await addFieldPermissionToProfileAction(profile.id, fieldPermissionId);

                toastRichSuccess({
                    message: isAssigned
                        ? 'Field permission removed successfully'
                        : 'Field permission added successfully',
                });
            } catch (err) {
                if (isAssigned) {
                    setCurrentFieldPermissions((prev) => [...prev, targetPermission]);
                } else {
                    setCurrentFieldPermissions((prev) =>
                        prev.filter((p) => p.id !== fieldPermissionId)
                    );
                }
                setError(err.message);
            }
        });
    };

    return (
        <FieldPermissionsEditableCardComponent
            entityName="Profile"
            totalFieldPermissions={fieldPermissions}
            onFieldPermissionClick={handleFieldPermissionClick}
            success={success}
            error={error}
        />
    );
}
