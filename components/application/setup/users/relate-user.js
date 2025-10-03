'use client';

import { Input } from '@/components/ui/input';
import { searchUsersAction } from '@/actions/database/user-actions';
import { useState, useCallback, useMemo } from 'react';
import debounce from 'lodash/debounce';
import { Card } from '@/components/ui/card';
import { NoDataComponent } from '@/components/errors/no-data';
import { Spinner } from '@/components/ui/spinner';
import { FormError } from '@/components/auth/form/form-error';

export function RelateUser({ onUserSelect }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const debouncedSearch = useCallback(
        async (query) => {
            if (!query) {
                setUsers([]);
                setIsLoading(false);
                return;
            }

            try {
                const results = await searchUsersAction(query);
                setUsers(results);
            } catch (error) {
                console.error('Error searching users:', error);
                setError(error.message);
                setUsers([]);
            } finally {
                setIsLoading(false);
            }
        },
        [setUsers, setIsLoading]
    );

    const debouncedSearchWithDelay = useMemo(
        () => debounce(debouncedSearch, 300),
        [debouncedSearch]
    );

    const handleUserSelect = async (user) => {
        try {
            await onUserSelect?.(user);
            setError('');
        } catch (error) {
            console.error('Error selecting user:', error);
            setError(error.message);
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <Input
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => {
                    const query = e.target.value;
                    setSearchTerm(query);
                    if (!query) {
                        debouncedSearchWithDelay.cancel();
                        setUsers([]);
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

                {!isLoading && users.length === 0 && searchTerm && (
                    <div className="h-full flex items-center justify-center pt-1">
                        <NoDataComponent text="No users found, try again" />
                    </div>
                )}

                {!isLoading && users.length > 0 && (
                    <div className="space-y-2">
                        {users.map((user) => (
                            <Card
                                key={user.id}
                                className="p-4 hover:bg-accent cursor-pointer transition-colors"
                                onClick={() => handleUserSelect(user)}
                            >
                                <div className="flex flex-col">
                                    <span className="font-medium text-md">{user.name}</span>
                                    <span className="text-sm text-muted-foreground">
                                        {user.email}
                                    </span>
                                    {user.employeeNumber && (
                                        <span className="text-sm text-muted-foreground">
                                            {user.employeeNumber}
                                        </span>
                                    )}
                                </div>
                            </Card>
                        ))}
                        {error && <FormError message={error} />}
                    </div>
                )}
            </div>
        </div>
    );
}
