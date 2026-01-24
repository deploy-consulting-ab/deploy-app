'use client';

import { useState, useEffect } from 'react';
import { DatatableWrapperComponent } from '@/components/application/datatable-wrapper';
import { Badge } from '@/components/ui/badge';
import { formatDateToISOString, getAbsenceStatusColor, getAbsenceStatusText } from '@/lib/utils';
import { ABSENCE_STATUS_CODE } from '@/actions/flex/constants';
import { Loader2 } from 'lucide-react';

const columns = [
    {
        accessorKey: 'FromDate',
        header: 'Start Date',
        cell: ({ row }) => {
            const date = row.getValue('FromDate');
            return date ? formatDateToISOString(date) : '-';
        },
    },
    {
        accessorKey: 'ToDate',
        header: 'To Date',
        cell: ({ row }) => {
            const date = row.getValue('ToDate');
            return date ? formatDateToISOString(date) : '-';
        },
    },
    {
        accessorKey: 'Hours',
        header: 'Hours',
        cell: ({ row }) => {
            const hours = row.getValue('Hours');
            return hours !== null && hours !== undefined ? hours : '-';
        },
    },
    {
        accessorKey: 'CurrentStatus',
        header: 'Status',
        cell: ({ row }) => {
            const currentStatus = row.getValue('CurrentStatus');
            const statusCode = currentStatus?.Status;
            const statusText = ABSENCE_STATUS_CODE[statusCode] || 'Unknown';
            const colorClass = getAbsenceStatusColor(statusText);

            return <Badge className={`${colorClass} text-white`}>{statusText}</Badge>;
        },
    },
    {
        accessorKey: 'AbsenceTypeId',
        header: 'Absence Type',
        cell: ({ row }) => {
            const absenceTypeId = row.getValue('AbsenceTypeId');
            return getAbsenceStatusText(absenceTypeId) || '-';
        },
    },
];

export function AllAbsencesDatatableComponent({ absences }) {
    return (
        <div className="w-full">
            <DatatableWrapperComponent
                data={absences}
                columns={columns}
                placeholder="Search by date..."
                searchKey="FromDate"
                pageSize={10}
            />
        </div>
    );
}
