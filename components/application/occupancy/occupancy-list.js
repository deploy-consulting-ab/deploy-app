'use client';

import { useIsMobile } from '@/hooks/use-mobile';
import { OccupancyListPhoneComponent } from '@/components/application/occupancy/phone/occupancy-list-phone';
import { OccupancyListDesktopComponent } from '@/components/application/occupancy/occupancy-list-desktop';

export function OccupancyListComponent({ occupancyData, employeeNumber, formattedToday, error }) {
    const isMobile = useIsMobile();

    if (isMobile) {
        return <OccupancyListPhoneComponent occupancyData={occupancyData} error={error} />;
    }

    return (
        <OccupancyListDesktopComponent
            occupancyData={occupancyData}
            employeeNumber={employeeNumber}
            formattedToday={formattedToday}
            error={error}
        />
    );
}
