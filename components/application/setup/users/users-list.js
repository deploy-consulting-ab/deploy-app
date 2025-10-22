'use client';

import { DatatableWrapperComponent } from '@/components/application/datatable-wrapper';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { ErrorDisplayComponent } from '@/components/errors/error-display';
import Link from 'next/link';
import {
    ADMIN_PROFILE,
    SALES_PROFILE,
    CONSULTANT_PROFILE,
    MANAGEMENT_PROFILE,
} from '@/lib/system-permissions';
import { CreateUserComponent } from '@/components/application/setup/users/create-user';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { getUsersAction, deleteUserAction } from '@/actions/database/user-actions';
import { HOME_ROUTE, USERS_ROUTE } from '@/menus/routes';
import { toastRichSuccess, toastRichError } from '@/lib/toast-library';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { useImpersonation } from '@/hooks/use-impersonation';
import { useRouter } from 'next/navigation';

export function UsersListComponent({ users, error: initialError }) {
    const [usersData, setUsersData] = useState(users);
    const [error, setError] = useState(initialError);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const { startImpersonation } = useImpersonation();
    const router = useRouter();
    const handleRefresh = async () => {
        let freshData = null;
        try {
            freshData = await getUsersAction();
            setUsersData(freshData);
            setError(null);
        } catch (err) {
            setError(err);
        }
    };

    const handleSuccess = () => {
        setIsDialogOpen(false);
        handleRefresh();
        toastRichSuccess({
            message: 'User created',
        });
    };

    const deleteUser = async (id) => {
        try {
            await deleteUserAction(id);
            await handleRefresh();
            toastRichSuccess({
                message: 'User deleted!',
            });
        } catch (error) {
            toastRichError({
                message: error.message,
            });
        }
    };

    const handleImpersonation = async (id, name) => {
        try {
            await startImpersonation(id);
            toastRichSuccess({
                message: `Viewing as ${name}`,
            });
            router.push(HOME_ROUTE);
        } catch (error) {
            toastRichError({
                message: error.message,
            });
        }
    };

    const views = [
        { value: 'all', label: 'All Users' },
        { value: ADMIN_PROFILE, label: 'Admin Users' },
        { value: SALES_PROFILE, label: 'Sales Users' },
        { value: CONSULTANT_PROFILE, label: 'Consultant Users' },
        { value: MANAGEMENT_PROFILE, label: 'Manager Users' },
    ];

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
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        size="large"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    >
                        Profile
                        <ArrowUpDown />
                    </Button>
                );
            },
            cell: ({ row }) => {
                return (
                    <div className="truncate" title={row.getValue('profileId')}>
                        {row.getValue('profileId')}
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
                            <DropdownMenuItem onClick={() => deleteUser(row.original.id)}>
                                Delete User
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleImpersonation(row.original.id, row.original.name)}>
                                View As User
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    const actionButton = (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button size="sm">
                    <UserPlus className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Create new user</DialogTitle>
                    <DialogDescription>
                        Fill in the details to create a new user account.
                    </DialogDescription>
                </DialogHeader>
                <CreateUserComponent fireSuccess={handleSuccess} />
            </DialogContent>
        </Dialog>
    );

    if (error) {
        return <ErrorDisplayComponent error={error} />;
    }

    return (
        <DatatableWrapperComponent
            data={usersData}
            columns={columns}
            placeholder="Filter Users..."
            refreshAction={handleRefresh}
            views={views}
            defaultView="all"
            searchKey="name"
            filterKey="profileId"
            actionButton={actionButton}
        />
    );
}
