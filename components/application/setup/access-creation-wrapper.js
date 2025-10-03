'use client';

import { RegisterWrapperSchema } from '@/schemas/register-wrapper';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PermissionsEditableCardComponent } from './permissions-editable-card';
import { useState, useMemo } from 'react';
import { VIEW_HOME_PERMISSION } from '@/lib/permissions';
import { FormError } from '@/components/auth/form/form-error';

export function AccessCreationWrapperComponent({
    namePlaceholder,
    descriptionPlaceholder,
    idPlaceholder,
    onSubmit,
    totalPermissions,
    permissionError,
}) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [assignedPermissions, setAssignedPermissions] = useState({});

    const permissions = useMemo(
        () =>
            totalPermissions
                .map((permission) =>
                    permission.name === VIEW_HOME_PERMISSION
                        ? {
                              ...permission,
                              assigned: true,
                          }
                        : {
                              ...permission,
                              assigned: assignedPermissions[permission.id] || false,
                          }
                )
                .sort((a, b) => (a.assigned ? -1 : 1)),
        [totalPermissions, assignedPermissions]
    );

    const handlePermissionClick = (permissionId, isAssigned) => {
        setAssignedPermissions((prev) => ({
            ...prev,
            [permissionId]: !isAssigned,
        }));
    };

    const handleSubmit = async (values) => {
        setSuccess('');
        setError('');
        setIsSubmitting(true);

        try {
            await onSubmit({
                ...values,
                permissions: permissions.filter((permission) => permission.assigned),
            });
            setSuccess('Created successfully');
            resetForm();
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const form = useForm({
        resolver: zodResolver(RegisterWrapperSchema),
        defaultValues: {
            name: '',
            description: '',
            id: '',
        },
    });

    const resetForm = () => {
        form.reset();
        setAssignedPermissions({});
        setError('');
        setSuccess('');
    };

    return (
        <div className="space-y-6">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={isSubmitting}
                                        placeholder={namePlaceholder}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={isSubmitting}
                                        placeholder={descriptionPlaceholder}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="id"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>ID</FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={isSubmitting}
                                        placeholder={idPlaceholder}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {permissionError ? (
                        <FormError message={permissionError} />
                    ) : (
                        <PermissionsEditableCardComponent
                            entityName={form.watch('name') || 'New Entity'}
                            totalPermissions={permissions}
                            onPermissionClick={handlePermissionClick}
                            successProp={success}
                        />
                    )}

                    <FormError message={error} />

                    <div className="flex gap-4">
                        <Button
                            type="button"
                            variant="outline"
                            className="flex-1"
                            onClick={resetForm}
                            disabled={isSubmitting}
                        >
                            Reset
                        </Button>
                        <Button type="submit" className="flex-1" disabled={isSubmitting}>
                            {isSubmitting ? 'Creating...' : 'Create'}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
