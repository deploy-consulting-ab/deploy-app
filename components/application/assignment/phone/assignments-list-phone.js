'use client';

import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { AssignmentCardPhoneComponent } from '@/components/application/assignment/phone/assignment-card-phone';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ASSIGNMENTS_ROUTE } from '@/menus/routes';

export function AssignmentsListPhoneComponent({
    assignments,
    error: initialError,
    projectViews,
}) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [searchQuery, setSearchQuery] = useState('');
    const [view, setView] = useState(searchParams.get('view') || 'all');
    const [currentPage, setCurrentPage] = useState(1);

    const handleFilterAssignment = (value) => {
        setView(value);
    };

    const handleAssignmentClick = (id) => {
        router.push(`${ASSIGNMENTS_ROUTE}/${id}`);
    };

    const itemsPerPage = 5;
    // Filter assignments based on search and view
    const filteredAssignments = () => {
        return (
            assignments
                ?.filter(
                    (assignment) =>
                        view === 'all' ||
                        assignment.projectStatus.toLowerCase() === view.toLowerCase()
                )
                ?.filter(
                    (assignment) =>
                        searchQuery === '' ||
                        assignment.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        assignment.projectName.toLowerCase().includes(searchQuery.toLowerCase())
                ) || []
        );
    };

    // Calculate pagination
    const totalPages = Math.ceil(filteredAssignments().length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedAssignments = filteredAssignments().slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Input
                    placeholder="Search assignments..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full text-sm"
                />
                <Select value={view} onValueChange={handleFilterAssignment} key="view-by-projects">
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        {projectViews.map((view) => (
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
                {filteredAssignments().length === 0 && (
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
