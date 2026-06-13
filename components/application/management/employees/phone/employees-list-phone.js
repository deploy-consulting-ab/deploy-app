'use client';

import { Input } from '@/components/ui/input';
import { EmployeeCardPhoneComponent } from '@/components/application/management/employees/phone/employee-card-phone';
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { EMPLOYEES_LIST_ROUTE } from '@/menus/routes';
import { ErrorDisplayComponent } from '@/components/errors/error-display';
import { useInfiniteScrollSentinel } from '@/hooks/use-infinite-scroll-sentinel';

export function EmployeesListPhoneComponent({ employees, error }) {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [displayCount, setDisplayCount] = useState(10);

    const loadMore = useCallback(() => {
        setDisplayCount((prev) => prev + 10);
    }, []);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setDisplayCount(10);
    };

    const handleEmployeeClick = (id) => {
        router.push(`${EMPLOYEES_LIST_ROUTE}/${id}`);
    };

    const filteredEmployees = () => {
        return (
            employees?.filter(
                (emp) =>
                    searchQuery === '' ||
                    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    (emp.employeeId &&
                        emp.employeeId.toLowerCase().includes(searchQuery.toLowerCase()))
            ) || []
        );
    };

    const filtered = filteredEmployees();
    const displayedEmployees = filtered.slice(0, displayCount);
    const hasMore = displayCount < filtered.length;
    const sentinelRef = useInfiniteScrollSentinel(hasMore, loadMore);

    if (error) {
        return <ErrorDisplayComponent error={error} />;
    }

    return (
        <div className="space-y-4">
            <Input
                placeholder="Search employees..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full text-sm"
            />
            <div className="space-y-4">
                {displayedEmployees.map((employee) => (
                    <EmployeeCardPhoneComponent
                        key={employee.id}
                        employee={employee}
                        onClick={handleEmployeeClick}
                    />
                ))}
                {filtered.length === 0 && (
                    <div className="text-center py-8 text-gray-500">No employees found</div>
                )}
            </div>
            {hasMore && (
                <div ref={sentinelRef} className="flex justify-center py-4">
                    <div className="text-sm text-gray-500">Loading more...</div>
                </div>
            )}
            {!hasMore && filtered.length > 0 && (
                <div className="text-center py-4 text-sm text-gray-500">All employees loaded</div>
            )}
        </div>
    );
}
