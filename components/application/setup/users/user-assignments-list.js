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
import {
    addPermissionSetToUserAction,
    removePermissionSetFromUserAction,
    getUserByIdWithPermissionsAction,
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

    const handleRefresh = async () => {
        doRefresh();
    };

    const doRefresh = async () => {
        let freshData = null;
        try {
            const user = await getUserByIdWithPermissionsAction(userId);
            setPermissionSetsData(user.permissionSets);
            setError(null);
        } catch (err) {
            setError(err);
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
                        Permission Set ID
                        <ArrowUpDown />
                    </Button>
                );
            },
            cell: ({ row }) => (
                <div className="truncate" title={row.getValue('id')}>
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
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => removeAssignment(row.original.id)}>
                                Remove Permission Set
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

    return (
        <div className="col-span-2">
            <DatatableWrapperComponent
                data={permissionSetsData}
                columns={columns}
                placeholder="Filter Permission Sets..."
                refreshAction={handleRefresh}
                searchKey="name"
                actionButton={actionButton}
            />
        </div>
    );
}
