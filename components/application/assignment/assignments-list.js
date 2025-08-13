'use client';

import { DatatableWrapperComponent } from '@/components/application/datatable-wrapper';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, ChevronDown, MoreHorizontal } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDateToSwedish } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export function AssignmentListComponent({ assignments }) {
    const router = useRouter();

    const handleAssignmentClick = (id) => {
        router.push(`/home/assignments/${id}`);
    }

    const columns = [
        {
            accessorKey: 'id',
            header: 'ID',
            cell: ({ row }) => <div className="capitalize">{row.getValue('id')}</div>,
        },
        {
            accessorKey: 'name',
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
                    <div 
                        className="cursor-pointer text-blue-600 hover:underline"
                        onClick={() => handleAssignmentClick(id)}
                    >
                        {row.getValue('name')}
                    </div>
                );
            },
        },
        {
            accessorKey: 'stage',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        size="large"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    >
                        Stage
                        <ArrowUpDown />
                    </Button>
                );
            },
            cell: ({ row }) => <div className="capitalize">{row.getValue('stage')}</div>,
        },
        {
            accessorKey: 'startDate',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        size="large"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    >
                        Start Date
                        <ArrowUpDown />
                    </Button>
                );
            },
            cell: ({ row }) => (
                <div>
                    {row.getValue('startDate') ? formatDateToSwedish(row.getValue('startDate')) : '-'}
                </div>
            ),
        },
        {
            accessorKey: 'endDate',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        size="large"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    >
                        End Date
                        <ArrowUpDown />
                    </Button>
                );
            },
            cell: ({ row }) => (
                <div>
                    {row.getValue('endDate') ? formatDateToSwedish(row.getValue('endDate')) : '-'}
                </div>
            ),
        },
        {
            id: 'actions',
            enableHiding: false,
            cell: ({ row }) => {
                const payment = row.original;

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                                onClick={() => navigator.clipboard.writeText(payment.id)}
                            >
                                Copy payment ID
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>View customer</DropdownMenuItem>
                            <DropdownMenuItem>View payment details</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    return <DatatableWrapperComponent asChild data={assignments} columns={columns} placeholder="Filter assignments..." />;
}
