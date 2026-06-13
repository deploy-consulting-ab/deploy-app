import { HolidaysRequestComponent } from '@/components/application/timereport/absence/holidays-request';
import { HolidaysRequestedListComponent } from '@/components/application/timereport/absence/holidays-requested-list';
import { SickRequestedListComponent } from '@/components/application/timereport/absence/sick-requested-list';
import { SickRequestComponent } from '@/components/application/timereport/absence/sick-request';
import { Parental10DaysRequestComponent } from '@/components/application/timereport/absence/parental-10-days-request';
import { Parental10DaysRequestedListComponent } from '@/components/application/timereport/absence/parental-10-days-requested-list';
import { ParentalDaysRequestComponent } from '@/components/application/timereport/absence/parental-days-request';
import { ParentalDaysRequestedListComponent } from '@/components/application/timereport/absence/parental-days-requested-list';
import {
    HOLIDAY_TYPE_ID,
    SICK_LEAVE_TYPE_ID,
    PARENTAL_LEAVE_10_DAYS_TYPE_ID,
    PARENTAL_LEAVE_TYPE_ID,
} from '@/actions/flex/constants';

const ABSENCE_COMPONENT_MAP = {
    [HOLIDAY_TYPE_ID]: HolidaysRequestComponent,
    [SICK_LEAVE_TYPE_ID]: SickRequestComponent,
    [PARENTAL_LEAVE_10_DAYS_TYPE_ID]: Parental10DaysRequestComponent,
    [PARENTAL_LEAVE_TYPE_ID]: ParentalDaysRequestComponent,
};

const ABSENCE_REQUESTED_LIST_COMPONENT_MAP = {
    [HOLIDAY_TYPE_ID]: HolidaysRequestedListComponent,
    [SICK_LEAVE_TYPE_ID]: SickRequestedListComponent,
    [PARENTAL_LEAVE_10_DAYS_TYPE_ID]: Parental10DaysRequestedListComponent,
    [PARENTAL_LEAVE_TYPE_ID]: ParentalDaysRequestedListComponent,
};

export function getAbsenceComponentForAbsenceApplicationType(absenceApplicationType) {
    return ABSENCE_COMPONENT_MAP[absenceApplicationType] || null;
}

export function getAbsenceRequestedListComponentForAbsenceApplicationType(absenceApplicationType) {
    return ABSENCE_REQUESTED_LIST_COMPONENT_MAP[absenceApplicationType] || null;
}
