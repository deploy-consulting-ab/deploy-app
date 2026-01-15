'use client';

import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export function ModernMetricCard({ title, value, goal, average, unit, chart, className }) {
    return (
        <Card className={cn('p-6 bg-card/50 backdrop-blur border-border/50', className)}>
            <h3 className="text-sm font-medium text-muted-foreground mb-4">{title}</h3>

            {chart && <div className="mb-6 h-24 relative">{chart}</div>}

            <div className="space-y-3">
                <div className="text-4xl font-bold text-foreground">
                    {value}
                    {unit && <span className="text-xl text-muted-foreground ml-1">{unit}</span>}
                </div>

                <div className="flex items-center justify-between text-sm">
                    <div className="space-y-1">
                        <div className="text-muted-foreground">Goal</div>
                        <div className="font-medium text-foreground">{goal}</div>
                    </div>
                    <div className="space-y-1 text-right">
                        <div className="text-muted-foreground">Average</div>
                        <div className="font-medium text-foreground">{average}</div>
                    </div>
                </div>
            </div>
        </Card>
    );
}
