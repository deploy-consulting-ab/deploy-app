'use client';

import { DatatableWrapperComponent } from '@/components/application/datatable-wrapper';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, CirclePlus, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { ErrorDisplayComponent } from '@/components/errors/error-display';
import Link from 'next/link';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    getUsersForProfileAction,
    searchUsersAction,
    updateUserProfileAction,
} from '@/actions/database/user-actions';
import { USERS_ROUTE } from '@/menus/routes';
import { RelateRecordComponent } from '@/components/application/setup/relate-record';
import { toastRichSuccess } from '@/lib/toast-library';
import { Checkbox } from '@/components/ui/checkbox';

export function ProfileUserAssignmentsListComponent({ users, profileId }) {
    const [usersData, setUsersData] = useState(users);
    const [error, setError] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = async () => {
        if (isRefreshing) {
            return;
        }
        setIsRefreshing(true);
        let freshData = null;
        try {
            freshData = await getUsersForProfileAction(profileId);
            setUsersData(freshData);
            setError(null);
        } catch (err) {
            setError(err);
        } finally {
            setIsRefreshing(false);
        }
    };

    const handleUserSelect = async (user) => {
        try {
            await updateUserProfileAction(user.id, profileId);
            await handleRefresh();
            setIsDialogOpen(false);
            toastRichSuccess({
                message: 'User related to profile',
            });
        } catch (error) {
            console.error('Error relating user to profile:', error);
            throw error;
        }
    };

    const handleSearch = async (query) => {
        try {
            return await searchUsersAction(query);
        } catch (error) {
            throw error;
        }
    };

    const columns = [
        {
            accessorKey: 'name',
            size: 150,
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
                        href={`${USERS_ROUTE}/${id}`}
                        className="cursor-pointer dark:text-deploy-ocean text-deploy-blue hover:underline truncate"
                        title={row.getValue('name')}
                    >
                        {row.getValue('name')}
                    </Link>
                );
            },
        },
        {
            accessorKey: 'email',
            size: 200,
            minSize: 150,
            maxSize: 300, // Responsive size for account names
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        size="large"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    >
                        Email
                        <ArrowUpDown />
                    </Button>
                );
            },
            cell: ({ row }) => (
                <div className="truncate" title={row.getValue('email')}>
                    {row.getValue('email')}
                </div>
            ),
        },
        {
            accessorKey: 'employeeNumber',
            size: 120,
            minSize: 100,
            maxSize: 150, // Responsive size for dates
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        size="large"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    >
                        Employee Number
                        <ArrowUpDown />
                    </Button>
                );
            },
            cell: ({ row }) => (
                <div className="truncate" title={row.getValue('employeeNumber')}>
                    {row.getValue('employeeNumber')}
                </div>
            ),
        },
        {
            accessorKey: 'profileId',
            size: 150,
            minSize: 120,
            maxSize: 200, // Responsive size for status
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    size="large"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Profile ID
                    <ArrowUpDown />
                </Button>
            ),
            cell: ({ row }) => (
                <div className="truncate" title={row.getValue('profileId')}>
                    {row.getValue('profileId')}
                </div>
            ),
        },
        {
            accessorKey: 'isActive',
            size: 120,
            minSize: 100,
            maxSize: 150, // Responsive size for dates
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        size="large"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    >
                        Active
                        <ArrowUpDown />
                    </Button>
                );
            },
            cell: ({ row }) => {
                const isActive = row.original.isActive;
                return (
                    <div className="flex items-start gap-3">
                        <Checkbox id="toggle" checked={isActive} disabled={!isActive} />
                    </div>
                );
            },
        },
    ];

    if (error) {
        return <ErrorDisplayComponent error={error} />;
    }

    const createProfileUserAssignmentButton = (
        <Dialog
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            key="create-profile-user-assignment"
        >
            <DialogTrigger asChild>
                <Button size="sm">
                    <CirclePlus className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Relate user to profile</DialogTitle>
                    <DialogDescription>Select a user to relate to the profile.</DialogDescription>
                </DialogHeader>
                <RelateRecordComponent
                    onRecordSelect={handleUserSelect}
                    placeholder="Search users by name or email..."
                    onSearch={handleSearch}
                />
            </DialogContent>
        </Dialog>
    );

    const refreshProfileUserAssignments = (
        <Button
            key="refresh-profile-user-assignments"
            variant="ghost"
            size="icon"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className={`md:hover:cursor-pointer ${isRefreshing ? 'animate-spin' : ''}`}
        >
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
            <span className="sr-only">Refresh data</span>
        </Button>
    );

    const actions = [createProfileUserAssignmentButton, refreshProfileUserAssignments];

    return (
        <DatatableWrapperComponent
            data={usersData}
            columns={columns}
            placeholder="Filter Users..."
            searchKey="name"
            actions={actions}
        />
    );
}
