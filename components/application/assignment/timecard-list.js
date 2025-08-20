'use client';

import { WeeklyTimecardComponent } from "./weekly-timecard";
import { TimecardFilters } from "./timecard-filters";
import { useState, useMemo } from "react";
import { ErrorDisplay } from "@/components/errors/error-display";

const ITEMS_PER_PAGE = 10;

export function TimecardListComponent({ timecards = [], error }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedDate, setSelectedDate] = useState(null);

    // Filter timecards by date
    const filteredTimecards = useMemo(() => {
        if (!selectedDate) return timecards;

        // Helper function to normalize dates to midnight UTC
        const normalizeDate = (date) => {
            const normalized = new Date(date);
            normalized.setHours(0, 0, 0, 0);
            return normalized;
        };
        
        const normalizedSelectedDate = normalizeDate(selectedDate);
        
        return timecards.filter(timecard => {
            // Check if the week contains the selected date
            const weekStart = normalizeDate(timecard.weekStartDate);
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekEnd.getDate() + 6);
            weekEnd.setHours(23, 59, 59, 999); // End of day

            return normalizedSelectedDate >= weekStart && normalizedSelectedDate <= weekEnd;
        });
    }, [timecards, selectedDate]);

    // Calculate pagination
    const totalPages = Math.ceil(filteredTimecards.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedTimecards = filteredTimecards.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
        setCurrentPage(1); // Reset to first page when filter changes
    };

    if (error) {
        return <ErrorDisplay error={error} />;
    }

    return (
        <div>
            <TimecardFilters
                onDateChange={handleDateChange}
                onPageChange={handlePageChange}
                totalPages={totalPages}
                currentPage={currentPage}
            />
            
            <div className="space-y-4">
                {paginatedTimecards.map((weekData) => (
                    <WeeklyTimecardComponent 
                        key={weekData.weekStartDate} 
                        weekData={weekData} 
                    />
                ))}
                {paginatedTimecards.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                        {selectedDate 
                            ? "No time reports found for the selected date." 
                            : "No time reports available for this assignment."}
                    </p>
                )}
            </div>
        </div>
    );
}
