'use client';
import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import debounce from 'lodash/debounce';
import { globalSearch } from '@/actions/search/search-service';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { SearchResultsSheet } from '@/components/application/search/search-results-sheet';
import { ROUTES_MAP, ICON_MAP } from '@/components/application/search/constants';
import { HomeSearchResults } from '@/components/application/search/home-search-results';
import { SetupSearchResults } from '@/components/application/search/setup-search-results';

export function GlobalSearch({ user, location }) {
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
                const response = await globalSearch(query, 5, user?.employeeNumber, location);
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
        const route = ROUTES_MAP[type];
        router.push(`${route}/${item.id}`);
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
                    className="pl-9 pr-8 text-base md:text-sm border-transparent rounded-full h-9 focus-visible:ring-0 focus-visible:border-border transition-[border-color] duration-300 ease-in-out"
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

                        {/* Results */}
                        {results?.slicedRecords?.length > 0 && !loading && (
                            <>
                                {location === 'home' && (
                                    <HomeSearchResults
                                        totalRecords={results.records}
                                        slicedRecords={results.slicedRecords}
                                        handleSelect={handleSelect}
                                        openSearchResults={openSearchResults}
                                    />
                                )}
                                {location === 'setup' && (
                                    <SetupSearchResults
                                        totalRecords={results.records}
                                        slicedRecords={results.slicedRecords}
                                        handleSelect={handleSelect}
                                        openSearchResults={openSearchResults}
                                    />
                                )}
                            </>
                        )}

                        {results?.records?.length === 0 && (
                            <div className="text-center text-muted-foreground">
                                No results found
                            </div>
                        )}
                    </div>
                </div>
            )}

            <SearchResultsSheet open={sheetOpen} onOpenChange={setSheetOpen} results={results} />
        </div>
    );
}
