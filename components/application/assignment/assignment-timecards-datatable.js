'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { DatatableWrapperComponent } from '@/components/application/datatable-wrapper';
import { MONTHS } from '@/actions/flex/constants';
import { formatLocalDateKey, getLocalMonthBounds } from '@/lib/utils';

function createColumns(timecardsRoute, assignmentId) {
    return [
        {
            accessorKey: 'month',
            header: 'Month',
            cell: ({ row }) => {
                const month = row.getValue('month');
                const year = row.getValue('year');
                const monthName = MONTHS[month - 1] ?? month;

                if (!timecardsRoute || !assignmentId) {
                    return monthName;
                }

                const { startDate, endDate } = getLocalMonthBounds(year, month);
                const href = `${timecardsRoute}/${assignmentId}/timecards?startDate=${formatLocalDateKey(startDate)}&endDate=${formatLocalDateKey(endDate)}`;

                return (
                    <Link
                        href={href}
                        className="cursor-pointer font-medium dark:text-deploy-ocean text-deploy-blue hover:underline truncate transition-colors"
                    >
                        {monthName}
                    </Link>
                );
            },
            filterFn: (row, _columnId, filterValue) => {
                const monthName = MONTHS[row.getValue('month') - 1] ?? '';
                const year = String(row.getValue('year') ?? '');
                const combined = `${monthName} ${year}`.toLowerCase();
                return combined.includes(filterValue.toLowerCase());
            },
        },
        {
            accessorKey: 'year',
            header: 'Year',
        },
        {
            accessorKey: 'totalHours',
            header: 'Total Hours',
            cell: ({ row }) => `${row.getValue('totalHours')} hours`,
        },
    ];
}

export function AssignmentTimecardsDatatable({ timecardHours, timecardsRoute, assignmentId }) {
    const columns = useMemo(
        () => createColumns(timecardsRoute, assignmentId),
        [timecardsRoute, assignmentId]
    );

    if (!timecardHours || timecardHours.length === 0) {
        return null;
    }

    return (
        <DatatableWrapperComponent
            data={timecardHours}
            columns={columns}
            placeholder="Search by month or year..."
            searchKey="month"
            pageSize={12}
        />
    );
}
