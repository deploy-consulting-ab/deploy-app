'use client';

import { DatatableWrapperComponent } from '@/components/application/datatable-wrapper';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, RefreshCw } from 'lucide-react';
import { getEmployees } from '@/actions/salesforce/salesforce-actions';
import { useState } from 'react';
import { ErrorDisplayComponent } from '@/components/errors/error-display';
import Link from 'next/link';
import { EMPLOYEES_LIST_ROUTE } from '@/menus/routes';
import { Checkbox } from '@/components/ui/checkbox';
import { formatDateToSwedish } from '@/lib/utils';

export function EmployeesListDesktopComponent({ employees, error: initialError }) {
    const [employeesData, setEmployeesData] = useState(employees);
    const [error, setError] = useState(initialError);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = async () => {
        if (isRefreshing) {
            return;
        }
        setIsRefreshing(true);

        try {
            const freshData = await getEmployees();
            setEmployeesData(freshData);
            setError(null);
        } catch (err) {
            setError(err);
        } finally {
            setIsRefreshing(false);
        }
    };

    const columns = [
        {
            accessorKey: 'name',
            size: 300,
            minSize: 200,
            maxSize: 500,
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
                        href={`${EMPLOYEES_LIST_ROUTE}/${id}`}
                        className="cursor-pointer font-medium dark:text-deploy-ocean text-deploy-blue hover:underline truncate transition-colors"
                        title={row.getValue('name')}
                    >
                        {row.getValue('name')}
                    </Link>
                );
            },
        },
        {
            accessorKey: 'employeeId',
            size: 150,
            minSize: 100,
            maxSize: 200,
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 -ml-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-transparent"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    >
                        Employee ID
                        <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 opacity-50" />
                    </Button>
                );
            },
            cell: ({ row }) => (
                <div className="text-foreground/70 tabular-nums">
                    {row.getValue('employeeId') ?? '-'}
                </div>
            ),
        },
        {
            accessorKey: 'isActive',
            size: 100,
            minSize: 100,
            maxSize: 100,
            header: 'Active',
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
            accessorKey: 'employmentType',
            size: 100,
            minSize: 100,
            maxSize: 100,
            header: 'Employment Type',
            cell: ({ row }) => (
                <div className="text-foreground/70 tabular-nums">
                    {row.getValue('employmentType') ?? '-'}
                </div>
            ),
        },
        {
            accessorKey: 'employmentStartDate',
            size: 100,
            minSize: 100,
            maxSize: 100,
            header: 'Employment Start Date',
            cell: ({ row }) => (
                <div className="text-foreground/70 tabular-nums">{row.getValue('employmentStartDate') ? formatDateToSwedish(row.getValue('employmentStartDate')) : '-'}</div>
            ),
        },
        {
            accessorKey: 'employmentEndDate',
            size: 100,
            minSize: 100,
            maxSize: 100,
            header: 'Employment End Date',
            cell: ({ row }) => (
                <div className="text-foreground/70 tabular-nums">{row.getValue('employmentEndDate') ? formatDateToSwedish(row.getValue('employmentEndDate')) : '-'}</div>
            ),
        },
    ];

    const refreshEmployees = (
        <Button
            key="refresh-employees"
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

    const actions = [refreshEmployees];

    if (error) {
        return <ErrorDisplayComponent error={error} />;
    }

    return (
        <DatatableWrapperComponent
            data={employeesData}
            columns={columns}
            placeholder="Filter Employees..."
            searchKey="name"
            actions={actions}
        />
    );
}
