'use client';

import { AccessCreationWrapperComponent } from '@/components/application/setup/access-creation-wrapper';
import { getPermissionsAction } from '@/actions/database/permission-actions';
import { useState, useEffect } from 'react';
import { createPermissionSetAction } from '@/actions/database/permission-set-actions';

export function CreatePermissionSetComponent({ fireSuccess }) {
    const [totalPermissions, setTotalPermissions] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPermissions = async () => {
            try {
                const permissions = await getPermissionsAction();
                setTotalPermissions(permissions);
                setError('');
            } catch (err) {
                setError('Failed to fetch permissions: ' + err.message);
                setTotalPermissions([]);
            }
        };
        fetchPermissions();
    }, []);

    const handleSubmit = async (data) => {
        try {
            await createPermissionSetAction(data);
            fireSuccess();
        } catch (error) {
            throw new Error(error.message); // Throw an error here will be caught by the child AccessCreationWrapperComponent
        }
    };

    return (
        <AccessCreationWrapperComponent
            onSubmit={handleSubmit}
            totalPermissions={totalPermissions}
            namePlaceholder="Deploy Admin Permission"
            descriptionPlaceholder="Access to view setup area"
            idPlaceholder="perm_set_setup_view"
            permissionError={error}
        />
    );
}
