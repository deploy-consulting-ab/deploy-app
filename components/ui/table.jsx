'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

function Table({ className, ...props }) {
    return (
        <div data-slot="table-container" className="relative w-full overflow-x-auto">
            <table
                data-slot="table"
                className={cn('w-full caption-bottom text-sm border-separate border-spacing-0', className)}
                {...props}
            />
        </div>
    );
}

function TableHeader({ className, ...props }) {
    return (
        <thead
            data-slot="table-header"
            className={cn(
                'bg-muted/30 dark:bg-muted/20 sticky top-0 z-10',
                className
            )}
            {...props}
        />
    );
}

function TableBody({ className, ...props }) {
    return (
        <tbody
            data-slot="table-body"
            className={cn('[&_tr:last-child]:border-0', className)}
            {...props}
        />
    );
}

function TableFooter({ className, ...props }) {
    return (
        <tfoot
            data-slot="table-footer"
            className={cn('bg-muted/50 border-t font-medium [&>tr]:last:border-b-0', className)}
            {...props}
        />
    );
}

function TableRow({ className, ...props }) {
    return (
        <tr
            data-slot="table-row"
            className={cn(
                'group border-b border-border/50 transition-all duration-200 ease-out',
                'hover:bg-muted/40 dark:hover:bg-muted/30',
                'data-[state=selected]:bg-primary/5 data-[state=selected]:border-primary/20',
                className
            )}
            {...props}
        />
    );
}

function TableHead({ className, ...props }) {
    return (
        <th
            data-slot="table-head"
            className={cn(
                'h-12 px-4 text-left align-middle font-semibold text-muted-foreground/80 whitespace-nowrap',
                'text-xs uppercase tracking-wider',
                'border-b border-border/60',
                '[&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
                className
            )}
            {...props}
        />
    );
}

function TableCell({ className, ...props }) {
    return (
        <td
            data-slot="table-cell"
            className={cn(
                'px-4 py-3.5 align-middle whitespace-nowrap',
                'text-sm text-foreground/90',
                'border-b border-border/30 group-hover:border-border/50',
                'transition-colors duration-200',
                '[&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
                className
            )}
            {...props}
        />
    );
}

function TableCaption({ className, ...props }) {
    return (
        <caption
            data-slot="table-caption"
            className={cn('text-muted-foreground mt-4 text-sm', className)}
            {...props}
        />
    );
}

export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption };
