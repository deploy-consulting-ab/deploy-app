import { HolidaysRequestComponent } from '@/components/application/timereport/absence/holidays-request';
import { HolidaysRequestedListComponent } from '@/components/application/timereport/absence/holidays-requested-list';
import { SickRequestedListComponent } from '@/components/application/timereport/absence/sick-requested-list';
import { SickRequestComponent } from '@/components/application/timereport/absence/sick-request';
import { HOLIDAY_TYPE_ID, SICK_LEAVE_TYPE_ID } from '@/actions/flex/constants';

const ABSENCE_COMPONENT_MAP = {
    [HOLIDAY_TYPE_ID]: HolidaysRequestComponent,
    [SICK_LEAVE_TYPE_ID]: SickRequestComponent,
};

const ABSENCE_REQUESTED_LIST_COMPONENT_MAP = {
    [HOLIDAY_TYPE_ID]: HolidaysRequestedListComponent,
    [SICK_LEAVE_TYPE_ID]: SickRequestedListComponent,
};

export function getAbsenceComponentForAbsenceApplicationType(absenceApplicationType) {
    return ABSENCE_COMPONENT_MAP[absenceApplicationType] || null;
}

export function getAbsenceRequestedListComponentForAbsenceApplicationType(absenceApplicationType) {
    return ABSENCE_REQUESTED_LIST_COMPONENT_MAP[absenceApplicationType] || null;
}
