'use client';

import { DatatableWrapperComponent } from '@/components/application/datatable-wrapper';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, ShieldPlus, MoreHorizontal, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { ErrorDisplayComponent } from '@/components/errors/error-display';
import Link from 'next/link';
import { CreateSystemPermissionComponent } from '@/components/application/setup/system-permissions/create-system-permission';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { SYSTEM_PERMISSIONS_ROUTE } from '@/menus/routes';
import {
    getSystemPermissionsAction,
    deleteSystemPermissionAction,
} from '@/actions/database/system-permission-actions';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toastRichSuccess, toastRichError } from '@/lib/toast-library';

export function SystemPermissionsListComponent({ permissions, error: initialError }) {
    const [permissionsData, setPermissionsData] = useState(permissions);
    const [error, setError] = useState(initialError);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleSuccess = () => {
        setIsDialogOpen(false);
        handleRefresh();
        toastRichSuccess({
            message: 'Permissions updated',
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
            freshData = await getSystemPermissionsAction();
            setPermissionsData(freshData);
            setError(null);
        } catch (err) {
            setError(err);
        } finally {
            setIsRefreshing(false);
        }
    };

    const deleteSystemPermission = async (id) => {
        try {
            await deleteSystemPermissionAction(id);
            await doRefresh();
            toastRichSuccess({
                message: 'Permission deleted!',
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
                        href={`${SYSTEM_PERMISSIONS_ROUTE}/${id}`}
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
            minSize: 120,
            maxSize: 200,
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 -ml-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-transparent"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    >
                        Permission ID
                        <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 opacity-50" />
                    </Button>
                );
            },
            cell: ({ row }) => {
                return (
                    <div className="truncate text-foreground/70 font-mono text-xs" title={row.getValue('id')}>
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
                            <Button variant="ghost" className="h-8 w-8 p-0 opacity-50 hover:opacity-100">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                variant="destructive"
                                onClick={() => deleteSystemPermission(row.original.id)}
                            >
                                Delete Permission
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

    const createSystemPermissionButton = (
        <Dialog
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            size="lg"
            key="create-system-permission"
        >
            <DialogTrigger asChild>
                <Button size="sm">
                    <ShieldPlus className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Create new system permission</DialogTitle>
                    <DialogDescription>
                        Fill in the details to create a new system permission.
                    </DialogDescription>
                </DialogHeader>
                <CreateSystemPermissionComponent fireSuccess={handleSuccess} />
            </DialogContent>
        </Dialog>
    );

    const refreshSystemPermissions = (
        <Button
            key="refresh-system-permissions"
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

    const actions = [createSystemPermissionButton, refreshSystemPermissions];

    return (
        <DatatableWrapperComponent
            data={permissionsData}
            columns={columns}
            placeholder="Filter Permissions..."
            searchKey="name"
            actions={actions}
        />
    );
}
