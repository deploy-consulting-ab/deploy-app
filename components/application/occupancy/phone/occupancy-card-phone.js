'use client';

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { getOccupancyLevel } from '@/components/application/occupancy/occupancy-chart-shared';
import { getOccupancyPeriodRoute } from '@/menus/routes';

function OccupancyBadge({ rate }) {
    const level = getOccupancyLevel(rate);

    return (
        <span
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
            style={{
                backgroundColor: `color-mix(in oklch, ${level.color} 20%, transparent)`,
                color: level.color,
            }}
        >
            {level.label}
        </span>
    );
}

function formatHours(hours) {
    if (hours === null || hours === undefined) return '-';
    return hours.toFixed(1);
}

export function OccupancyCardPhoneComponent({ occupancy }) {
    return (
        <Link href={getOccupancyPeriodRoute(occupancy.date)} className="block">
        <Card className="w-full mb-4 hover:bg-accent/30 transition-colors cursor-pointer">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-semibold">{occupancy.period}</CardTitle>
                    <OccupancyBadge rate={occupancy.rate} />
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm text-muted-foreground">Rate</p>
                            <p className="font-mono font-medium">{occupancy.rate}%</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-muted-foreground">Total Hours</p>
                            <p className="font-mono font-medium">
                                {formatHours(occupancy.totalHours)}
                            </p>
                        </div>
                    </div>
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm text-muted-foreground">External Hours</p>
                            <p className="font-mono font-medium">
                                {formatHours(occupancy.externalHours)}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-muted-foreground">Internal Hours</p>
                            <p className="font-mono font-medium">
                                {formatHours(occupancy.internalHours)}
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
        </Link>
    );
}
