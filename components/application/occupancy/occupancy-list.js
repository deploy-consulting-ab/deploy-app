'use client';

import { useIsMobile } from '@/hooks/use-mobile';
import { OccupancyListPhoneComponent } from '@/components/application/occupancy/phone/occupancy-list-phone';
import { OccupancyListDesktopComponent } from '@/components/application/occupancy/occupancy-list-desktop';

export function OccupancyListComponent({
    occupancyData,
    flexEmployeeId,
    formattedToday,
    historyStartDate,
    error,
}) {
    const isMobile = useIsMobile();

    if (isMobile) {
        return <OccupancyListPhoneComponent occupancyData={occupancyData} error={error} />;
    }

    return (
        <OccupancyListDesktopComponent
            occupancyData={occupancyData}
            flexEmployeeId={flexEmployeeId}
            formattedToday={formattedToday}
            historyStartDate={historyStartDate}
            error={error}
        />
    );
}
