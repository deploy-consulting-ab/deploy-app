'use server';

import { HolidaysCardComponent } from '@/components/application/holidays/holidays-card';
import { UsefulLinksComponent } from '@/components/application/useful-links/useful-links-component';

export async function SalesHomeComponent({ holidays, errors, refreshActions, links }) {
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
