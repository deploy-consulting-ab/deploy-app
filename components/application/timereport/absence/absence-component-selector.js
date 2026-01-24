import { HolidaysRequestComponent } from '@/components/application/timereport/absence/holidays-request'
import { HolidaysRequestedListComponent } from '@/components/application/timereport/absence/holidays-requested-list'
import { SickRequestComponent } from '@/components/application/timereport/absence/sick-request'

const ABSENCE_COMPONENT_MAP = {
    'holiday-absence-request': HolidaysRequestComponent,
}

const ABSENCE_REQUESTED_LIST_COMPONENT_MAP = {
    'holiday-absence-request': HolidaysRequestedListComponent,
}

export function getAbsenceComponentForAbsenceApplicationType(absenceApplicationType) {
    return ABSENCE_COMPONENT_MAP[absenceApplicationType] || SickRequestComponent
}

export function getAbsenceRequestedListComponentForAbsenceApplicationType(absenceApplicationType) {
    return ABSENCE_REQUESTED_LIST_COMPONENT_MAP[absenceApplicationType] || null
}
