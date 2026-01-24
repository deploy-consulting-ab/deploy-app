import { HolidaysRequestComponent } from '@/components/application/timereport/absence/holidays-request';
import { HolidaysRequestedListComponent } from '@/components/application/timereport/absence/holidays-requested-list';
import { SickRequestComponent } from '@/components/application/timereport/absence/sick-request';
import { ABSENCE_APPLICATION_TYPE_ID_HOLIDAY_ABSENCE_REQUEST } from '@/actions/flex/constants';

const ABSENCE_COMPONENT_MAP = {
    [ABSENCE_APPLICATION_TYPE_ID_HOLIDAY_ABSENCE_REQUEST]: HolidaysRequestComponent,
};

const ABSENCE_REQUESTED_LIST_COMPONENT_MAP = {
    [ABSENCE_APPLICATION_TYPE_ID_HOLIDAY_ABSENCE_REQUEST]: HolidaysRequestedListComponent,
};

export function getAbsenceComponentForAbsenceApplicationType(absenceApplicationType) {
    return ABSENCE_COMPONENT_MAP[absenceApplicationType] || SickRequestComponent;
}

export function getAbsenceRequestedListComponentForAbsenceApplicationType(absenceApplicationType) {
    return ABSENCE_REQUESTED_LIST_COMPONENT_MAP[absenceApplicationType] || null;
}
