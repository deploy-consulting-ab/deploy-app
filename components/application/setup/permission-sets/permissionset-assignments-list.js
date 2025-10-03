'use client';

import { DatatableWrapperComponent } from '@/components/application/datatable-wrapper';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, UserPlus, MoreHorizontal } from 'lucide-react';
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
import { getPermissionSetByIdAction } from '@/actions/database/permissionset-actions';
import {
    addPermissionSetToUserAction,
    removePermissionSetFromUserAction,
} from '@/actions/database/user-actions';
import { USERS_ROUTE } from '@/menus/routes';
import { RelateUser } from '@/components/application/setup/users/relate-user';
import { toastRichSuccess } from '@/lib/toast-library';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function PermissionSetAssignmentsListComponent({
    users,
    error: initialError,
    permissionSetId,
}) {
    const [usersData, setUsersData] = useState(users);
    const [error, setError] = useState(initialError);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleRefresh = async () => {
        doRefresh();
    };

    const doRefresh = async () => {
        let freshData = null;
        try {
            const permissionSet = await getPermissionSetByIdAction(permissionSetId);
            freshData = permissionSet.users;
            setUsersData(freshData);
            setError(null);
        } catch (err) {
            setError(err);
        }
        return freshData;
    };

    const removeAssignment = async (userId) => {
        try {
            await removePermissionSetFromUserAction(userId, permissionSetId);
            await doRefresh();
            toastRichSuccess({
                message: 'User removed from permission set',
            });
        } catch (error) {
            toastRichError({
                message: error.message,
            });
        }
    };

    const handleUserSelect = async (user) => {
        try {
            await addPermissionSetToUserAction(user.id, permissionSetId);
            await handleRefresh();
            setIsDialogOpen(false);
            toastRichSuccess({
                message: 'User related to permission set',
            });
        } catch (error) {
            console.error('Error relating user to permission set:', error);
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
                            <DropdownMenuItem onClick={() => removeAssignment(row.original.id)}>
                                Remove User from Permission Set
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
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button size="sm">
                    <UserPlus className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Relate user to permission set</DialogTitle>
                    <DialogDescription>
                        Select a user to relate to the permission set.
                    </DialogDescription>
                </DialogHeader>
                <RelateUser onUserSelect={handleUserSelect} />
            </DialogContent>
        </Dialog>
    );

    return (
        <DatatableWrapperComponent
            data={usersData}
            columns={columns}
            placeholder="Filter Users..."
            refreshAction={handleRefresh}
            searchKey="name"
            actionButton={actionButton}
        />
    );
}
