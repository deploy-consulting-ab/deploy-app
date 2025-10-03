'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from '@/components/ui/card';
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    updatePermissionSetAction,
    addPermissionToPermissionSetAction,
    removePermissionFromPermissionSetAction,
} from '@/actions/database/permissionset-actions';
import { useTransition } from 'react';

import { FormError } from '@/components/auth/form/form-error';
import { FormSuccess } from '@/components/auth/form/form-success';
import { PermissionsEditableCardComponent } from '@/components/application/setup/permissions/permissions-editable-card';

import { PermissionSetAssignmentsListComponent } from '@/components/application/setup/permission-sets/permissionset-assignments-list';

export function PermissionSetCardComponent({ permissionSet, totalPermissions }) {
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [permissionError, setPermissionError] = useState('');
    const [permissionSuccess, setPermissionSuccess] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [currentPermissions, setCurrentPermissions] = useState(permissionSet.permissions);

    const handlePermissionClick = async (permissionId, isAssigned) => {
        // Clear any existing success/error messages first
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
                    ? await removePermissionFromPermissionSetAction(permissionSet.id, permissionId)
                    : await addPermissionToPermissionSetAction(permissionSet.id, permissionId);

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

    // Effect to handle fade out animation
    useEffect(() => {
        let fadeOutTimer;
        let removeTimer;

        if (success) {
            setIsVisible(true);
            // Start fade out after 1 second
            fadeOutTimer = setTimeout(() => {
                setIsVisible(false);
                // Remove message after animation completes (0.5s)
                removeTimer = setTimeout(() => {
                    setSuccess('');
                }, 500);
            }, 1000);
        }

        return () => {
            clearTimeout(fadeOutTimer);
            clearTimeout(removeTimer);
        };
    }, [success]);

    const form = useForm({
        defaultValues: {
            description: permissionSet.description,
        },
    });

    const onSubmit = async (data) => {
        setSuccess('');
        setError('');
        startTransition(async () => {
            const response = await updatePermissionSetAction(permissionSet.id, data);

            if (response.success) {
                // Reset form with the submitted values
                form.reset({
                    description: data.description,
                });
                setSuccess(response.success);
                setIsEditing(false);
            } else {
                setError(response.error);
            }
        });
    };

    return (
        <div className="grid grid-cols-2 gap-6">
            {/* User Details Card */}
            <Card className="col-span-1 py-4 h-fit">
                <CardHeader>
                    <CardTitle className="text-2xl">{permissionSet.name}</CardTitle>
                    <CardDescription className="text-base">{permissionSet.id}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            {/* Profile Description */}
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Permission Set Description</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                disabled={!isEditing}
                                                placeholder="Enter permissionSet description"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Action Buttons */}
                            {isEditing ? (
                                <div className="flex gap-2">
                                    <Button type="submit" className="hover:cursor-pointer">
                                        Save Changes
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="hover:cursor-pointer"
                                        onClick={() => setIsEditing(false)}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            ) : (
                                <Button
                                    type="button"
                                    onClick={() => setIsEditing(true)}
                                    className="hover:cursor-pointer"
                                >
                                    Edit Permission Set
                                </Button>
                            )}
                        </form>
                    </Form>
                </CardContent>
                <CardFooter>
                    <FormError message={error} />
                    <div
                        className={`transition-opacity duration-500 ease-in-out ${
                            isVisible ? 'opacity-100' : 'opacity-0'
                        }`}
                    >
                        <FormSuccess message={success} />
                    </div>
                </CardFooter>
            </Card>

            {/* Permissions Card */}
            <PermissionsEditableCardComponent
                entityName="Permission Set"
                entityPermissions={currentPermissions}
                totalPermissions={totalPermissions}
                onPermissionClick={handlePermissionClick}
                successProp={permissionSuccess}
                error={permissionError}
            />
            {/** Add a datatable displaying all the users in the permissionSet, add an action button to add a new user to the permissionSet*/}
            <div className="col-span-2">
                <PermissionSetAssignmentsListComponent users={permissionSet.users} permissionSetId={permissionSet.id} />
            </div>
        </div>
    );  
}
