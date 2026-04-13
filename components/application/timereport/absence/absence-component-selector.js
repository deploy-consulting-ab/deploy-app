import { HolidaysRequestComponent } from '@/components/application/timereport/absence/holidays-request';
import { HolidaysRequestedListComponent } from '@/components/application/timereport/absence/holidays-requested-list';
import { SickRequestComponent } from '@/components/application/timereport/absence/sick-request';
import { HOLIDAY_TYPE_ID } from '@/actions/flex/constants';

const ABSENCE_COMPONENT_MAP = {
    [HOLIDAY_TYPE_ID]: HolidaysRequestComponent,
};

const ABSENCE_REQUESTED_LIST_COMPONENT_MAP = {
    [HOLIDAY_TYPE_ID]: HolidaysRequestedListComponent,
};

export function getAbsenceComponentForAbsenceApplicationType(absenceApplicationType) {
    return ABSENCE_COMPONENT_MAP[absenceApplicationType] || SickRequestComponent;
}

export function getAbsenceRequestedListComponentForAbsenceApplicationType(absenceApplicationType) {
    return ABSENCE_REQUESTED_LIST_COMPONENT_MAP[absenceApplicationType] || null;
}
