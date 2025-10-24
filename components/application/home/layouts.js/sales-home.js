'use server';

import { HolidaysCardComponent } from '@/components/application/holidays/holidays-card';
import { UsefulLinksComponent } from '@/components/application/useful-links/useful-links-component';
import { getAbsenceApplications } from '@/actions/flex/flex-actions';
import { getHomePageLinks } from '@/lib/external-links';
import { Spinner } from '@/components/ui/spinner';
import { getHomeRequiredDataForProfile } from '@/components/application/home/home-layout-selector';

export async function SalesHomeComponent({ profileId, employeeNumber }) {
    // Initialize data and errors
    let loading = true;

    const data = {
        holidays: null,
    };

    const errors = {
        holidays: null,
    };
    
    async function refreshHolidays() {
        'use server';
        try {
            return await getAbsenceApplications(employeeNumber);
        } catch (error) {
            throw new Error(error.message);
        }
    }

    const dataRequirements = getHomeRequiredDataForProfile(profileId);
    const links = getHomePageLinks(profileId);

    if (dataRequirements.holidays) {
        try {
            data.holidays = await getAbsenceApplications(employeeNumber);
        } catch (error) {
            errors.holidays = error;
        }
    }

    loading = false;

    if (loading) {
        return <Spinner />;
    }

    return (
        <div className="h-full grid grid-rows-[auto_1fr] gap-4 pt-4">
            <div className="grid gap-4 grid-cols-1">
                <HolidaysCardComponent
                    holidays={data.holidays}
                    error={errors.holidays}
                    isNavigationDisabled={false}
                    refreshAction={refreshHolidays}
                />
            </div>
            <div className="self-start">
                <UsefulLinksComponent links={links} title="Quick Access" />
            </div>
        </div>
    );
}
