'use client';

import { useState } from 'react';
import { DatatableWrapperComponent } from '@/components/application/datatable-wrapper';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, RefreshCw } from 'lucide-react';
import { ErrorDisplayComponent } from '@/components/errors/error-display';
import { getOccupancyLevel } from '@/components/application/occupancy/occupancy-chart-shared';
import { getOccupancyHistory } from '@/actions/salesforce/salesforce-actions';

function OccupancyBadge({ rate }) {
    const level = getOccupancyLevel(rate);

    return (
        <span
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
            style={{
                backgroundColor: `color-mix(in oklch, ${level.color} 20%, transparent)`,
                color: level.color,
            }}
        >
            {level.label}
        </span>
    );
}

function formatHours(hours) {
    if (hours === null || hours === undefined) return '-';
    return hours.toFixed(1);
}

export function OccupancyListDesktopComponent({
    occupancyData,
    employeeNumber,
    formattedToday,
    error: initialError,
}) {
    const [data, setData] = useState(occupancyData);
    const [error, setError] = useState(initialError);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = async () => {
        if (isRefreshing) {
            return;
        }
        setIsRefreshing(true);

        try {
            const freshData = await getOccupancyHistory(employeeNumber, formattedToday);
            setData(freshData);
            setError(null);
        } catch (err) {
            setError(err);
        } finally {
            setIsRefreshing(false);
        }
    };

    const columns = [
        {
            accessorKey: 'period',
            size: 120,
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 -ml-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-transparent"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    >
                        Period
                        <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 opacity-50" />
                    </Button>
                );
            },
            cell: ({ row }) => (
                <div className="font-medium">
                    {row.original.month} {row.original.year}
                </div>
            ),
        },
        {
            accessorKey: 'rate',
            size: 100,
            header: ({ column }) => {
                return (
                    <div className="text-right">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 -mr-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-transparent"
                            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                        >
                            Rate
                            <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 opacity-50" />
                        </Button>
                    </div>
                );
            },
            cell: ({ row }) => (
                <div className="text-right font-mono font-medium">{row.getValue('rate')}%</div>
            ),
        },
        {
            accessorKey: 'status',
            size: 120,
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 -ml-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-transparent"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    >
                        Status
                        <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 opacity-50" />
                    </Button>
                );
            },
            cell: ({ row }) => <OccupancyBadge rate={row.original.rate} />,
        },
        {
            accessorKey: 'externalHours',
            size: 120,
            header: ({ column }) => {
                return (
                    <div className="text-right">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 -mr-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-transparent"
                            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                        >
                            External Hours
                            <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 opacity-50" />
                        </Button>
                    </div>
                );
            },
            cell: ({ row }) => (
                <div className="text-right font-mono text-foreground/70">
                    {formatHours(row.getValue('externalHours'))}
                </div>
            ),
        },
        {
            accessorKey: 'internalHours',
            size: 120,
            header: ({ column }) => {
                return (
                    <div className="text-right">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 -mr-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-transparent"
                            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                        >
                            Internal Hours
                            <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 opacity-50" />
                        </Button>
                    </div>
                );
            },
            cell: ({ row }) => (
                <div className="text-right font-mono text-foreground/70">
                    {formatHours(row.getValue('internalHours'))}
                </div>
            ),
        },
        {
            accessorKey: 'totalHours',
            size: 120,
            header: ({ column }) => {
                return (
                    <div className="text-right">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 -mr-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-transparent"
                            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                        >
                            Total Hours
                            <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 opacity-50" />
                        </Button>
                    </div>
                );
            },
            cell: ({ row }) => (
                <div className="text-right font-mono text-foreground/70">
                    {formatHours(row.getValue('totalHours'))}
                </div>
            ),
        },
        {
            accessorKey: 'totalMonthlyHours',
            size: 120,
            header: ({ column }) => {
                return (
                    <div className="text-right">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 -mr-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-transparent"
                            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                        >
                            Total Monthly Hours
                            <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 opacity-50" />
                        </Button>
                    </div>
                );
            },
            cell: ({ row }) => (
                <div className="text-right font-mono text-foreground/70">
                    {formatHours(row.getValue('totalMonthlyHours'))}
                </div>
            ),
        },
    ];

    if (error) {
        return <ErrorDisplayComponent error={error} />;
    }

    const refreshOccupancy = (
        <Button
            key="refresh-occupancy"
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

    const actions = [refreshOccupancy];

    return (
        <DatatableWrapperComponent
            data={data}
            columns={columns}
            placeholder="Filter by period..."
            searchKey="period"
            actions={actions}
        />
    );
}
