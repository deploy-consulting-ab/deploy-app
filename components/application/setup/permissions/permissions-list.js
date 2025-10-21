'use client';

import { DatatableWrapperComponent } from '@/components/application/datatable-wrapper';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, ShieldPlus, MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import { ErrorDisplayComponent } from '@/components/errors/error-display';
import Link from 'next/link';
import { CreatePermissionComponent } from '@/components/application/setup/permissions/create-permission';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { PERMISSIONS_ROUTE } from '@/menus/routes';
import {
    getPermissionsAction,
    deletePermissionAction,
} from '@/actions/database/permission-actions';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toastRichSuccess, toastRichError } from '@/lib/toast-library';

export function PermissionsListComponent({ permissions, error: initialError }) {
    const [permissionsData, setPermissionsData] = useState(permissions);
    const [error, setError] = useState(initialError);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

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
        let freshData = null;
        try {
            freshData = await getPermissionsAction();
            setPermissionsData(freshData);
            setError(null);
        } catch (err) {
            setError(err);
        }
    };

    const deletePermission = async (id) => {
        try {
            await deletePermissionAction(id);
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
                        href={`${PERMISSIONS_ROUTE}/${id}`}
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
                        Permission ID
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
                            <DropdownMenuItem onClick={() => deletePermission(row.original.id)}>
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

    const actionButton = (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} size="lg">
            <DialogTrigger asChild>
                <Button size="sm">
                    <ShieldPlus className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Create new permission</DialogTitle>
                    <DialogDescription>
                        Fill in the details to create a new permission.
                    </DialogDescription>
                </DialogHeader>
                <CreatePermissionComponent fireSuccess={handleSuccess} />
            </DialogContent>
        </Dialog>
    );

    return (
        <DatatableWrapperComponent
            data={permissionsData}
            columns={columns}
            placeholder="Filter Permissions..."
            refreshAction={handleRefresh}
            defaultView="all"
            searchKey="name"
            actionButton={actionButton}
        />
    );
}
