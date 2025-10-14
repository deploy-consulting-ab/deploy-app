import * as React from 'react';
import { cn } from '@/lib/utils';

export function RecordCardHeader({ title, description, className, children }) {
    return (
        <div
            className={cn(
                'flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 border-b',
                className
            )}
        >
            <div className="space-y-1">
                <h3 className="text-lg font-semibold leading-none tracking-tight">{title}</h3>
                {description && <p className="text-sm text-muted-foreground">{description}</p>}
            </div>
            <div className="flex items-center gap-2 shrink-0">{children}</div>
        </div>
    );
}
