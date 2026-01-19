'use client';

import { DatatableWrapperComponent } from '@/components/application/datatable-wrapper';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, RefreshCw } from 'lucide-react';
import { formatDateToSwedish, getAssignmentStageColor } from '@/lib/utils';
import { useSearchParams } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { getAssignmentsByEmployeeNumber } from '@/actions/salesforce/salesforce-actions';
import { useState, useEffect, useCallback } from 'react';
import { ErrorDisplayComponent } from '@/components/errors/error-display';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import Link from 'next/link';
import { ASSIGNMENTS_ROUTE } from '@/menus/routes';

export function AssignmentsListDesktopComponent({
    assignments,
    employeeNumber,
    error: initialError,
    projectViews,
}) {
    const searchParams = useSearchParams();

    const viewParam = searchParams.get('view') || 'all';

    const [assignmentData, setAssignmentData] = useState(assignments);
    const [error, setError] = useState(initialError);

    const [searchQuery, setSearchQuery] = useState('');
    const [view, setView] = useState(viewParam);
    const [currentPage, setCurrentPage] = useState(1);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, view]);

    const setFilterAssignments = useCallback(
        (value) => {
            let filteredData = null;

            if (value === 'all') {
                filteredData = assignments;
            } else {
                filteredData = assignments.filter(
                    (item) => item['projectStatus'].toLowerCase() === value.toLowerCase()
                );
            }

            setAssignmentData(filteredData);
            setView(value);
        },
        [assignments]
    );

    // Apply initial filter based on URL view parameter
    useEffect(() => {
        setFilterAssignments(viewParam);
    }, [viewParam, setFilterAssignments]);

    const handleRefresh = async () => {
        if (isRefreshing) {
            return;
        }
        setIsRefreshing(true);

        let freshData = null;
        try {
            freshData = await getAssignmentsByEmployeeNumber(employeeNumber);
            setAssignmentData(freshData);
            setError(null);
        } catch (err) {
            setError(err);
        } finally {
            setIsRefreshing(false);
        }
    };

    const handleFilterAssignment = (value) => {
        setFilterAssignments(value);
    };

    const columns = [
        {
            accessorKey: 'name',
            size: 80,
            minSize: 80,
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
                        href={`${ASSIGNMENTS_ROUTE}/${id}`}
                        className="cursor-pointer font-medium dark:text-deploy-ocean text-deploy-blue hover:underline truncate transition-colors"
                        title={row.getValue('name')}
                    >
                        {row.getValue('name')}
                    </Link>
                );
            },
        },
        {
            accessorKey: 'projectName',
            size: 300,
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 -ml-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-transparent"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    >
                        Project Name
                        <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 opacity-50" />
                    </Button>
                );
            },
            cell: ({ row }) => (
                <div className="truncate text-foreground/80" title={row.getValue('projectName')}>
                    {row.getValue('projectName')}
                </div>
            ),
        },
        {
            accessorKey: 'projectStatus',
            size: 150,
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 -ml-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-transparent"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    >
                        Project Status
                        <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 opacity-50" />
                    </Button>
                );
            },
            cell: ({ row }) => {
                const projectStatus = row.getValue('projectStatus');
                return (
                    <Badge className={`${getAssignmentStageColor(projectStatus)} text-white shadow-sm`}>
                        {projectStatus}
                    </Badge>
                );
            },
        },
        {
            accessorKey: 'startDate',
            size: 120,
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 -ml-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-transparent"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    >
                        Start Date
                        <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 opacity-50" />
                    </Button>
                );
            },
            cell: ({ row }) => (
                <div className="text-foreground/70 tabular-nums">
                    {row.getValue('startDate')
                        ? formatDateToSwedish(row.getValue('startDate'))
                        : '-'}
                </div>
            ),
        },
        {
            accessorKey: 'endDate',
            size: 120,
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 -ml-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-transparent"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    >
                        End Date
                        <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 opacity-50" />
                    </Button>
                );
            },
            cell: ({ row }) => (
                <div className="text-foreground/70 tabular-nums">
                    {row.getValue('endDate') ? formatDateToSwedish(row.getValue('endDate')) : '-'}
                </div>
            ),
        },
    ];

    if (error) {
        return <ErrorDisplayComponent error={error} />;
    }

    const refreshAssignments = (
        <Button
            key="refresh-assignments"
            variant="ghost"
            size="icon"
            onClick={handleRefresh}
            disabled={isRefreshing}
        >
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
            <span className="sr-only">Refresh data</span>
        </Button>
    );

    const viewByProjects = (
        <Select value={view} onValueChange={handleFilterAssignment} key="view-by-projects">
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select view" />
            </SelectTrigger>
            <SelectContent>
                {projectViews.map((view) => (
                    <SelectItem key={view.value} value={view.value}>
                        {view.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );

    const actions = [refreshAssignments];
    const views = [viewByProjects];

    return (
        <DatatableWrapperComponent
            data={assignmentData}
            columns={columns}
            placeholder="Filter Assignments..."
            views={views}
            view={view}
            searchKey="projectName"
            actions={actions}
        />
    );
}
