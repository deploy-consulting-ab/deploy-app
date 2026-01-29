'use client';

import { useState } from 'react';
import { DatatableWrapperComponent } from '@/components/application/datatable-wrapper';
import { Badge } from '@/components/ui/badge';
import { formatDateToISOString, getAbsenceStatusColor, getAbsenceStatusText } from '@/lib/utils';
import {
    ABSENCE_STATUS_CODE,
    ABSENCE_STATUS_TYPE_TEXT,
    HOLIDAY_TYPE_ID,
    SICK_LEAVE_TYPE_ID,
} from '@/actions/flex/constants';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

const absenceTypeViews = [
    { value: 'all', label: 'All Types' },
    { value: HOLIDAY_TYPE_ID, label: 'Holiday' },
    { value: SICK_LEAVE_TYPE_ID, label: 'Sick Leave' },
];

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
    const [absencesData, setAbsencesData] = useState(absences);
    const [view, setView] = useState('all');

    const handleFilterAbsences = (value) => {
        let filteredData = null;

        if (value === 'all') {
            filteredData = absences;
        } else {
            filteredData = absences.filter((absence) => absence.AbsenceTypeId === value);
        }

        setAbsencesData(filteredData);
        setView(value);
    };

    const viewByAbsenceType = (
        <Select value={view} onValueChange={handleFilterAbsences} key="view-by-absence-type">
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
                {absenceTypeViews.map((viewOption) => (
                    <SelectItem key={viewOption.value} value={viewOption.value}>
                        {viewOption.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );

    const views = [viewByAbsenceType];

    return (
        <div className="w-full">
            <DatatableWrapperComponent
                data={absencesData}
                columns={columns}
                placeholder="Search by date..."
                searchKey="FromDate"
                pageSize={10}
                views={views}
            />
        </div>
    );
}
