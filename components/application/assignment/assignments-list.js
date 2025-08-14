'use client';

import { DatatableWrapperComponent } from '@/components/application/datatable-wrapper';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';
import { formatDateToSwedish, getStageColor } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { getAssignmentsByEmployeeNumber } from '@/actions/salesforce/salesforce-actions';

export function AssignmentListComponent({ assignments, employeeNumber }) {
    const router = useRouter();

    const handleAssignmentClick = (id) => {
        router.push(`/home/assignments/${id}`);
    }

    const handleRefresh = async () => {
        return getAssignmentsByEmployeeNumber(employeeNumber);
    }

    const columns = [
        {
            accessorKey: 'name',
            size: 80,
            minSize: 80,
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
            accessorKey: 'projectName',
            size: 300, // Larger size for project names
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
            cell: ({ row }) => (
                <div className="truncate" title={row.getValue('projectName')}>
                    {row.getValue('projectName')}
                </div>
            ),
        },
        {
            accessorKey: 'projectStatus',
            size: 150, // Fixed size for status
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
            cell: ({ row }) => {
                // <div className="truncate" title={row.getValue('projectStatus')}>
                //     {row.getValue('projectStatus')}
                // </div>
                const projectStatus = row.getValue('projectStatus');
                return (
                <Badge className={`${getStageColor(projectStatus)} text-white`}>
                    {projectStatus}
                </Badge>
            )},
        },
        {
            accessorKey: 'startDate',
            size: 120, // Fixed size for dates
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
            size: 120, // Fixed size for dates
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

    return (
        <DatatableWrapperComponent 
            asChild 
            data={assignments} 
            columns={columns} 
            placeholder="Filter assignments..."
            refreshAction={handleRefresh}
        />
    );
}
