'use client';
import { useState, useCallback, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import debounce from 'lodash/debounce';

import { globalSearch } from '@/actions/search/search-service';

import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Spinner } from '@/components/ui/spinner';

export function GlobalSearch() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(null);
    const [searchValue, setSearchValue] = useState('');
    const searchRef = useRef(null);
    const containerRef = useRef(null);
    const router = useRouter();

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

    const debouncedSearch = useCallback(
        (query) => {
            if (!query) {
                setResults(null);
                setLoading(false);
                return;
            }

            const search = async () => {
                try {
                    const response = await globalSearch(query);
                    setResults(response);
                    setOpen(true);
                } catch (error) {
                    console.error('Search error:', error);
                    setResults(null);
                } finally {
                    setLoading(false);
                }
            };

            debounce(search, 300)();
        },
        [setResults, setLoading, setOpen]
    );

    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchValue(query);
        if (!query) {
            setResults(null);
            setOpen(false);
            return;
        }
        setLoading(true);
        debouncedSearch(query);
    };

    const handleClear = () => {
        setSearchValue('');
        setResults(null);
        setOpen(false);
        setLoading(false);
        if (searchRef.current) {
            searchRef.current.focus();
        }
    };

    const handleSelect = (type, item) => {
        setOpen(false);
        if (type === 'opportunity') {
            router.push(`/home/opportunities/${item.Id}`);
        } else if (type === 'assignment') {
            router.push(`/home/assignments/${item.Id}`);
        }
    };

    return (
        <div ref={containerRef} className="relative w-full">
                            <div className="relative w-full">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        ref={searchRef}
                        value={searchValue}
                        placeholder="Search records..."
                        className="pl-9 pr-8"
                        onChange={handleSearch}
                        onFocus={() => setOpen(true)}
                        onBlur={() => {
                            // Small delay to allow click events on results to fire before closing
                            setTimeout(() => setOpen(false), 100);
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
                                {results.opportunities.length > 0 && (
                                    <div>
                                        <h3 className="font-medium mb-2">Opportunities</h3>
                                        <div className="space-y-2">
                                            {results.opportunities.map((opportunity) => (
                                                <div
                                                    key={opportunity.id}
                                                    className="p-2 hover:bg-accent rounded-md cursor-pointer"
                                                    onClick={() => handleSelect('opportunity', opportunity)}
                                                >
                                                    <div className="font-medium">{opportunity.name}</div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {opportunity.accountName}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* {results.assignments.length > 0 && (
                                    <div>
                                        <h3 className="font-medium mb-2">Assignments</h3>
                                        <div className="space-y-2">
                                            {results.assignments.map((assignment) => (
                                                <div
                                                    key={assignment.Id}
                                                    className="p-2 hover:bg-accent rounded-md cursor-pointer"
                                                    onClick={() =>
                                                        handleSelect('assignment', assignment)
                                                    }
                                                >
                                                    <div className="font-medium">{assignment.Name}</div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {assignment.Project_Name__c}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )} */}

                                {results?.opportunities?.length === 0 &&
                                    // results?.assignments?.length === 0 && 
                                    (
                                        <div className="text-center text-muted-foreground py-4">
                                            No results found
                                        </div>
                                    )}
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
