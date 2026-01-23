import { HolidaysRequestComponent } from '@/components/application/timereport/absence/holidays-request'
import { SickRequestComponent } from '@/components/application/timereport/absence/sick-request'

const ABSENCE_COMPONENT_MAP = {
    'holiday-absence-request': HolidaysRequestComponent,
}

export function getAbsenceComponentForAbsenceApplicationType(absenceApplicationType) {
    return ABSENCE_COMPONENT_MAP[absenceApplicationType] || SickRequestComponent
}
