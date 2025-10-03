'use client';

import { DatatableWrapperComponent } from '@/components/application/datatable-wrapper';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';
import Link from 'next/link';
import { ErrorDisplayComponent } from '@/components/errors/error-display';
import { getPermissionAssignmentsByIdAction } from '@/actions/database/permission-actions';
import { PERMISSION_SETS_ROUTE, PROFILES_ROUTE } from '@/menus/routes';

export function PermissionAssignmentsListComponent({
    allPermissionAssignments,
    error: initialError,

    permissionId,
}) {
    const [permissionData, setPermissionData] = useState(allPermissionAssignments);
    const [error, setError] = useState(initialError);

    const handleRefresh = async () => {
        let freshData = null;
        try {
            const permission = await getPermissionAssignmentsByIdAction(permissionId);
            freshData = permission.allPermissionAssignments;
            setPermissionData(freshData);
            setError(null);
        } catch (err) {
            setError(err);
        }
        return freshData;
    };

    const views = [
        { value: 'all', label: 'All' },
        { value: 'Profile', label: 'Profiles' },
        { value: 'Permission Set', label: 'Permission Sets' },
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
                const entityName = row.original.entityName;
                const route = entityName === 'Profile' ? PROFILES_ROUTE : PERMISSION_SETS_ROUTE;
                return (
                    <Link
                        href={`${route}/${id}`}
                        className="cursor-pointer dark:text-deploy-ocean text-deploy-blue hover:underline truncate"
                        title={row.getValue('name')}
                    >
                        {row.getValue('name')}
                    </Link>
                );
            },
        },
        {
            accessorKey: 'id',
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
                        Entity ID
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
            accessorKey: 'entityName',
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
                        Entity Name
                        <ArrowUpDown />
                    </Button>
                );
            },
            cell: ({ row }) => (
                <div className="truncate" title={row.getValue('entityName')}>
                    {row.getValue('entityName')}
                </div>
            ),
        },
    ];

    if (error) {
        return <ErrorDisplayComponent error={error} />;
    }

    return (
        <DatatableWrapperComponent
            data={permissionData}
            columns={columns}
            placeholder="Filter Permission Assignments..."
            refreshAction={handleRefresh}
            searchKey="name"
            defaultView="all"
            filterKey="entityName"
            views={views}
        />
    );
}
