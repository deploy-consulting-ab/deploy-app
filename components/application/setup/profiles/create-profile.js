'use client';

import { AccessCreationWrapperComponent } from '@/components/application/setup/access-creation-wrapper';
import { getSystemPermissionsAction } from '@/actions/database/system-permission-actions';
import { useState, useEffect } from 'react';
import { createProfileAction } from '@/actions/database/profile-actions';

export function CreateProfileComponent({ fireSuccess }) {
    const [totalSystemPermissions, setTotalSystemPermissions] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchSystemPermissions = async () => {
            try {
                const systemPermissions = await getSystemPermissionsAction();
                setTotalSystemPermissions(systemPermissions);
                setError('');
            } catch (err) {
                setError('Failed to fetch system permissions: ' + err.message);
                setTotalSystemPermissions([]);
            }
        };
        fetchSystemPermissions();
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
            totalSystemPermissions={totalSystemPermissions}
            namePlaceholder="Deploy Consultant"
            descriptionPlaceholder="Standard consultant access"
            idPlaceholder="deploy_consultant"
            permissionError={error}
        />
    );
}
