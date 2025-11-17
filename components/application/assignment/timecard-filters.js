'use client';

import { Button } from '@/components/ui/button';
import { ReadOnlyCalendar } from '@/components/ui/read-only-calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatDateToSwedish } from '@/lib/utils';
import { useState } from 'react';
import { enGB } from 'react-day-picker/locale';

export function TimecardFilters({ onDateChange, onPageChange, totalPages, currentPage }) {
    const [date, setDate] = useState(null);

    const handleSelect = (date) => {
        setDate(date);
        onDateChange(date);
    };

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6">
            <div className="flex items-center gap-2 w-full justify-between sm:w-auto sm:justify-start">
                <div className="flex items-center gap-2">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className="w-[160px] sm:w-[200px] justify-start text-left font-normal"
                            >
                                <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                                <span className="truncate">
                                    {date ? formatDateToSwedish(date) : 'Filter by date'}
                                </span>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <ReadOnlyCalendar
                                mode="single"
                                selected={date}
                                onSelect={handleSelect}
                                initialFocus
                                locale={enGB}
                            />
                        </PopoverContent>
                    </Popover>
                    {date && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleSelect(null)}
                            className="text-muted-foreground h-9 w-9"
                            title="Clear filter"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M18 6 6 18" />
                                <path d="m6 6 12 12" />
                            </svg>
                        </Button>
                    )}
                </div>

                <div className="flex items-center gap-2 sm:hidden">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage <= 1}
                        className="h-9 w-9"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-muted-foreground whitespace-nowrap min-w-[3rem] text-center">
                        {currentPage} / {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage >= totalPages}
                        className="h-9 w-9"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="hidden sm:flex items-center gap-2">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="h-9 w-9"
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-muted-foreground whitespace-nowrap min-w-[3rem] text-center">
                    {currentPage} / {totalPages}
                </span>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className="h-9 w-9"
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
