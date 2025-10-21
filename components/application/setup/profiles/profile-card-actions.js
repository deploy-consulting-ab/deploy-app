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
import { deleteProfileAction, updateProfileAction } from '@/actions/database/profile-actions';
import { toastRichSuccess, toastRichError } from '@/lib/toast-library';
import { useRouter } from 'next/navigation';
import { ProfileEditForm } from '@/components/application/setup/profiles/profile-edit-form';
import { PROFILES_ROUTE } from '@/menus/routes';

export function ProfileCardActionsComponent({ profile }) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const handleSubmit = async (data) => {
        try {
            await updateProfileAction(profile.id, data);
            router.refresh(); // This will trigger a server-side rerender
            toastRichSuccess({
                message: 'Profile updated!',
            });
            setShowEditDialog(false);
        } catch (error) {
            throw error;
        }
    };

    const deleteProfile = async (id) => {
        try {
            setIsDeleting(true);
            await deleteProfileAction(id);
            toastRichSuccess({
                message: 'Profile deleted!',
            });
            router.push(PROFILES_ROUTE);
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
                Edit Profile
            </Button>

            <Button
                variant="destructive"
                className="hover:cursor-pointer"
                onClick={() => setShowDeleteDialog(true)}
            >
                Delete Profile
            </Button>

            <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Profile</DialogTitle>
                    </DialogHeader>
                    <ProfileEditForm
                        profile={profile}
                        onSubmit={handleSubmit}
                        onEditingChange={setShowEditDialog}
                    />
                </DialogContent>
            </Dialog>

            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Profile</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete {profile.name}? This action cannot be
                            undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => deleteProfile(profile.id)}
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
