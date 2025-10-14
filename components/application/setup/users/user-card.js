'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
} from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { PROFILES } from '@/lib/permissions';
import { updateUserAction } from '@/actions/database/user-actions';
import { useTransition } from 'react';

import { FormError } from '@/components/auth/form/form-error';
import { FormSuccess } from '@/components/auth/form/form-success';
import { AllPermissionsCardComponent } from '@/components/application/setup/users/all-permissions-card';
import { UserAssignmentsListComponent } from '@/components/application/setup/users/user-assignments-list';
import { RecordCardHeader } from '@/components/ui/record-card-header';
import { deleteUserAction } from '@/actions/database/user-actions';
import { toastRichSuccess, toastRichError } from '@/lib/toast-library';
import { useRouter } from 'next/navigation';

export function UserCardComponent({ user }) {
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
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
            employeeNumber: user.employeeNumber,
            profileId: user.profileId,
        },
    });

    const onSubmit = async (data) => {
        setSuccess('');
        setError('');
        startTransition(async () => {
            const response = await updateUserAction(user.id, data);

            if (response.success) {
                // Reset form with the submitted values
                form.reset({
                    employeeNumber: data.employeeNumber,
                    profileId: data.profileId,
                });
                setSuccess(response.success);
                setIsEditing(false);
            } else {
                setError(response.error);
            }
        });
    };

    const deleteUser = async (id) => {
        try {
            setIsDeleting(true);
            await deleteUserAction(id);
            toastRichSuccess({
                message: 'User deleted!',
            });
            router.push('/setup/users');
        } catch (error) {
            toastRichError({
                message: error.message,
            });
            setIsDeleting(false);
            setShowDeleteDialog(false);
        }
    };

    return (
        <div className="grid grid-cols-2 gap-6">
            <div className="col-span-2">
                <RecordCardHeader title={user.name} description={user.email}>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setIsEditing(true)} key="edit">
                            Edit User
                        </Button>
                        <Button variant="destructive" onClick={() => setShowDeleteDialog(true)} key="delete">
                            Delete User
                        </Button>
                        
                        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Delete User</DialogTitle>
                                    <DialogDescription>
                                        Are you sure you want to delete {user.name}? This action cannot be undone.
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                                        Cancel
                                    </Button>
                                    <Button 
                                        variant="destructive" 
                                        onClick={() => deleteUser(user.id)}
                                        disabled={isDeleting}
                                    >
                                        {isDeleting ? (
                                            <div className="flex items-center gap-2">
                                                <Spinner size="sm" variant="white" />
                                                <span>Deleting...</span>
                                            </div>
                                        ) : (
                                            "Delete"
                                        )}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </RecordCardHeader>
            </div>
            {/* User Details Card */}
            <Card className="col-span-1 py-6">
                <CardContent className="space-y-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            {/* Employee Number */}
                            <FormField
                                control={form.control}
                                name="employeeNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Employee Number</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                disabled={!isEditing}
                                                placeholder="Enter employee number"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Profile */}
                            <FormField
                                control={form.control}
                                name="profileId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Profile</FormLabel>
                                        <Select
                                            disabled={!isEditing}
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="hover:cursor-pointer w-full">
                                                    <SelectValue placeholder="Select a profile" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {PROFILES.map((profile) => (
                                                    <SelectItem key={profile} value={profile}>
                                                        {profile}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                        {field.value && (
                                            <Link
                                                href={`/setup/profiles/${field.value}`}
                                                className="text-sm text-blue-600 hover:text-blue-800 hover:underline mt-1 block"
                                            >
                                                View Profile Details
                                            </Link>
                                        )}
                                    </FormItem>
                                )}
                            />

                            {/* Action Buttons */}
                            {isEditing && (
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
            <AllPermissionsCardComponent user={user} />

            {/** Permission Sets Card */}
            <UserAssignmentsListComponent permissionSets={user.permissionSets} userId={user.id} />
        </div>
    );
}
