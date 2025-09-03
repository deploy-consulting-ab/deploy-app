'use client';
import { useState, useCallback, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import debounce from 'lodash/debounce';
import { globalSearch } from '@/actions/search/search-service';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { DatatableWrapperComponent } from '@/components/application/datatable-wrapper';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import Link from 'next/link';
import { ClipboardList, TrendingUp } from 'lucide-react';

const columns = [
    {
        accessorKey: 'type',
        header: 'Type',
        cell: ({ row }) => {
            const type = row.getValue('type');
            return (
                <div className="flex items-center gap-2">
                    {type === 'Opportunity' && <TrendingUp className="h-4 w-4" />}
                    {type === 'Assignment' && <ClipboardList className="h-4 w-4" />}
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
            
            const href = type === 'Opportunity' 
                ? `/home/opportunities/${id}`
                : `/home/assignments/${id}`;
            
            return (
                <Link href={href} className="hover:underline">
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

function SearchResultsTable({ data }) {
    return (
        <DatatableWrapperComponent
            data={data}
            columns={columns}
            placeholder="Filter records..."
            searchKey="name"
        />
    );
}

export function GlobalSearch({ user }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(null);
    const [searchValue, setSearchValue] = useState('');
    const [sheetOpen, setSheetOpen] = useState(false);
    const searchRef = useRef(null);
    const containerRef = useRef(null);
    const router = useRouter();
    const pathname = usePathname();

    // Handle clicks outside of search component
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const clearSearch = useCallback(() => {
        setSearchValue('');
        setResults(null);
        setOpen(false);
        setLoading(false);
        if (searchRef.current) {
            searchRef.current.focus();
        }
    }, []);

    const debouncedSearch = useCallback(
        debounce(async (query) => {
            if (!query) {
                setResults(null);
                setLoading(false);
                return;
            }

            try {
                const response = await globalSearch(query, 3, user?.employeeNumber, user?.role);
                console.log('## response', response);
                setResults(response);
                setOpen(true);
            } catch (error) {
                console.error('Search error:', error);
                setResults(null);
            } finally {
                setLoading(false);
            }
        }, 300),
        [setResults, setLoading, setOpen, user?.employeeNumber, user?.role]
    );

    // Clear search when route changes
    useEffect(() => {
        clearSearch();
        // Cancel any pending searches when route changes
        return () => {
            debouncedSearch.cancel();
        };
    }, [pathname, clearSearch, debouncedSearch]);

    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchValue(query);
        if (!query) {
            debouncedSearch.cancel(); // Cancel any pending searches
            setResults(null);
            setOpen(false);
            return;
        }

        if (query.length < 3) {
            setResults(null);
            setLoading(false);
            return;
        }

        setLoading(true);
        debouncedSearch(query);
    };

    const handleClear = () => {
        debouncedSearch.cancel(); // Cancel any pending searches
        clearSearch();
    };

    const handleSelect = (type, item) => {
        if (type === 'Opportunity') {
            router.push(`/home/opportunities/${item.id}`);
        } else if (type === 'Assignment') {
            router.push(`/home/assignments/${item.id}`);
        }
    };

    const navigateToOpportunities = () => {
        router.push('/home/opportunities');
    };

    const navigateToAssignments = () => {
        router.push('/home/assignments');
    };

    const openSearchResults = () => {
        setSheetOpen(true);
        setOpen(false); // Close the dropdown
    };

    return (
        <div ref={containerRef} className="relative w-full">
            <div className="relative w-full">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    ref={searchRef}
                    value={searchValue}
                    placeholder="Search records..."
                    className="pl-9 pr-8 text-sm"
                    onChange={handleSearch}
                    onFocus={() => setOpen(true)}
                    onBlur={() => {
                        // Small delay to allow click events on results to fire before closing
                        setTimeout(() => setOpen(false), 200);
                    }}
                />
                {searchValue && (
                    <button
                        onClick={handleClear}
                        className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground hover:text-foreground"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>
            {open && (loading || results) && (
                <div className="absolute top-full left-0 w-full mt-2 p-4 bg-popover text-popover-foreground rounded-md border shadow-md z-50">
                    <div className="space-y-4">
                        {loading && (
                            <div className="flex justify-center p-4">
                                <Spinner />
                            </div>
                        )}

                        {results && !loading && (
                            <>
                                <div className="space-y-1">
                                    {/* {results?.opportunitiesResults?.opportunities?.length > 0 && (
                                        <div>
                                            {results.opportunitiesResults.opportunities.map((opportunity) => (
                                                <div
                                                    key={opportunity.id}
                                                    className="p-2 hover:bg-accent rounded-md cursor-pointer"
                                                    onClick={() =>
                                                        handleSelect('opportunity', opportunity)
                                                    }
                                                >
                                                    <div className="font-medium">
                                                        {opportunity.name}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <TrendingUp className="h-4 w-4" />
                                                        <div className="text-sm text-muted-foreground">
                                                            Opportunity - {opportunity.accountName}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}

                                        </div>
                                    )}

                                    {results?.assignmentsResults?.assignments?.length > 0 && (
                                        <div>
                                            {results.assignmentsResults.assignments.map((assignment) => (
                                                <div
                                                    key={assignment.id}
                                                    className="p-2 hover:bg-accent rounded-md cursor-pointer"
                                                    onClick={() =>
                                                        handleSelect('assignment', assignment)
                                                    }
                                                >
                                                    <div className="font-medium">
                                                        {assignment.projectName}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <ClipboardList className="h-4 w-4" />
                                                        <div className="text-sm text-muted-foreground">
                                                            Assignment - {assignment.accountName}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}

                                        </div>
                                    )} */}

                                    {results?.records?.length > 0 && (
                                        <div>
                                            {results.records.map((record) => (
                                                <div
                                                    key={record.id}
                                                    className="p-2 hover:bg-accent rounded-md cursor-pointer"
                                                    onClick={() =>
                                                        handleSelect(record.type, record)
                                                    }
                                                >
                                                    <div className="font-medium">{record.name}</div>
                                                    <div className="flex items-center gap-2">
                                                        {record.type === 'Opportunity' && (
                                                            <TrendingUp className="h-4 w-4" />
                                                        )}
                                                        {record.type === 'Assignment' && (
                                                            <ClipboardList className="h-4 w-4" />
                                                        )}
                                                        <div className="text-sm text-muted-foreground">
                                                            {record.type} - {record.accountName}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {results?.records?.length > 5 && (
                                        <button
                                            onClick={openSearchResults}
                                            className="w-full text-sm text-muted-foreground hover:text-foreground mt-4 p-2 hover:bg-accent rounded-md text-center"
                                        >
                                            View More
                                        </button>
                                    )}
                                </div>

                                {results?.opportunitiesResults?.opportunities?.length === 0 &&
                                    results?.assignmentsResults?.assignments?.length === 0 && (
                                        <div className="text-center text-muted-foreground py-4">
                                            No results found
                                        </div>
                                    )}
                            </>
                        )}
                    </div>
                </div>
            )}

            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <SheetContent className="w-full sm:max-w-3xl">
                    <SheetHeader>
                        <SheetTitle>Search Results</SheetTitle>
                    </SheetHeader>
                    {results?.records && (
                        <div className="mt-6 px-4 pb-4">
                            <SearchResultsTable data={results.records} />
                        </div>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    );
}
