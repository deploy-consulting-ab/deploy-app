import { HolidaysRequestComponent } from '@/components/application/timereport/absence/holidays-request'
import { SickRequestComponent } from '@/components/application/timereport/absence/sick-request'

const ABSENCE_COMPONENT_MAP = {
    'project-1': HolidaysRequestComponent,
    'project-2': SickRequestComponent,
    'project-3': HolidaysRequestComponent,
}

export function getAbsenceComponentForProject(projectId) {
    return ABSENCE_COMPONENT_MAP[projectId] || SickRequestComponent
}
