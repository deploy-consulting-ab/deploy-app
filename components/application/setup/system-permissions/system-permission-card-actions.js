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
    deleteSystemPermissionAction,
    updateSystemPermissionAction,
} from '@/actions/database/system-permission-actions';
import { toastRichSuccess, toastRichError } from '@/lib/toast-library';
import { useRouter } from 'next/navigation';
import { SystemPermissionEditForm } from '@/components/application/setup/system-permissions/system-permission-edit-form';
import { SYSTEM_PERMISSIONS_ROUTE } from '@/menus/routes';

export function SystemPermissionCardActionsComponent({ permission }) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (data) => {
        try {
            await updateSystemPermissionAction(permission.id, data);
            router.refresh(); // This will trigger a server-side rerender
            toastRichSuccess({
                message: 'System Permission updated!',
            });
            setShowEditDialog(false);
        } catch (error) {
            throw error;
        }
    };

    const deleteSystemPermission = async (id) => {
        try {
            setIsDeleting(true);
            await deleteSystemPermissionAction(id);
            toastRichSuccess({
                message: 'System Permission deleted!',
            });
            router.push(SYSTEM_PERMISSIONS_ROUTE);
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
                Edit Permission
            </Button>

            <Button
                variant="destructive"
                className="hover:cursor-pointer"
                onClick={() => setShowDeleteDialog(true)}
            >
                Delete Permission
            </Button>

            <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit System Permission</DialogTitle>
                    </DialogHeader>
                    <SystemPermissionEditForm
                        permission={permission}
                        onSubmit={handleSubmit}
                        onEditingChange={setShowEditDialog}
                    />
                </DialogContent>
            </Dialog>

            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete System Permission</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete {permission.name}? This action cannot be
                            undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => deleteSystemPermission(permission.id)}
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
