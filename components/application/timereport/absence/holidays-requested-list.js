'use client';

import { useEffect, useState } from 'react';
import { getHolidayRequests } from '@/actions/flex/flex-actions';

export function HolidaysRequestedListComponent({ employmentNumber }) {
    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // TODO: Fetch the list of requested holidays for the employmentNumber
        const fetchRequests = async () => {
            setIsLoading(true);
            try {
                // Replace with actual API call
                const response = await getHolidayRequests(
                    employmentNumber,
                    new Date().toISOString()
                );
                // setRequests(response)
                console.log('### response', response);
                setRequests([]);
            } catch (error) {
                console.error('Error fetching holiday requests:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRequests();
    }, [employmentNumber]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-8">
                <p className="text-muted-foreground text-sm">Loading requests...</p>
            </div>
        );
    }

    if (requests.length === 0) {
        return (
            <div className="flex items-center justify-center py-8">
                <p className="text-muted-foreground text-sm">No holiday requests found.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            {requests.map((request) => (
                <div key={request.id} className="border rounded-lg p-4 flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                        <span className="font-medium">
                            {request.startDate} - {request.endDate}
                        </span>
                        <span className="text-sm text-muted-foreground">{request.status}</span>
                    </div>
                    {request.comment && (
                        <p className="text-sm text-muted-foreground">{request.comment}</p>
                    )}
                </div>
            ))}
        </div>
    );
}
