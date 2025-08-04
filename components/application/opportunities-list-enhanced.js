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

export function OpportunitiesListEnhancedComponent({ data }) {
    const { opportunities } = data;

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
            cell: ({ row }) => <div className="lowercase">{row.getValue('name')}</div>,
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
            accessorKey: 'amount',
            header: ({ column }) => {
                return (
                    <div className="text-right">
                        <Button
                            variant="ghost"
                            size="large"
                            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                        >
                            Amount
                            <ArrowUpDown />
                        </Button>
                    </div>
                );
            },
            cell: ({ row }) => {
                const amount = parseFloat(row.getValue('amount'));
                const currency = row.original.currency;

                // Format the amount as a dollar amount
                const formatted = new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: currency,
                }).format(amount);

                return <div className="text-right font-medium">{formatted}</div>;
            },
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

    return <DatatableWrapperComponent asChild data={opportunities} columns={columns} />;
}
