'use client';

import { Input } from '@/components/ui/input';
import { useState, useCallback, useMemo } from 'react';
import debounce from 'lodash/debounce';
import { Card } from '@/components/ui/card';
import { NoDataComponent } from '@/components/errors/no-data';
import { Spinner } from '@/components/ui/spinner';
import { FormError } from '@/components/auth/form/form-error';

export function RelateRecordComponent({ onRecordSelect, placeholder, onSearch }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [records, setRecords] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const debouncedSearch = useCallback(
        async (query) => {
            if (!query) {
                setRecords([]);
                setIsLoading(false);
                return;
            }

            try {
                const results = await onSearch(query);
                setRecords(results);
            } catch (error) {
                setError(error.message);
                setRecords([]);
            } finally {
                setIsLoading(false);
            }
        },
        [setRecords, setIsLoading, onSearch]
    );

    const debouncedSearchWithDelay = useMemo(
        () => debounce(debouncedSearch, 300),
        [debouncedSearch]
    );

    const handleRecordSelect = async (record) => {
        try {
            await onRecordSelect?.(record);
            setError('');
        } catch (error) {
            console.error('Error selecting record:', error);
            setError(error.message);
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <Input
                type="text"
                placeholder={placeholder}
                value={searchTerm}
                onChange={(e) => {
                    const query = e.target.value;
                    setSearchTerm(query);
                    if (!query) {
                        debouncedSearchWithDelay.cancel();
                        setRecords([]);
                        return;
                    }
                    setIsLoading(true);
                    debouncedSearchWithDelay(query);
                }}
                className="w-full"
            />

            <div className="max-h-[400px] overflow-y-auto pt-2">
                {isLoading && (
                    <div className="h-full flex items-center justify-center">
                        <Spinner size="sm" />
                    </div>
                )}

                {!isLoading && records.length === 0 && searchTerm && !error && (
                    <div className="h-full flex items-center justify-center pt-1">
                        <NoDataComponent text="No records found, try again" />
                    </div>
                )}

                {!isLoading && records.length > 0 && (
                    <div className="space-y-2">
                        {records.map((record) => (
                            <Card
                                key={record.id}
                                className="p-4 hover:bg-accent cursor-pointer transition-colors"
                                onClick={() => handleRecordSelect(record)}
                            >
                                <div className="flex flex-col">
                                    {record.name && (
                                        <span className="font-medium text-md">{record.name}</span>
                                    )}
                                    {record.email && (
                                        <span className="text-sm text-muted-foreground">
                                            {record.email}
                                        </span>
                                    )}
                                    {record.employeeNumber && (
                                        <span className="text-sm text-muted-foreground">
                                            {record.employeeNumber}
                                        </span>
                                    )}
                                </div>
                            </Card>
                        ))}
                    </div>
                )}

                {error && <FormError message={error} />}
            </div>
        </div>
    );
}
