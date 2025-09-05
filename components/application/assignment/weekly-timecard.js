'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDateToSwedish } from '@/lib/utils';

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export function WeeklyTimecardComponent({ weekData }) {
    const { weekStartDate, weekEndDate, hours } = weekData;
    const totalHours = hours.reduce((sum, hour) => sum + hour, 0);

    return (
        <Card className="w-full">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">
                        {formatDateToSwedish(weekStartDate)} to {formatDateToSwedish(weekEndDate)}
                    </CardTitle>
                    <span className="text-sm text-muted-foreground">Total: {totalHours}h</span>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-7 gap-1">
                    {hours.map((hours, index) => (
                        <div
                            key={DAYS_OF_WEEK[index]}
                            className="flex flex-col items-center p-2 rounded-md bg-muted/50"
                        >
                            <span className="text-xs text-muted-foreground">
                                {DAYS_OF_WEEK[index].slice(0, 3)}
                            </span>
                            <span className="text-sm font-medium">{hours}h</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
