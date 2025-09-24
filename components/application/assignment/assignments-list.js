'use client';

import { DatatableWrapperComponent } from '@/components/application/datatable-wrapper';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';
import { formatDateToSwedish, getAssignmentStageColor } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { getAssignmentsByEmployeeNumber } from '@/actions/salesforce/salesforce-actions';
import { useState, useMemo, useEffect } from 'react';
import { ErrorDisplayComponent } from '@/components/errors/error-display';
import { NoDataComponent } from '@/components/errors/no-data';
import { AssignmentCardPhoneComponent } from '@/components/application/assignment/assignment-card-phone';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import Link from 'next/link';

export function AssignmentListComponent({ assignments, employeeNumber, error: initialError }) {
    const router = useRouter();
    const handleAssignmentClick = (id) => {
        router.push(`/home/assignments/${id}`);
    };

    const [assignmentData, setAssignmentData] = useState(assignments);
    const [error, setError] = useState(initialError);
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

    const handleRefresh = async () => {
        let freshData = null;
        try {
            freshData = await getAssignmentsByEmployeeNumber(employeeNumber);
            setAssignmentData(freshData);
            setError(null);
        } catch (err) {
            setError(err);
        }
        return freshData;
    };

    const views = [
        { value: 'all', label: 'All Assignments' },
        { value: 'Not Started', label: 'Not Started' },
        { value: 'Ongoing', label: 'Ongoing' },
        { value: 'Completed', label: 'Completed' },
    ];

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
                    <Link
                        href={`/home/assignments/${id}`}
                        className="cursor-pointer dark:text-deploy-ocean text-deploy-blue hover:underline truncate"
                        title={row.getValue('name')} // Show full text on hover
                    >
                        {row.getValue('name')}
                    </Link>
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
                const projectStatus = row.getValue('projectStatus');
                return (
                    <Badge className={`${getAssignmentStageColor(projectStatus)} text-white`}>
                        {projectStatus}
                    </Badge>
                );
            },
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
                    {row.getValue('startDate')
                        ? formatDateToSwedish(row.getValue('startDate'))
                        : '-'}
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
        },
    ];

    // Filter assignments based on search and view
    const filteredAssignments = useMemo(() => {
        return (
            assignmentData
                ?.filter(
                    (assignment) =>
                        selectedView === 'all' || assignment.projectStatus === selectedView
                )
                ?.filter(
                    (assignment) =>
                        searchQuery === '' ||
                        assignment.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        assignment.projectName.toLowerCase().includes(searchQuery.toLowerCase())
                ) || []
        );
    }, [assignmentData, selectedView, searchQuery]);

    if (error) {
        return <ErrorDisplayComponent error={error} />;
    }

    if (!assignmentData || assignmentData.length === 0) {
        return <NoDataComponent text="No assignments found" />;
    }

    if (isMobile) {
        // Calculate pagination
        const totalPages = Math.ceil(filteredAssignments.length / itemsPerPage);
        const startIndex = (currentPage - 1) * itemsPerPage;
        const paginatedAssignments = filteredAssignments.slice(
            startIndex,
            startIndex + itemsPerPage
        );

        return (
            <div className="space-y-4">
                <div className="space-y-2">
                    <Input
                        placeholder="Search assignments..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full text-sm"
                    />
                    <Select value={selectedView} onValueChange={setSelectedView}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Filter by status" />
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
                    {paginatedAssignments.map((assignment) => (
                        <AssignmentCardPhoneComponent
                            key={assignment.id}
                            assignment={assignment}
                            onClick={handleAssignmentClick}
                        />
                    ))}
                    {filteredAssignments.length === 0 && (
                        <div className="text-center py-8 text-gray-500">No assignments found</div>
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
            data={assignmentData}
            columns={columns}
            placeholder="Filter assignments..."
            refreshAction={handleRefresh}
            views={views}
            defaultView="all"
            searchKey="projectName"
            filterKey="projectStatus"
        />
    );
}
