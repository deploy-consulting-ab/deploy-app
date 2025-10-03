'use client';

import { AccessCreationWrapperComponent } from '@/components/application/setup/access-creation-wrapper';
import { getPermissionsAction } from '@/actions/database/permission-actions';
import { useState, useEffect } from 'react';
import { createProfileAction } from '@/actions/database/profile-actions';

export function CreateProfileComponent({ fireSuccess }) {
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
            await createProfileAction(data);
            fireSuccess();
        } catch (error) {
            throw new Error(error.message); // Throw an error here will be caught by the child AccessCreationWrapperComponent
        }
    };

    return (
        <AccessCreationWrapperComponent
            onSubmit={handleSubmit}
            totalPermissions={totalPermissions}
            namePlaceholder="Deploy Consultant"
            descriptionPlaceholder="Standard consultant access"
            idPlaceholder="deploy_consultant"
            permissionError={error}
        />
    );
}
