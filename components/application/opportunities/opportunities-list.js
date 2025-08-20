'use client';

import { DatatableWrapperComponent } from '@/components/application/datatable-wrapper';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';
import { formatDateToSwedish } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { getOpportunities } from '@/actions/salesforce/salesforce-actions';
import { useState } from 'react';
import { ErrorDisplay } from '@/components/errors/error-display';

export function OpportunitiesListComponent({ opportunities, error: initialError }) {
    const router = useRouter();
    const handleAssignmentClick = (id) => {
        // router.push(`/home/opportunities/${id}`);
    };

    const getStageColor = (stage) => {
        switch (stage.toLowerCase()) {
            case 'closed won':
                return 'bg-green-500';
            case 'closed lost':
                return 'bg-red-500';
            case 'proposal/price quote':
                return 'bg-yellow-500';
            case 'negotiation/review':
                return 'bg-purple-500';
            case 'qualification':
                return 'bg-blue-500';
            case 'needs analysis':
                return 'bg-orange-500';
            default:
                return 'bg-gray-500';
        }
    };

    const [opportunitiesData, setOpportunities] = useState(opportunities);
    const [error, setError] = useState(initialError);

    const handleRefresh = async () => {
        try {
            const freshData = await getOpportunities(employeeNumber);
            setOpportunities(freshData);
            setError(null);
        } catch (err) {
            setError(err);
        }
        return freshData;
    };

    const views = [
        { value: 'all', label: 'All Opportunities' },
        { value: 'Prospecting', label: 'Prospecting' },
        { value: 'Qualification', label: 'Qualification' },
        { value: 'Needs Analysis', label: 'Needs Analysis' },
        { value: 'Value Proposition', label: 'Value Proposition' },
        { value: 'Id. Decision Makers', label: 'Id. Decision Makers' },
        { value: 'Perception Analysis', label: 'Perception Analysis' },
        { value: 'Proposal/Price Quote', label: 'Proposal/Price Quote' },
        { value: 'Negotiation/Review', label: 'Negotiation/Review' },
        { value: 'Closed Won', label: 'Closed Won' },
        { value: 'Closed Lost', label: 'Closed Lost' },
    ];

    const columns = [
        {
            accessorKey: 'name',
            size: 300,
            minSize: 300,
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
                        className="cursor-pointer text-blue-600 hover:underline truncate"
                        onClick={() => handleAssignmentClick(id)}
                        title={row.getValue('name')} // Show full text on hover
                    >
                        {row.getValue('name')}
                    </div>
                );
            },
        },
        {
            accessorKey: 'accountName',
            size: 200, // Larger size for project names
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        size="large"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    >
                        Account Name
                        <ArrowUpDown />
                    </Button>
                );
            },
            cell: ({ row }) => (
                <div className="truncate" title={row.getValue('accountName')}>
                    {row.getValue('accountName')}
                </div>
            ),
        },
        {
            accessorKey: 'stage',
            size: 150, // Fixed size for status
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
            cell: ({ row }) => {
                const stage = row.getValue('stage');
                return <Badge className={`${getStageColor(stage)} text-white`}>{stage}</Badge>;
            },
        },
        {
            accessorKey: 'closeDate',
            size: 120, // Fixed size for dates
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        size="large"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    >
                        Close Date
                        <ArrowUpDown />
                    </Button>
                );
            },
            cell: ({ row }) => (
                <div>
                    {row.getValue('closeDate')
                        ? formatDateToSwedish(row.getValue('closeDate'))
                        : '-'}
                </div>
            ),
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

                if (!amount) {
                    return <div className="text-right font-medium">-</div>;
                }

                // Format the amount as a dollar amount
                const formatted = new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: currency,
                }).format(amount);

                return <div className="text-right font-medium">{formatted}</div>;
            },
        },
    ];

    if (error) {
        return <ErrorDisplay error={error} />;
    }

    return (
        <DatatableWrapperComponent
            data={opportunitiesData}
            columns={columns}
            placeholder="Filter Opportunities..."
            refreshAction={handleRefresh}
            views={views}
            defaultView="all"
            searchKey="name"
            filterKey="stage"
        />
    );
}
