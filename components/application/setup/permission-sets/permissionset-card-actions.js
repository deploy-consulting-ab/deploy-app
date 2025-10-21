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
import {
    deletePermissionSetAction,
    updatePermissionSetAction,
} from '@/actions/database/permissionset-actions';
import { toastRichSuccess, toastRichError } from '@/lib/toast-library';
import { useRouter } from 'next/navigation';
import { PermissionSetEditForm } from '@/components/application/setup/permission-sets/permissionset-edit-form';
import { PERMISSION_SETS_ROUTE } from '@/menus/routes';

export function PermissionSetCardActionsComponent({ permissionSet }) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const handleSubmit = async (data) => {
        try {
            await updatePermissionSetAction(permissionSet.id, data);

            // Id the ID changes, redirect to the new permission set page
            if (data.id !== permissionSet.id) {
                router.push(`${PERMISSION_SETS_ROUTE}/${data.id}`);
            } else {
                router.refresh(); // This will trigger a server-side rerender
            }
            toastRichSuccess({
                message: 'Permission Set updated!',
            });
            setShowEditDialog(false);
        } catch (error) {
            throw error;
        }
    };

    const deletePermissionSet = async (id) => {
        try {
            setIsDeleting(true);
            await deletePermissionSetAction(id);
            toastRichSuccess({
                message: 'Permission Set deleted!',
            });
            router.push(PERMISSION_SETS_ROUTE);
        } catch (error) {
            toastRichError({
                message: error.message,
            });
            setIsDeleting(false);
            setShowDeleteDialog(false);
        }
    };

    return (
        <div className="flex items-center gap-2">
            <Button
                onClick={() => setShowEditDialog(true)}
                variant="outline"
                className="hover:cursor-pointer"
            >
                Edit Permission Set
            </Button>

            <Button
                variant="destructive"
                className="hover:cursor-pointer"
                onClick={() => setShowDeleteDialog(true)}
            >
                Delete Permission Set
            </Button>

            <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Permission Set</DialogTitle>
                    </DialogHeader>
                    <PermissionSetEditForm
                        permissionSet={permissionSet}
                        onSubmit={handleSubmit}
                        onEditingChange={setShowEditDialog}
                    />
                </DialogContent>
            </Dialog>

            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Permission Set</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete {permissionSet.name}? This action cannot
                            be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => deletePermissionSet(permissionSet.id)}
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
