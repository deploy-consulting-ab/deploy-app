'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { deleteUserAction, updateUserAction } from '@/actions/database/user-actions';
import { toastRichSuccess, toastRichError } from '@/lib/toast-library';
import { useRouter } from 'next/navigation';
import { UserEditForm } from '@/components/application/setup/users/user-edit-form';
import { HOME_ROUTE, USERS_ROUTE } from '@/menus/routes';
import { useImpersonation } from '@/hooks/use-impersonation';

export function UserCardActionsComponent({ user }) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();
    const { startImpersonation } = useImpersonation();

    const handleSubmit = async (data) => {
        try {
            await updateUserAction(user.id, data);
            router.refresh(); // This will trigger a server-side rerender
            toastRichSuccess({
                message: 'User updated!',
            });
            setShowEditDialog(false);
        } catch (error) {
            throw error;
        }
    };

    const deleteUser = async (id) => {
        try {
            setIsDeleting(true);
            await deleteUserAction(id);
            toastRichSuccess({
                message: 'User deleted!',
            });
            router.push(USERS_ROUTE);
        } catch (error) {
            toastRichError({
                message: error.message,
            });
            setIsDeleting(false);
            setShowDeleteDialog(false);
        }
    };

    const handleImpersonation = async (id, name) => {
        try {
            await startImpersonation(id);
            toastRichSuccess({
                message: `Viewing as ${name}`,
            });
            router.push(HOME_ROUTE);
        } catch (error) {
            toastRichError({
                message: error.message,
            });
        }
    };

    return (
        <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowEditDialog(true)} key="edit">
                Edit User
            </Button>

            {user.isActive && (
                <Button
                    variant="outline"
                    onClick={() => handleImpersonation(user.id, user.name)}
                    key="impersonate"
                >
                    View As
                </Button>
            )}
            <Button variant="destructive" onClick={() => setShowDeleteDialog(true)} key="delete">
                Delete User
            </Button>

            <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit User</DialogTitle>
                        <DialogDescription>Edit the user details.</DialogDescription>
                    </DialogHeader>
                    <UserEditForm
                        user={user}
                        onEditingChange={setShowEditDialog}
                        onSubmit={handleSubmit}
                    />
                </DialogContent>
            </Dialog>

            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete User</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete {user.name}? This action cannot be
                            undone.
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
                                'Delete'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
