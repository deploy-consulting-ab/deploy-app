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
    deleteFieldPermissionAction,
    updateFieldPermissionAction,
} from '@/actions/database/field-permission-actions';
import { toastRichSuccess, toastRichError } from '@/lib/toast-library';
import { useRouter } from 'next/navigation';
import { FieldPermissionEditForm } from '@/components/application/setup/field-permissions/field-permission-edit-form';
import { FIELD_PERMISSIONS_ROUTE } from '@/menus/routes';

export function FieldPermissionCardActionsComponent({ fieldPermission }) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const handleSubmit = async (data) => {
        try {
            await updateFieldPermissionAction(fieldPermission.id, data);
            router.refresh();
            toastRichSuccess({ message: 'Field permission updated!' });
            setShowEditDialog(false);
        } catch (err) {
            throw err;
        }
    };

    const handleDelete = async () => {
        try {
            setIsDeleting(true);
            await deleteFieldPermissionAction(fieldPermission.id);
            toastRichSuccess({ message: 'Field permission deleted!' });
            router.push(FIELD_PERMISSIONS_ROUTE);
        } catch (err) {
            toastRichError({ message: err.message });
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
                Edit
            </Button>

            <Button
                variant="destructive"
                className="hover:cursor-pointer"
                onClick={() => setShowDeleteDialog(true)}
            >
                Delete
            </Button>

            <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Edit Field Permission</DialogTitle>
                    </DialogHeader>
                    <FieldPermissionEditForm
                        fieldPermission={fieldPermission}
                        onSubmit={handleSubmit}
                        onEditingChange={setShowEditDialog}
                    />
                </DialogContent>
            </Dialog>

            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Field Permission</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete &quot;
                            {fieldPermission.label || fieldPermission.fieldName}&quot;? This will
                            remove it from all profiles and permission sets. This action cannot be
                            undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowDeleteDialog(false)}
                            className="hover:cursor-pointer"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="hover:cursor-pointer"
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
