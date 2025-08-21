'use client';

import { useState, useEffect } from 'react';
import { HolidaysCard } from './holidays-card';
import { HolidaysCalendar } from './holidays-calendar';

export function HolidaysWrapper({ initialData, refreshAction, error }) {
    const [data, setData] = useState(initialData);
    const [currentError, setCurrentError] = useState(error);

    // Update state when props change
    useEffect(() => {
        if (initialData) {
            setData(initialData);
        }
    }, [initialData]);

    useEffect(() => {
        setCurrentError(error);
    }, [error]);

    async function handleRefresh() {
        try {
            const newData = await refreshAction();
            if (newData) {
                setData(newData);
                setCurrentError(null);
            }
        } catch (err) {
            console.error('Error refreshing data:', err);
            setCurrentError(err);
        }
    }

    return (
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
            <HolidaysCard
                holidays={data}
                error={currentError}
                isNavigationDisabled={true}
                refreshAction={handleRefresh}
            />
            <HolidaysCalendar
                holidays={data}
                error={currentError}
            />
        </div>
    );
}
