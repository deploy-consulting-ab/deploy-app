'use client';

import { Calendar } from '@/components/ui/calendar';
import {
    Card,
    CardContent,
    CardTitle,
    CardHeader,
    CardDescription,
    CardAction,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { enGB } from 'react-day-picker/locale';
import { useLayoutSize } from '@/hooks/use-layout-size';
import { ErrorDisplay } from '@/components/errors/error-display';

export function CalendarHolidays({ holidays, error }) {
    const [month, setMonth] = useState(new Date());
    const [selectedDates, setSelectedDates] = useState(holidays?.allHolidaysRange || []);
    const isSingleColumn = useLayoutSize(1260);

    useEffect(() => {
        setSelectedDates(holidays?.allHolidaysRange || []);
    }, [holidays]);

    const handleSelect = (dates) => {
        setSelectedDates(dates || []);
    };

    const handleToday = () => {
        const today = new Date();
        setMonth(today);
        // Reset selection to holidays
        setSelectedDates(holidays?.allHolidaysRange || []);
    };

    if (error) {
        return (
            <div>
                <ErrorDisplay error={error} />
            </div>
        );
    }

    return (
        <Card className="h-full pb-0" variant="shadow">
            <CardHeader className="border-b">
                <CardTitle>Holiday Calendar</CardTitle>
                <CardDescription>
                    Have a look at your calendar to see what you have been up to.
                </CardDescription>
                <CardAction>
                    <Button size="sm" variant="outline" onClick={handleToday}>
                        {/* <RefreshCw className="h-4 w-4" /> */}
                        Today
                    </Button>
                </CardAction>
            </CardHeader>
            <CardContent className="p-0">
                <div className="w-full h-full flex items-center justify-center">
                    <Calendar
                        mode="multiple"
                        defaultMonth={month}
                        month={month}
                        onMonthChange={setMonth}
                        selected={selectedDates}
                        numberOfMonths={isSingleColumn ? 1 : 2}
                        onSelect={handleSelect}
                        locale={enGB}
                        disabled={{ dayOfWeek: [0, 6] }}
                        showWeekNumber
                        showOutsideDays={false}
                        className="w-full flex items-center justify-center rounded-lg"
                    />
                </div>
            </CardContent>
        </Card>
    );
}
