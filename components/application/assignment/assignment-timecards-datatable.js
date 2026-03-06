'use client';

import { DatatableWrapperComponent } from '@/components/application/datatable-wrapper';
import { MONTHS } from '@/actions/flex/constants';

const columns = [
    {
        accessorKey: 'month',
        header: 'Month',
        cell: ({ row }) => MONTHS[row.getValue('month') - 1] ?? row.getValue('month'),
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

export function AssignmentTimecardsDatatable({ timecardHours }) {
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
