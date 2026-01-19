'use client';

import { DatatableWrapperComponent } from '@/components/application/datatable-wrapper';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, CirclePlus, MoreHorizontal, RefreshCw } from 'lucide-react';
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
    searchUsersAction,
} from '@/actions/database/user-actions';
import { USERS_ROUTE } from '@/menus/routes';
import { RelateRecordComponent } from '@/components/application/setup/relate-record';
import { toastRichSuccess } from '@/lib/toast-library';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';

export function PermissionSetAssignmentsListComponent({
    users,
    error: initialError,
    permissionSetId,
}) {
    const [usersData, setUsersData] = useState(users);
    const [error, setError] = useState(initialError);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = async () => {
        doRefresh();
    };

    const doRefresh = async () => {
        if (isRefreshing) {
            return;
        }
        setIsRefreshing(true);
        try {
            const permissionSet = await getPermissionSetByIdAction(permissionSetId);
            setUsersData(permissionSet.users);
            setError(null);
        } catch (err) {
            setError(err);
        } finally {
            setIsRefreshing(false);
        }
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
                        size="sm"
                        className="h-8 -ml-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-transparent"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    >
                        Name
                        <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 opacity-50" />
                    </Button>
                );
            },
            cell: ({ row }) => {
                const id = row.original.id;
                return (
                    <Link
                        href={`${USERS_ROUTE}/${id}`}
                        className="cursor-pointer font-medium dark:text-deploy-ocean text-deploy-blue hover:underline truncate transition-colors"
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
            maxSize: 300,
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 -ml-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-transparent"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    >
                        Email
                        <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 opacity-50" />
                    </Button>
                );
            },
            cell: ({ row }) => (
                <div className="truncate text-foreground/80" title={row.getValue('email')}>
                    {row.getValue('email')}
                </div>
            ),
        },
        {
            accessorKey: 'employeeNumber',
            size: 120,
            minSize: 100,
            maxSize: 150,
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 -ml-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-transparent"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    >
                        Employee Number
                        <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 opacity-50" />
                    </Button>
                );
            },
            cell: ({ row }) => (
                <div className="truncate text-foreground/70 tabular-nums" title={row.getValue('employeeNumber')}>
                    {row.getValue('employeeNumber')}
                </div>
            ),
        },
        {
            accessorKey: 'isActive',
            size: 120,
            minSize: 100,
            maxSize: 150,
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 -ml-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-transparent"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    >
                        Active
                        <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 opacity-50" />
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

        {
            id: 'actions',
            enableSorting: false,
            enableHiding: false,
            maxSize: 10,
            cell: ({ row }) => {
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 opacity-50 hover:opacity-100">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => removeAssignment(row.original.id)}>
                                Remove Assignment
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

    const relateUserToPermissionSetButton = (
        <Dialog
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            key="relate-user-to-permission-set"
        >
            <DialogTrigger asChild>
                <Button size="sm">
                    <CirclePlus className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Relate user to permission set</DialogTitle>
                    <DialogDescription>
                        Select a user to relate to the permission set.
                    </DialogDescription>
                </DialogHeader>

                <RelateRecordComponent
                    onRecordSelect={handleUserSelect}
                    placeholder="Search users by name or email..."
                    onSearch={handleSearch}
                />
            </DialogContent>
        </Dialog>
    );

    const refreshUserAssignments = (
        <Button
            key="refresh-user-assignments"
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

    const actions = [relateUserToPermissionSetButton, refreshUserAssignments];

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
