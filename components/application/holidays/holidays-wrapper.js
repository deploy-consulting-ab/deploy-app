'use client';

import { useState, useEffect, useMemo } from 'react';
import { HolidaysCardComponent } from '@/components/application/home/dashboard-cards/holidays-card';
import { HolidaysCalendarComponent } from '@/components/application/holidays/holidays-calendar';
import { QuickLinksCardComponent } from '@/components/application/home/dashboard-cards/quick-links-card';
import { transformHolidaysData } from '@/lib/utils';
import { timeReportingLinks } from '@/lib/external-links';

export function HolidaysWrapperComponent({
    initialData,
    refreshAction,
    error,
    isNavigationDisabled = false,
}) {
    const [rawData, setRawData] = useState(initialData);
    const [currentError, setCurrentError] = useState(error);

    // Transform raw data for HolidaysCardComponent
    const transformedHolidays = useMemo(() => {
        return transformHolidaysData(rawData);
    }, [rawData]);

    // Transform links for QuickLinksCard
    const quickLinks = useMemo(() => {
        return timeReportingLinks.map((link) => ({
            title: link.title,
            description: link.description,
            href: link.href,
            icon: link.icon,
            external: link.target === '_blank',
        }));
    }, []);

    // Update state when props change
    useEffect(() => {
        if (initialData) {
            setRawData(initialData);
        }
    }, [initialData]);

    useEffect(() => {
        setCurrentError(error);
    }, [error]);

    async function handleRefresh() {
        try {
            const newData = await refreshAction();
            if (newData) {
                setRawData(newData);
                setCurrentError(null);
            }
        } catch (err) {
            console.error('Error refreshing data:', err);
            setCurrentError(err);
        }
    }

    return (
        <div className="relative">
            {/* Left side - determines the height */}
            <div className="lg:w-2/3 lg:pr-2">
                <HolidaysCardComponent
                    holidays={transformedHolidays}
                    error={currentError}
                    isNavigationDisabled={isNavigationDisabled}
                    refreshAction={handleRefresh}
                />
            </div>
            {/* Right side - positioned independently on large screens */}
            <div className="mt-4 lg:mt-0 lg:absolute lg:top-0 lg:right-0 lg:w-1/3 lg:pl-2 space-y-4">
                <HolidaysCalendarComponent
                    holidays={rawData}
                    error={currentError}
                    isNavigationDisabled={isNavigationDisabled}
                />
                <QuickLinksCardComponent
                    title="Flex"
                    description="Time reporting resources"
                    links={quickLinks}
                />
            </div>
        </div>
    );
}
