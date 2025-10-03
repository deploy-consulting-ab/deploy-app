'use client';

import { RegisterWrapperComponent } from '@/components/application/setup/register-wrapper';
import { createProfileAction } from '@/actions/database/profile-actions';
import { getPermissionsAction } from '@/actions/database/permission-actions';
import { useState, useEffect } from 'react';

export function RegisterProfileComponent({ onSuccess }) {
    const [totalPermissions, setTotalPermissions] = useState([]);

    useEffect(() => {
        const fetchPermissions = async () => {
            console.log('#### fetchPermissions');
            const permissions = await getPermissionsAction();
            setTotalPermissions(permissions);
        };
        fetchPermissions();
    }, []);

    const handleSubmit = async (data) => {
        try {
            console.log('#### data', data);
            // await createProfileAction(data);
            if (onSuccess) {
                onSuccess();
            }
        } catch (error) {
            throw new Error(error.message);
        }
    };

    if (!totalPermissions.length) {
        return <div>Loading...</div>;
    }

    return (
        <RegisterWrapperComponent
            title="Create New Profile"
            description="Fill in the details to create a new profile"
            onSubmit={handleSubmit}
            totalPermissions={totalPermissions}
        />
    );
}
