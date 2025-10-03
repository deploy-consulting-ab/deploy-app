'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { useState, useTransition, useMemo } from 'react';

export function RegisterWrapperComponent({ title, description, onSubmit, totalPermissions }) {
    const [isPending, startTransition] = useTransition();
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [assignedPermissions, setAssignedPermissions] = useState({});

    const permissions = useMemo(() => 
        totalPermissions.map(permission => ({
            ...permission,
            assigned: assignedPermissions[permission.id] || false
        }))
    , [totalPermissions, assignedPermissions]);

    const handlePermissionClick = (permissionId, isAssigned) => {
        setAssignedPermissions(prev => ({
            ...prev,
            [permissionId]: !isAssigned
        }));
    };

    const handleSubmit = (values) => {
        setSuccess('');
        setError('');

        startTransition(async () => {
            try {
                await onSubmit({ ...values, permissions: permissions.filter((p) => p.assigned) });
                setSuccess('Created successfully');
                form.reset();
                setAssignedPermissions({});
            } catch (err) {
                setError(err.message);
            }
        });
    };

    const form = useForm({
        resolver: zodResolver(RegisterWrapperSchema),
        defaultValues: {
            name: '',
            description: '',
            id: '',
        },
    });

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
                                        disabled={isPending}
                                        placeholder="Enter name"
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
                                        disabled={isPending}
                                        placeholder="Enter description"
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
                                    <Input disabled={isPending} placeholder="Enter ID" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <PermissionsEditableCardComponent
                        entityName={form.watch('name') || 'New Entity'}
                        totalPermissions={permissions}
                        onPermissionClick={handlePermissionClick}
                        error={error}
                        successProp={success}
                    />

                    <Button type="submit" className="w-full" disabled={isPending}>
                        Create
                    </Button>
                </form>
            </Form>
        </div>
    );
}
