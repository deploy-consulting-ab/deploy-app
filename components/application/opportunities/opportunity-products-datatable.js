'use client';

import { DatatableWrapperComponent } from '@/components/application/datatable-wrapper';
import { formatDateToSwedish } from '@/lib/utils';

const columns = [
    {
        accessorKey: 'productName',
        header: 'Product Name',
    },
    {
        accessorKey: 'startDate',
        header: 'Start Date',
        cell: ({ row }) => formatDateToSwedish(row.getValue('startDate')),
    },
    {
        accessorKey: 'endDate',
        header: 'End Date',
        cell: ({ row }) => formatDateToSwedish(row.getValue('endDate')),
    },
];

export function OpportunityProductsDatatable({ products }) {
    if (!products || products.length === 0) {
        return null;
    }

    return (
        <DatatableWrapperComponent
            data={products}
            columns={columns}
            placeholder="Search by product name..."
            searchKey="productName"
            pageSize={10}
        />
    );
}
