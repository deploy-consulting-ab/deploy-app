'use client';

import { Input } from '@/components/ui/input';
import { EmployeeCardPhoneComponent } from '@/components/application/management/employees/phone/employee-card-phone';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { EMPLOYEES_LIST_ROUTE } from '@/menus/routes';
import { ErrorDisplayComponent } from '@/components/errors/error-display';

export function EmployeesListPhoneComponent({ employees, error }) {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [displayCount, setDisplayCount] = useState(10);
    const observerTarget = useRef(null);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setDisplayCount(10);
    };

    const handleEmployeeClick = (id) => {
        router.push(`${EMPLOYEES_LIST_ROUTE}/${id}`);
    };

    const filteredEmployees = () => {
        return (
            employees
                ?.filter(
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

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    setDisplayCount((prev) => prev + 10);
                }
            },
            { threshold: 0.1 }
        );

        const currentTarget = observerTarget.current;

        if (currentTarget) {
            observer.observe(currentTarget);
        }

        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget);
            }
        };
    }, [hasMore]);

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
                <div ref={observerTarget} className="flex justify-center py-4">
                    <div className="text-sm text-gray-500">Loading more...</div>
                </div>
            )}
            {!hasMore && filtered.length > 0 && (
                <div className="text-center py-4 text-sm text-gray-500">
                    All employees loaded
                </div>
            )}
        </div>
    );
}
