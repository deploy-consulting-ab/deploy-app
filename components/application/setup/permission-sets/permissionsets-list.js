'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpDown, MoreHorizontal, Box, RefreshCw, PermissionSetPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '@/components/ui/select';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    deletePermissionSetAction,
    getPermissionSetsAction,
} from '@/actions/database/permissionset-actions';
import { toastRichSuccess, toastRichError } from '@/lib/toast-library';
import { ErrorDisplayComponent } from '@/components/errors/error-display';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { CreatePermissionSetComponent } from '@/components/application/setup/permission-sets/create-permission-set';
import { DatatableWrapperComponent } from '@/components/application/datatable-wrapper';
import { PERMISSION_SETS_ROUTE } from '@/menus/routes';

export function PermissionSetListComponent({ permissionSets, error: initialError }) {
    const [permissionSetsData, setPermissionSetsData] = useState(permissionSets);
    const [error, setError] = useState(initialError);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleSuccess = () => {
        setIsDialogOpen(false);
        handleRefresh();
        toastRichSuccess({
            message: 'Permission Sets updated',
        });
    };

    const handleRefresh = async () => {
        await doRefresh();
    };

    const doRefresh = async () => {
        if (isRefreshing) {
            return;
        }
        setIsRefreshing(true);

        let freshData = null;
        try {
            freshData = await getPermissionSetsAction();
            setPermissionSetsData(freshData);
            setError(null);
        } catch (err) {
            setError(err);
        } finally {
            setIsRefreshing(false);
        }
    };

    const deletePermissionSet = async (id) => {
        try {
            await deletePermissionSetAction(id);
            await doRefresh();
            toastRichSuccess({
                message: 'Permission Set assigned deleted!',
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
                        href={`${PERMISSION_SETS_ROUTE}/${id}`}
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
                        Permission Set ID
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
                            <DropdownMenuItem onClick={() => deletePermissionSet(row.original.id)}>
                                Delete Permission Set
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

    const createPermissionSetButton = (
        <Dialog
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            size="lg"
            key="create-permission-set"
        >
            <DialogTrigger asChild>
                <Button size="sm">
                    <Box className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Create new permission set</DialogTitle>
                    <DialogDescription>
                        Fill in the details to create a new permission set.
                    </DialogDescription>
                </DialogHeader>
                <CreatePermissionSetComponent fireSuccess={handleSuccess} />
            </DialogContent>
        </Dialog>
    );

    const refreshPermissionSets = (
        <Button
            key="refresh-permission-sets"
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

    const actions = [createPermissionSetButton, refreshPermissionSets];

    return (
        <DatatableWrapperComponent
            data={permissionSetsData}
            columns={columns}
            placeholder="Filter Permission Sets..."
            searchKey="name"
            actions={actions}
        />
    );
}
