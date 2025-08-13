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
            accessorKey: 'projectName',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        size="large"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    >
                        Project Name
                        <ArrowUpDown />
                    </Button>
                );
            },
            cell: ({ row }) => <div>{row.getValue('projectName')}</div>,
        },
        {
            accessorKey: 'projectStatus',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        size="large"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    >
                        Project Status
                        <ArrowUpDown />
                    </Button>
                );
            },
            cell: ({ row }) => <div>{row.getValue('projectStatus')}</div>,
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
        }
    ];

    return <DatatableWrapperComponent asChild data={assignments} columns={columns} placeholder="Filter assignments..." />;
}
