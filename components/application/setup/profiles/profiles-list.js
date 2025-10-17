'use client';

import { DatatableWrapperComponent } from '@/components/application/datatable-wrapper';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, UserCircle, MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import { ErrorDisplayComponent } from '@/components/errors/error-display';
import Link from 'next/link';
import { CreateProfileComponent } from '@/components/application/setup/profiles/create-profile';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { PROFILES_ROUTE } from '@/menus/routes';
import { getProfilesAction, deleteProfileAction } from '@/actions/database/profile-actions';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toastRichSuccess, toastRichError } from '@/lib/toast-library';

export function ProfilesListComponent({ profiles, error: initialError }) {
    const [profilesData, setProfilesData] = useState(profiles);
    const [error, setError] = useState(initialError);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleSuccess = () => {
        setIsDialogOpen(false);
        handleRefresh();
        toastRichSuccess({
            message: 'Profiles updated',
        });
    };

    const handleRefresh = async () => {
        await doRefresh();
    };

    const doRefresh = async () => {
        let freshData = null;
        try {
            freshData = await getProfilesAction();
            setProfilesData(freshData);
            setError(null);
        } catch (err) {
            setError(err);
        }
    };

    const deleteProfile = async (id) => {
        try {
            await deleteProfileAction(id);
            await doRefresh();
            toastRichSuccess({
                message: 'Profile deleted!',
            });
        } catch (error) {
            toastRichError({
                message: error.message,
            });
        }
    };

    const columns = [
        {
            accessorKey: 'name',
            minSize: 100,
            maxSize: 400,
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        size="large"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    >
                        Name
                        <ArrowUpDown />
                    </Button>
                );
            },
            cell: ({ row }) => {
                const id = row.original.id;
                return (
                    <Link
                        href={`${PROFILES_ROUTE}/${id}`}
                        className="cursor-pointer dark:text-deploy-ocean text-deploy-blue hover:underline truncate"
                        title={row.getValue('name')}
                    >
                        {row.getValue('name')}
                    </Link>
                );
            },
        },
        {
            accessorKey: 'description',
            minSize: 150,
            maxSize: 300, // Responsive size for account names
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        size="large"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    >
                        Description
                        <ArrowUpDown />
                    </Button>
                );
            },
            cell: ({ row }) => (
                <div className="truncate" title={row.getValue('description')}>
                    {row.getValue('description')}
                </div>
            ),
        },
        {
            accessorKey: 'id',
            minSize: 120,
            maxSize: 200, // Responsive size for status
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        size="large"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    >
                        Profile ID
                        <ArrowUpDown />
                    </Button>
                );
            },
            cell: ({ row }) => {
                return (
                    <div className="truncate" title={row.getValue('id')}>
                        {row.getValue('id')}
                    </div>
                );
            },
        },
        {
            id: 'actions',
            enableSorting: false,
            enableHiding: false,
            maxSize: 10,
            cell: ({ row }) => {
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => deleteProfile(row.original.id)}>
                                Delete Profile
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    if (error) {
        return <ErrorDisplayComponent error={error} />;
    }

    const actionButton = (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} size="lg">
            <DialogTrigger asChild>
                <Button size="sm">
                    <UserCircle className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Create new profile</DialogTitle>
                    <DialogDescription>
                        Fill in the details to create a new profile.
                    </DialogDescription>
                </DialogHeader>
                <CreateProfileComponent fireSuccess={handleSuccess} />
            </DialogContent>
        </Dialog>
    );

    return (
        <DatatableWrapperComponent
            data={profilesData}
            columns={columns}
            placeholder="Filter Profiles..."
            refreshAction={handleRefresh}
            defaultView="all"
            searchKey="name"
            actionButton={actionButton}
        />
    );
}
