'use server';

import { HolidaysCardComponent } from '@/components/application/holidays/holidays-card';

export async function SubcontractorHomeComponent({ holidays, errors, refreshActions }) {
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
