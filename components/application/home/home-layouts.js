'use client';

import { HolidaysCardComponent } from '@/components/application/holidays/holidays-card';
import { OccupancyCardComponent } from '@/components/application/occupancy/occupancy-card';
import { UsefulLinksComponent } from '@/components/application/useful-links/useful-links-component';

export function ConsultantHomeLayout({ holidays, occupancyRates, errors, refreshActions, links }) {
    return (
        <div className="h-full grid grid-rows-[auto_1fr] gap-4 pt-4">
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                <HolidaysCardComponent
                    holidays={holidays}
                    error={errors.holidays}
                    isNavigationDisabled={false}
                    refreshAction={refreshActions.holidays}
                />
                <OccupancyCardComponent
                    occupancy={occupancyRates}
                    error={errors.occupancyRates}
                    refreshAction={refreshActions.occupancy}
                />
            </div>
            <div className="self-start">
                <UsefulLinksComponent links={links} title="Quick Access" />
            </div>
        </div>
    );
}

export function SalesHomeLayout({ holidays, errors, refreshActions, links }) {
    return (
        <div className="h-full grid grid-rows-[auto_1fr] gap-4 pt-4">
            <div className="grid gap-4 grid-cols-1">
                <HolidaysCardComponent
                    holidays={holidays}
                    error={errors.holidays}
                    isNavigationDisabled={false}
                    refreshAction={refreshActions.holidays}
                />
            </div>
            <div className="self-start">
                <UsefulLinksComponent links={links} title="Quick Access" />
            </div>
        </div>
    );
}

export function SubcontractorHomeLayout({ holidays, errors, refreshActions }) {
    return (
        <div className="h-full grid grid-rows-[auto_1fr] gap-4 pt-4">
            <div className="grid gap-4 grid-cols-1">
                <HolidaysCardComponent
                    holidays={holidays}
                    error={errors.holidays}
                    isNavigationDisabled={false}
                    refreshAction={refreshActions.holidays}
                />
            </div>
        </div>
    );
}

export function ManagementHomeLayout({ holidays, occupancyRates, errors, refreshActions, links }) {
    return (
        <div className="h-full grid grid-rows-[auto_1fr] gap-4 pt-4">
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                <HolidaysCardComponent
                    holidays={holidays}
                    error={errors.holidays}
                    isNavigationDisabled={false}
                    refreshAction={refreshActions.holidays}
                />
                <OccupancyCardComponent
                    occupancy={occupancyRates}
                    error={errors.occupancyRates}
                    refreshAction={refreshActions.occupancy}
                />
            </div>
            <div className="self-start">
                <UsefulLinksComponent links={links} title="Quick Access" />
            </div>
        </div>
    );
}

export function AdminHomeLayout({ holidays, occupancyRates, errors, refreshActions, links }) {
    // Admin sees everything plus has admin-specific quick links
    return (
        <div className="h-full grid grid-rows-[auto_1fr] gap-4 pt-4">
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                <HolidaysCardComponent
                    holidays={holidays}
                    error={errors.holidays}
                    isNavigationDisabled={false}
                    refreshAction={refreshActions.holidays}
                />
                <OccupancyCardComponent
                    occupancy={occupancyRates}
                    error={errors.occupancyRates}
                    refreshAction={refreshActions.occupancy}
                />
            </div>
            <div className="self-start">
                <UsefulLinksComponent links={links} title="Quick Access" />
            </div>
        </div>
    );
}
