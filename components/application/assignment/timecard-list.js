'use client';

import { WeeklyTimecard } from "./weekly-timecard";
import { TimecardFilters } from "./timecard-filters";
import { useState, useMemo } from "react";

const ITEMS_PER_PAGE = 10;

export function TimecardList({ timecards = [] }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedDate, setSelectedDate] = useState(null);

    // Filter timecards by date
    const filteredTimecards = useMemo(() => {
        if (!selectedDate) return timecards;
        
        const selectedDateStr = selectedDate.toISOString().split('T')[0];
        return timecards.filter(timecard => {
            // Check if the week contains the selected date
            const weekStart = new Date(timecard.weekStartDate);
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekEnd.getDate() + 6);
            
            return selectedDate >= weekStart && selectedDate <= weekEnd;
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

    return (
        <div className="space-y-4">
            <TimecardFilters
                onDateChange={handleDateChange}
                onPageChange={handlePageChange}
                totalPages={totalPages}
                currentPage={currentPage}
            />
            
            <div className="space-y-4">
                {paginatedTimecards.map((weekData) => (
                    <WeeklyTimecard 
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
