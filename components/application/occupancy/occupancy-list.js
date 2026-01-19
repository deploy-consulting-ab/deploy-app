'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { ErrorDisplayComponent } from '@/components/errors/error-display';
import { NoDataComponent } from '@/components/errors/no-data';
import { getOccupancyLevel, OCCUPANCY_LEVELS } from './occupancy-chart-shared';

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

function formatMonth(month, year) {
    return `${month} ${year}`;
}

function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

function formatHours(hours) {
    if (hours === null || hours === undefined) return '-';
    return hours.toFixed(1);
}

export function OccupancyListComponent({ data, error, currentPage }) {
    const router = useRouter();
    const searchParams = useSearchParams();

    if (error) {
        return (
            <Card className="@container/card" variant="shadow">
                <CardContent className="flex items-center justify-center h-64">
                    <ErrorDisplayComponent error={error} />
                </CardContent>
            </Card>
        );
    }

    if (!data || data.data?.length === 0) {
        return (
            <Card className="@container/card" variant="shadow">
                <CardContent className="flex items-center justify-center h-64">
                    <NoDataComponent text="No occupancy history found" />
                </CardContent>
            </Card>
        );
    }

    const { data: records, totalCount, page, pageSize, totalPages } = data;

    const handlePageChange = (newPage) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', newPage.toString());
        router.push(`?${params.toString()}`);
    };

    const canGoPrevious = page > 1;
    const canGoNext = page < totalPages;

    return (
        <Card className="@container/card" variant="shadow">
            <CardHeader>
                <CardTitle>Occupancy History</CardTitle>
                <CardDescription>
                    Historical occupancy rates showing {records.length} of {totalCount} records
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="rounded-lg border border-border/50 overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Period</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">Rate</TableHead>
                                <TableHead className="hidden sm:table-cell">Status</TableHead>
                                <TableHead className="hidden md:table-cell text-right">
                                    Billable Hours
                                </TableHead>
                                <TableHead className="hidden md:table-cell text-right">
                                    Total Hours
                                </TableHead>
                                <TableHead className="hidden lg:table-cell text-right">
                                    Available Hours
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {records.map((record) => {
                                const level = getOccupancyLevel(record.rate);
                                return (
                                    <TableRow key={record.id}>
                                        <TableCell className="font-medium">
                                            {formatMonth(record.month, record.year)}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {formatDate(record.date)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <span
                                                className="font-mono font-semibold"
                                                style={{ color: level.color }}
                                            >
                                                {record.rate}%
                                            </span>
                                        </TableCell>
                                        <TableCell className="hidden sm:table-cell">
                                            <OccupancyBadge rate={record.rate} />
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell text-right font-mono text-muted-foreground">
                                            {formatHours(record.billableHours)}
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell text-right font-mono text-muted-foreground">
                                            {formatHours(record.totalHours)}
                                        </TableCell>
                                        <TableCell className="hidden lg:table-cell text-right font-mono text-muted-foreground">
                                            {formatHours(record.availableHours)}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between pt-4">
                    <div className="text-sm text-muted-foreground">
                        Page {page} of {totalPages}
                    </div>
                    <div className="flex items-center gap-1">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handlePageChange(1)}
                            disabled={!canGoPrevious}
                            className="h-8 w-8"
                        >
                            <ChevronsLeft className="h-4 w-4" />
                            <span className="sr-only">First page</span>
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handlePageChange(page - 1)}
                            disabled={!canGoPrevious}
                            className="h-8 w-8"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            <span className="sr-only">Previous page</span>
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handlePageChange(page + 1)}
                            disabled={!canGoNext}
                            className="h-8 w-8"
                        >
                            <ChevronRight className="h-4 w-4" />
                            <span className="sr-only">Next page</span>
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handlePageChange(totalPages)}
                            disabled={!canGoNext}
                            className="h-8 w-8"
                        >
                            <ChevronsRight className="h-4 w-4" />
                            <span className="sr-only">Last page</span>
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
