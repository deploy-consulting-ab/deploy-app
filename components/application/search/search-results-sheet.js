'use client';

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { DatatableWrapperComponent } from '@/components/application/datatable-wrapper';
import Link from 'next/link';
import { ROUTES_MAP, ICON_MAP } from '@/components/application/search/constants';

function SearchResultsTable({ data, onNavigate }) {
    const columns = [
        {
            accessorKey: 'type',
            header: 'Type',
            cell: ({ row }) => {
                const type = row.getValue('type');
                const SearchIcon = ICON_MAP[type];
                return (
                    <div className="flex items-center gap-2">
                        {SearchIcon && <SearchIcon className="h-4 w-4" />}
                        <span>{type}</span>
                    </div>
                );
            },
        },
        {
            accessorKey: 'name',
            header: 'Name',
            cell: ({ row }) => {
                const type = row.getValue('type');
                const id = row.original.id;
                const name = row.getValue('name');
                const route = ROUTES_MAP[type];
                const href = `${route}/${id}`;

                return (
                    <Link
                        href={href}
                        className="cursor-pointer text-blue-600 hover:underline truncate"
                        onClick={() => onNavigate?.()}
                    >
                        {name}
                    </Link>
                );
            },
        },
        {
            accessorKey: 'accountName',
            header: 'Account',
        },
    ];

    return (
        <DatatableWrapperComponent
            data={data}
            columns={columns}
            placeholder="Filter records..."
            searchKey="name"
        />
    );
}

export function SearchResultsSheet({ open, onOpenChange, results }) {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-full sm:max-w-3xl">
                <SheetHeader>
                    <SheetTitle>Search Results</SheetTitle>
                </SheetHeader>
                {results?.records && (
                    <div className="mt-6 px-4 pb-4">
                        <SearchResultsTable
                            data={results.records}
                            onNavigate={() => onOpenChange(false)}
                        />
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}
