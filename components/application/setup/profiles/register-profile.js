'use client';

import { RegisterWrapperComponent } from '@/components/application/setup/register-wrapper';
import { getPermissionsAction } from '@/actions/database/permission-actions';
import { useState, useEffect } from 'react';
import { createProfileAction } from '@/actions/database/profile-actions';

export function RegisterProfileComponent({ onSuccess }) {
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
            if (onSuccess) {
                onSuccess();
            }
        } catch (error) {
            throw new Error(error.message);
        }
    };

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }
    
    if (!totalPermissions.length) {
        return <div>Loading permissions...</div>;
    }

    return (
        <RegisterWrapperComponent
            onSubmit={handleSubmit}
            totalPermissions={totalPermissions}
            namePlaceholder="Deploy Consultant"
            descriptionPlaceholder="Standard consultant access"
            idPlaceholder="deploy_consultant"
        />
    );
}
