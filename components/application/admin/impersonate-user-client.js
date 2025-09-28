'use client';

import { useState } from 'react';
import { useImpersonation } from '@/hooks/use-impersonation';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function ImpersonateUserClient({ users }) {
    const [selectedUserId, setSelectedUserId] = useState('');
    const { startImpersonation, isLoading } = useImpersonation();

    const handleImpersonation = async () => {
        if (!selectedUserId) return;
        try {
            await startImpersonation(selectedUserId);
        } catch (error) {
            console.error('Failed to impersonate user:', error);
            // You might want to add toast notification here
        }
    };

    return (
        <div className="space-y-4 p-4 bg-background rounded-lg border">
            <h2 className="text-lg font-semibold">Impersonate User</h2>
            <div className="flex gap-2">
                <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Select a user" />
                    </SelectTrigger>
                    <SelectContent>
                        {users.map((user) => (
                            <SelectItem key={user.id} value={user.id}>
                                {user.name} ({user.email})
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Button 
                    onClick={handleImpersonation}
                    disabled={!selectedUserId || isLoading}
                >
                    {isLoading ? 'Loading...' : 'View As'}
                </Button>
            </div>
        </div>
    );
}
