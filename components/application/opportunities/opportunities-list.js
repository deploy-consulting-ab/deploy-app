'use client';

import { DatatableWrapperComponent } from '@/components/application/datatable-wrapper';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';
import { formatDateToSwedish } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { getOpportunities } from '@/actions/salesforce/salesforce-actions';
import { useState, useEffect } from 'react';
import { ErrorDisplayComponent } from '@/components/errors/error-display';
import { OpportunityCardPhoneComponent } from './opportunity-card-phone';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import { getOpportunityStageColor } from '@/lib/utils';

export function OpportunitiesListComponent({ opportunities, error: initialError }) {

    const router = useRouter();

    const [opportunitiesData, setOpportunities] = useState(opportunities);
    const [error, setError] = useState(initialError);

    const handleRefresh = async () => {
        let freshData = null;
        try {
            freshData = await getOpportunities();
            setOpportunities(freshData);
            setError(null);
        } catch (err) {
            setError(err);
        }
        return freshData;
    };

    const handleOpportunityClick = (id) => {
        router.push(`/home/opportunities/${id}`);
    };

    const views = [
        { value: 'all', label: 'All Opportunities' },
        { value: 'Qualification', label: 'Qualification' },
        { value: 'Discovery', label: 'Discovery' },
        { value: 'Engagement Scoping', label: 'Engagement Scoping' },
        { value: 'Engagement Proposal', label: 'Engagement Proposal' },
        { value: 'Negotiation', label: 'Negotiation' },
        { value: 'Closed Won', label: 'Closed Won' },
        { value: 'Closed Lost', label: 'Closed Lost' },
    ];

    const columns = [
        {
            accessorKey: 'name',
            size: 250,
            minSize: 200,
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
                    <div
                        className="cursor-pointer text-blue-600 hover:underline truncate"
                        onClick={() => handleOpportunityClick(id)}
                        title={row.getValue('name')} // Show full text on hover
                    >
                        {row.getValue('name')}
                    </div>
                );
            },
        },
        {
            accessorKey: 'accountName',
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
                        Stage
                        <ArrowUpDown />
                    </Button>
                );
            },
            cell: ({ row }) => {
                const stage = row.getValue('stage');
                return <Badge className={`${getOpportunityStageColor(stage)} text-white`}>{stage}</Badge>;
            },
        },
        {
            accessorKey: 'closeDate',
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

    const [isMobile, setIsMobile] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedView, setSelectedView] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768); // 768px is typical md breakpoint
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, selectedView]);

    const filteredOpportunities = opportunitiesData
        .filter((opp) => selectedView === 'all' || opp.stage === selectedView)
        .filter(
            (opp) =>
                searchQuery === '' ||
                opp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                opp.accountName.toLowerCase().includes(searchQuery.toLowerCase())
        );

    if (error) {
        return <ErrorDisplayComponent error={error} />;
    }

    if (isMobile) {
        // Calculate pagination
        const totalPages = Math.ceil(filteredOpportunities.length / itemsPerPage);
        const startIndex = (currentPage - 1) * itemsPerPage;
        const paginatedOpportunities = filteredOpportunities.slice(
            startIndex,
            startIndex + itemsPerPage
        );

        return (
            <div className="space-y-4">
                <div className="space-y-2">
                    <Input
                        placeholder="Search opportunities..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full text-sm"
                    />
                    <Select value={selectedView} onValueChange={setSelectedView}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Filter by stage" />
                        </SelectTrigger>
                        <SelectContent>
                            {views.map((view) => (
                                <SelectItem key={view.value} value={view.value}>
                                    {view.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-4">
                    {paginatedOpportunities.map((opportunity) => (
                        <OpportunityCardPhoneComponent
                            key={opportunity.id}
                            opportunity={opportunity}
                            onClick={handleOpportunityClick}
                        />
                    ))}
                    {filteredOpportunities.length === 0 && (
                        <div className="text-center py-8 text-gray-500">No opportunities found</div>
                    )}
                </div>
                {totalPages > 1 && (
                    <div className="flex items-center justify-between pt-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </Button>
                        <span className="text-sm text-gray-600">
                            Page {currentPage} of {totalPages}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </Button>
                    </div>
                )}
            </div>
        );
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
