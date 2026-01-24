'use client';

import { useEffect, useState } from 'react';
import { getHolidayRequests, deleteAbsenceRequest } from '@/actions/flex/flex-actions';
import { DatatableWrapperComponent } from '@/components/application/datatable-wrapper';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDateToISOString } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { getAbsenceStatusColor } from '@/lib/utils';
import { toastRichSuccess, toastRichError } from '@/lib/toast-library';

export function HolidaysRequestedListComponent({ employmentNumber }) {
    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchRequests = async () => {
            setIsLoading(true);
            try {
                const response = await getHolidayRequests(employmentNumber, new Date());
                setRequests(response || []);
            } catch (error) {
                console.error('Error fetching holiday requests:', error);
                setRequests([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRequests();
    }, [employmentNumber]);

    const handleEdit = async (id) => {
        // TODO: Implement edit functionality
        console.log('Edit holiday request:', id);
    };

    const handleDelete = async (id) => {
        try {
            await deleteAbsenceRequest(id);
            setRequests(requests.filter((request) => request.Id !== id));
            toastRichSuccess({
                message: 'Holiday request deleted successfully',
                duration: 2000,
            });
        } catch (error) {
            toastRichError({
                message: 'Error deleting holiday request',
                duration: 2000,
            });
        }
    };

    const columns = [
        {
            accessorKey: 'FromDate',
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
                        From Date
                        <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 opacity-50" />
                    </Button>
                );
            },
            cell: ({ row }) => {
                const dateValue = row.getValue('FromDate');
                return <div className="text-foreground/80">{formatDateToISOString(dateValue)}</div>;
            },
        },
        {
            accessorKey: 'ToDate',
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
                        To Date
                        <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 opacity-50" />
                    </Button>
                );
            },
            cell: ({ row }) => {
                const dateValue = row.getValue('ToDate');
                return <div className="text-foreground/80">{formatDateToISOString(dateValue)}</div>;
            },
        },
        {
            accessorKey: 'Hours',
            size: 100,
            minSize: 80,
            maxSize: 150,
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 -ml-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-transparent"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    >
                        Hours
                        <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 opacity-50" />
                    </Button>
                );
            },
            cell: ({ row }) => {
                const hours = row.getValue('Hours');
                return <div className="text-foreground/80 tabular-nums">{hours || '-'}</div>;
            },
        },
        {
            accessorKey: 'Status',
            size: 100,
            minSize: 80,
            maxSize: 150,
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 -ml-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-transparent"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    >
                        Status
                    </Button>
                );
            },
            cell: ({ row }) => {
                const status = row.original.status;
                return (
                    <Badge className={`${getAbsenceStatusColor(status)} text-white shadow-sm`}>
                        {status}
                    </Badge>
                );
            },
        },
        {
            id: 'actions',
            enableSorting: false,
            enableHiding: false,
            maxSize: 10,
            cell: ({ row }) => {
                const id = row.original.Id;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className="h-8 w-8 p-0 opacity-50 hover:opacity-100"
                            >
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(id)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                variant="destructive"
                                onClick={() => handleDelete(id)}
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-8">
                <p className="text-muted-foreground text-sm">Loading requests...</p>
            </div>
        );
    }

    return (
        <DatatableWrapperComponent
            data={requests}
            columns={columns}
            placeholder="Filter by date..."
            searchKey="FromDate"
            pageSize={5}
        />
    );
}
