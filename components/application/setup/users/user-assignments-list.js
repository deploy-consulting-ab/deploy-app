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
import {
    addPermissionSetToUserAction,
    removePermissionSetFromUserAction,
    getUserByIdWithSystemPermissionsAction,
} from '@/actions/database/user-actions';
import { searchPermissionSetsAction } from '@/actions/database/permissionset-actions';
import { PERMISSION_SETS_ROUTE } from '@/menus/routes';
import { RelateRecordComponent } from '@/components/application/setup/relate-record';
import { toastRichSuccess, toastRichError } from '@/lib/toast-library';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function UserAssignmentsListComponent({ permissionSets, userId }) {
    const [permissionSetsData, setPermissionSetsData] = useState(permissionSets);
    const [error, setError] = useState('');
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
            const user = await getUserByIdWithSystemPermissionsAction(userId);
            setPermissionSetsData(user.permissionSets);
            setError(null);
        } catch (err) {
            setError(err);
        } finally {
            setIsRefreshing(false);
        }
    };

    const removeAssignment = async (permissionSetId) => {
        try {
            await removePermissionSetFromUserAction(userId, permissionSetId);
            await doRefresh();
            toastRichSuccess({
                message: 'Permission set removed from user',
            });
        } catch (error) {
            toastRichError({
                message: error.message,
            });
        }
    };

    const handlePermissionSetSelect = async (permissionSet) => {
        try {
            await addPermissionSetToUserAction(userId, permissionSet.id);
            await handleRefresh();
            setIsDialogOpen(false);
            toastRichSuccess({
                message: 'Permission set related to user',
            });
        } catch (error) {
            console.error('Error relating permission set to user:', error);
            throw error;
        }
    };

    const handleSearch = async (query) => {
        try {
            return await searchPermissionSetsAction(query);
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
                        href={`${PERMISSION_SETS_ROUTE}/${id}`}
                        className="cursor-pointer font-medium dark:text-deploy-ocean text-deploy-blue hover:underline truncate transition-colors"
                        title={row.getValue('name')}
                    >
                        {row.getValue('name')}
                    </Link>
                );
            },
        },
        {
            accessorKey: 'description',
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
                        Description
                        <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 opacity-50" />
                    </Button>
                );
            },
            cell: ({ row }) => (
                <div className="truncate text-foreground/80" title={row.getValue('description')}>
                    {row.getValue('description')}
                </div>
            ),
        },
        {
            accessorKey: 'id',
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
                        Permission Set ID
                        <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 opacity-50" />
                    </Button>
                );
            },
            cell: ({ row }) => (
                <div className="truncate text-foreground/70 font-mono text-xs" title={row.getValue('id')}>
                    {row.getValue('id')}
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

    const relatePermissionSetToUserButton = (
        <Dialog
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            key="relate-permission-set-to-user"
        >
            <DialogTrigger asChild>
                <Button size="sm">
                    <CirclePlus className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Relate permission set to user</DialogTitle>
                    <DialogDescription>
                        Select a permission set to relate to the user.
                    </DialogDescription>
                </DialogHeader>
                <RelateRecordComponent
                    onRecordSelect={handlePermissionSetSelect}
                    placeholder="Search permission sets by name or description..."
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

    const actions = [relatePermissionSetToUserButton, refreshUserAssignments];

    return (
        <div className="col-span-2">
            <DatatableWrapperComponent
                data={permissionSetsData}
                columns={columns}
                placeholder="Filter Permission Sets..."
                searchKey="name"
                actions={actions}
            />
        </div>
    );
}
