'use client';

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { formatDateToSwedish } from "@/lib/utils";
import { useState } from "react";

export function TimecardFilters({ 
    onDateChange, 
    onPageChange,
    totalPages,
    currentPage
}) {
    const [date, setDate] = useState(null);

    const handleSelect = (date) => {
        setDate(date);
        onDateChange(date);
    };

    return (
        <div className="flex items-center justify-between pb-6">
            <div className="flex items-center space-x-2">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="min-w-[240px] justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? formatDateToSwedish(date) : "Filter by date"}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={handleSelect}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
                {date && (
                    <Button 
                        variant="ghost" 
                        onClick={() => handleSelect(null)}
                        className="text-muted-foreground"
                    >
                        Clear filter
                    </Button>
                )}
            </div>
            
            <div className="flex items-center space-x-2">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                </span>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
