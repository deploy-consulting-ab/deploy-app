'use client';

import { DatatableWrapperComponent } from '@/components/application/datatable-wrapper';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, KeyRound, MoreHorizontal, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { ErrorDisplayComponent } from '@/components/errors/error-display';
import Link from 'next/link';
import { CreateFieldPermissionComponent } from '@/components/application/setup/field-permissions/create-field-permission';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { FIELD_PERMISSIONS_ROUTE } from '@/menus/routes';
import {
    getFieldPermissionsAction,
    deleteFieldPermissionAction,
} from '@/actions/database/field-permission-actions';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { toastRichSuccess, toastRichError } from '@/lib/toast-library';

export function FieldPermissionsListComponent({ fieldPermissions, error: initialError }) {
    const [fieldPermissionsData, setFieldPermissionsData] = useState(fieldPermissions);
    const [error, setError] = useState(initialError);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleSuccess = () => {
        setIsDialogOpen(false);
        handleRefresh();
        toastRichSuccess({ message: 'Field permission created' });
    };

    const handleRefresh = async () => {
        await doRefresh();
    };

    const doRefresh = async () => {
        if (isRefreshing) return;
        setIsRefreshing(true);
        try {
            const freshData = await getFieldPermissionsAction();
            setFieldPermissionsData(freshData);
            setError(null);
        } catch (err) {
            setError(err);
        } finally {
            setIsRefreshing(false);
        }
    };

    const deleteFieldPermission = async (id) => {
        try {
            await deleteFieldPermissionAction(id);
            await doRefresh();
            toastRichSuccess({ message: 'Field permission deleted!' });
        } catch (err) {
            toastRichError({ message: err.message });
        }
    };

    const columns = [
        {
            accessorKey: 'label',
            minSize: 100,
            maxSize: 400,
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 -ml-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-transparent hover:cursor-pointer"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Label
                    <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 opacity-50" />
                </Button>
            ),
            cell: ({ row }) => (
                <Link
                    href={`${FIELD_PERMISSIONS_ROUTE}/${row.original.id}`}
                    className="cursor-pointer font-medium dark:text-deploy-ocean text-deploy-blue hover:underline truncate transition-colors"
                    title={row.getValue('label')}
                >
                    {row.getValue('label')}
                </Link>
            ),
        },
        {
            accessorKey: 'system',
            minSize: 80,
            maxSize: 150,
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 -ml-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-transparent hover:cursor-pointer"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    System
                    <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 opacity-50" />
                </Button>
            ),
            cell: ({ row }) => (
                <Badge variant="outline" className="text-sm">
                    {row.getValue('system')}
                </Badge>
            ),
        },
        {
            accessorKey: 'objectName',
            minSize: 100,
            maxSize: 200,
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 -ml-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-transparent hover:cursor-pointer"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Object
                    <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 opacity-50" />
                </Button>
            ),
            cell: ({ row }) => (
                <div
                    className="truncate text-foreground/70"
                    title={row.getValue('objectName')}
                >
                    {row.getValue('objectName')}
                </div>
            ),
        },
        {
            accessorKey: 'fieldName',
            minSize: 120,
            maxSize: 200,
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 -ml-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-transparent hover:cursor-pointer"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Field API Name
                    <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 opacity-50" />
                </Button>
            ),
            cell: ({ row }) => (
                <div className="truncate text-foreground/70" title={row.getValue('fieldName')}>
                    {row.getValue('fieldName')}
                </div>
            ),
        },
        {
            accessorKey: 'description',
            minSize: 150,
            maxSize: 300,
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 -ml-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-transparent hover:cursor-pointer"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Description
                    <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 opacity-50" />
                </Button>
            ),
            cell: ({ row }) => (
                <div className="truncate text-foreground/80" title={row.getValue('description')}>
                    {row.getValue('description')}
                </div>
            ),
        },
        {
            id: 'actions',
            enableSorting: false,
            enableHiding: false,
            maxSize: 10,
            cell: ({ row }) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className="h-8 w-8 p-0 opacity-50 hover:opacity-100 hover:cursor-pointer"
                        >
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem
                            variant="destructive"
                            onClick={() => deleteFieldPermission(row.original.id)}
                        >
                            Delete Field Permission
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ];

    if (error) {
        return <ErrorDisplayComponent error={error} />;
    }

    const createButton = (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} key="create-field-permission">
            <DialogTrigger asChild>
                <Button size="sm" className="hover:cursor-pointer">
                    <KeyRound className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Create new field permission</DialogTitle>
                    <DialogDescription>
                        Define a field that can be granted to profiles or permission sets.
                    </DialogDescription>
                </DialogHeader>
                <CreateFieldPermissionComponent fireSuccess={handleSuccess} />
            </DialogContent>
        </Dialog>
    );

    const refreshButton = (
        <Button
            key="refresh-field-permissions"
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

    return (
        <DatatableWrapperComponent
            data={fieldPermissionsData}
            columns={columns}
            placeholder="Filter field permissions..."
            searchKey="label"
            actions={[createButton, refreshButton]}
        />
    );
}
