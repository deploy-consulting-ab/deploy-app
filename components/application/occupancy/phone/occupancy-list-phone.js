'use client';

import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { OccupancyCardPhoneComponent } from '@/components/application/occupancy/phone/occupancy-card-phone';
import { useState, useEffect, useRef } from 'react';
import { ErrorDisplayComponent } from '@/components/errors/error-display';
import {
    getOccupancyLevel,
    OCCUPANCY_LEVELS,
} from '@/components/application/occupancy/occupancy-chart-shared';

const occupancyViews = [
    { value: 'all', label: 'All Records' },
    { value: 'Below Target', label: 'Below Target' },
    { value: 'Target', label: 'Target' },
    { value: 'Optimal', label: 'Optimal' },
    { value: 'Full', label: 'Full' },
    { value: 'Over Capacity', label: 'Over Capacity' },
];

export function OccupancyListPhoneComponent({ occupancyData, error }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [view, setView] = useState('all');
    const [displayCount, setDisplayCount] = useState(10);
    const observerTarget = useRef(null);

    const handleFilterOccupancy = (value) => {
        setView(value);
        setDisplayCount(10);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setDisplayCount(10);
    };

    const filteredOccupancy = () => {
        return (
            occupancyData
                ?.filter((record) => {
                    if (view === 'all') return true;
                    const level = getOccupancyLevel(record.rate);
                    return level.label === view;
                })
                ?.filter(
                    (record) =>
                        searchQuery === '' ||
                        record.period.toLowerCase().includes(searchQuery.toLowerCase())
                ) || []
        );
    };

    const filtered = filteredOccupancy();
    const displayedOccupancy = filtered.slice(0, displayCount);
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
            <div className="space-y-2">
                <Input
                    placeholder="Search by period..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-full text-sm"
                />
                <Select value={view} onValueChange={handleFilterOccupancy} key="view-by-status">
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        {occupancyViews.map((viewOption) => (
                            <SelectItem key={viewOption.value} value={viewOption.value}>
                                {viewOption.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-4">
                {displayedOccupancy.map((occupancy) => (
                    <OccupancyCardPhoneComponent key={occupancy.id} occupancy={occupancy} />
                ))}
                {filtered.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                        No occupancy records found
                    </div>
                )}
            </div>
            {hasMore && (
                <div ref={observerTarget} className="flex justify-center py-4">
                    <div className="text-sm text-muted-foreground">Loading more...</div>
                </div>
            )}
            {!hasMore && filtered.length > 0 && (
                <div className="text-center py-4 text-sm text-muted-foreground">
                    All records loaded
                </div>
            )}
        </div>
    );
}
