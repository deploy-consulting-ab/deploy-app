'use client';
import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import debounce from 'lodash/debounce';
import { globalSearch } from '@/actions/search/search-service';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { SearchResultsSheet } from '@/components/application/search/search-results-sheet';
import { ClipboardList, TrendingUp } from 'lucide-react';

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
        async (query) => {
            if (!query) {
                setResults(null);
                setLoading(false);
                return;
            }

            try {
                const response = await globalSearch(query, 5, user?.employeeNumber);
                setResults(response);
                setOpen(true);
            } catch (error) {
                console.error('Search error:', error);
                setResults(null);
            } finally {
                setLoading(false);
            }
        },
        [setResults, setLoading, setOpen, user?.employeeNumber]
    );

    const debouncedSearchWithDelay = useMemo(
        () => debounce(debouncedSearch, 300),
        [debouncedSearch]
    );

    // Clear search when route changes
    useEffect(() => {
        clearSearch();
        // Cancel any pending searches when route changes
        return () => {
            debouncedSearchWithDelay.cancel();
        };
    }, [pathname, clearSearch, debouncedSearchWithDelay]);

    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchValue(query);
        if (!query) {
            debouncedSearchWithDelay.cancel(); // Cancel any pending searches
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
        debouncedSearchWithDelay(query);
    };

    const handleClear = () => {
        debouncedSearchWithDelay.cancel(); // Cancel any pending searches
        clearSearch();
    };

    const handleSelect = (type, item) => {
        if (type === 'Opportunity') {
            router.push(`/home/opportunities/${item.id}`);
        } else if (type === 'Assignment') {
            router.push(`/home/assignments/${item.id}`);
        }
    };

    const openSearchResults = () => {
        setSheetOpen(true);
        setOpen(false);
    };

    return (
        <div ref={containerRef} className="relative w-full max-w-[600px] md:w-[400px]">
            <div className="relative w-full">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    ref={searchRef}
                    value={searchValue}
                    placeholder="Search for records"
                    className="pl-9 pr-8 text-sm bg-background/50 border-border/50 focus:bg-background rounded-full h-9"
                    onChange={handleSearch}
                    onFocus={() => setOpen(true)}
                    onBlur={() => {
                        setTimeout(() => setOpen(false), 200);
                    }}
                />
                {searchValue && (
                    <button
                        onClick={handleClear}
                        className="absolute right-2 top-2 h-5 w-5 text-muted-foreground hover:text-foreground rounded-full hover:bg-accent flex items-center justify-center"
                    >
                        <X className="h-3.5 w-3.5" />
                    </button>
                )}
            </div>
            {open && (loading || results) && (
                <div className="absolute top-full left-0 w-[calc(100%+7.5rem)] -translate-x-8 sm:translate-x-0 sm:w-fit min-w-full max-w-[600px] mt-2 p-2 sm:p-4 bg-popover text-popover-foreground rounded-md border shadow-md z-50">
                    <div className="w-full overflow-hidden text-ellipsis sm:w-max sm:min-w-full">
                        {loading && (
                            <div className="flex justify-center p-4">
                                <Spinner />
                            </div>
                        )}

                        {results && !loading && (
                            <>
                                <div className="space-y-1">
                                    {results?.slicedRecords?.length > 0 && (
                                        <div>
                                            {results.slicedRecords.map((record) => (
                                                <div
                                                    key={record.id}
                                                    className="p-1.5 sm:p-2 hover:bg-accent rounded-md cursor-pointer"
                                                    onClick={() =>
                                                        handleSelect(record.type, record)
                                                    }
                                                >
                                                    <div className="text-xs sm:text-base font-medium truncate">
                                                        {record.name}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {record.type === 'Opportunity' && (
                                                            <TrendingUp className="h-4 w-4 flex-shrink-0" />
                                                        )}
                                                        {record.type === 'Assignment' && (
                                                            <ClipboardList className="h-4 w-4 flex-shrink-0" />
                                                        )}
                                                        <div className="text-[10px] sm:text-xs text-muted-foreground truncate">
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

                                {results?.records?.length === 0 && (
                                    <div className="text-center text-muted-foreground">
                                        No results found
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}

            <SearchResultsSheet open={sheetOpen} onOpenChange={setSheetOpen} results={results} />
        </div>
    );
}
