'use client';

import { useState, useEffect, useMemo, useTransition } from 'react';
import { HolidaysCardComponent } from '@/components/application/home/dashboard-cards/holidays-card';
import { HolidaysCalendarComponent } from '@/components/application/holidays/holidays-calendar';
import { QuickLinksCardComponent } from '@/components/application/home/dashboard-cards/quick-links-card';
import { AllAbsencesDatatableComponent } from '@/components/application/holidays/all-absences-datatable';
import { transformHolidaysData } from '@/lib/utils';
import { timeReportingLinks } from '@/lib/external-links';

export function HolidaysWrapperComponent({
    holidays,
    absences,
    refreshAction,
    error,
    isNavigationDisabled = false,
}) {
    const [currentError, setCurrentError] = useState(error);
    const [isPending, startTransition] = useTransition();

    // Transform holidays data for HolidaysCardComponent
    const transformedHolidays = useMemo(() => {
        return transformHolidaysData(holidays);
    }, [holidays]);

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

    useEffect(() => {
        setCurrentError(error);
    }, [error]);

    function handleRefresh() {
        startTransition(async () => {
            try {
                await refreshAction();
                setCurrentError(null);
            } catch (err) {
                console.error('Error refreshing data:', err);
                setCurrentError(err);
            }
        });
    }

    return (
        <div className="space-y-6">
            {/* Top section - HolidaysCard left, Calendar + QuickLinks right */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Left side - 2/3 width on large screens */}
                <div className="lg:col-span-2">
                    <HolidaysCardComponent
                        holidays={transformedHolidays}
                        error={currentError}
                        isNavigationDisabled={isNavigationDisabled}
                        onRefresh={handleRefresh}
                        isRefreshing={isPending}
                    />
                </div>
                {/* Right side - 1/3 width on large screens */}
                <div className="space-y-4">
                    <HolidaysCalendarComponent
                        holidays={holidays}
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
            {/* All Absences Datatable */}
            {absences && (
                <div>
                    <h2 className="text-lg font-semibold mb-4">All Absences</h2>
                    <AllAbsencesDatatableComponent absences={absences} />
                </div>
            )}
        </div>
    );
}
