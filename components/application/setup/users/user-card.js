'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
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
import { AllPermissionsCardComponent } from '@/components/application/setup/users/all-permissions-card';
import { UserAssignmentsListComponent } from '@/components/application/setup/users/user-assignments-list';
import { RecordCardHeaderComponent } from '@/components/ui/record-card-header';
import { deleteUserAction } from '@/actions/database/user-actions';
import { toastRichSuccess, toastRichError } from '@/lib/toast-library';
import { useRouter } from 'next/navigation';
import { UserEditForm } from './user-edit-form';

export function UserCardComponent({ user: initialUser }) {
    const [user, setUser] = useState(initialUser);
    const [isEditing, setIsEditing] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const handleUserUpdate = (updatedUser) => {
        setUser(updatedUser);
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
                <RecordCardHeaderComponent title={user.name} description={user.email}>
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
                </RecordCardHeaderComponent>
            </div>
            {/* User Details Card */}
            <Card className="col-span-1 py-6">
                <CardContent className="space-y-6">
                    {isEditing ? (
                        <UserEditForm 
                            user={user} 
                            onEditingChange={setIsEditing}
                            onUserUpdate={handleUserUpdate}
                        />
                    ) : (
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-sm font-medium">Employee Number</h3>
                                <p className="text-sm text-gray-500">{user.employeeNumber}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium">Profile</h3>
                                <p className="text-sm text-gray-500">{user.profileId}</p>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Permissions Card */}
            <AllPermissionsCardComponent user={user} />

            {/** Permission Sets Card */}
            <UserAssignmentsListComponent permissionSets={user.permissionSets} userId={user.id} />
        </div>
    );
}
