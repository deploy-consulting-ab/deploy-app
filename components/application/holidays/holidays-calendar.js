'use client';

import { ReadOnlyCalendar } from '@/components/ui/read-only-calendar';
import {
    Card,
    CardContent,
    CardTitle,
    CardHeader,
    CardDescription,
    CardAction,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { enGB } from 'react-day-picker/locale';
import { useLayoutSize } from '@/hooks/use-layout-size';
import { NoDataComponent } from '@/components/errors/no-data';
import { getUTCToday } from '@/lib/utils';

export function HolidaysCalendarComponent({ holidays, error }) {
    const [month, setMonth] = useState(getUTCToday());
    const isSingleColumn = useLayoutSize(1260);

    const handleToday = () => {
        const today = getUTCToday()
        setMonth(today)
        // Reset selection to holidays
        setSelectedDates(holidays?.allHolidaysRange || [])
    }

    return (
        <Card className="h-full pb-0" variant="shadow">
            <CardHeader className="border-b">
                <CardTitle>Holiday Calendar</CardTitle>
                <CardDescription>
                    Have a look at your calendar to see what you have been up to.
                </CardDescription>
                <CardAction>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={handleToday}
                        className="hover:cursor-pointer"
                    >
                        {/* <RefreshCw className="h-4 w-4" /> */}
                        Today
                    </Button>
                </CardAction>
            </CardHeader>
            <CardContent className="p-0">
                <div className="w-full h-full flex items-center justify-center">
                    <ReadOnlyCalendar
                        mode="multiple"
                        defaultMonth={month}
                        month={month}
                        onMonthChange={setMonth}
                        selected={holidays?.allHolidaysRange || []}
                        numberOfMonths={isSingleColumn ? 1 : 2}
                        locale={enGB}
                        disabled
                        showWeekNumber
                        showOutsideDays={false}
                        className="w-full flex items-center justify-center rounded-lg pt-0"
                    />
                </div>
            </CardContent>
        </Card>
    );
}
