import { HolidaysRequest } from '@/components/application/timereport/absence/absence-components';

const ABSENCE_COMPONENT_MAP = {
    'project-1': HolidaysRequest,
    'project-2': <div>Project 2 layout</div>,
    'project-3': <div>Project 3 layout</div>,
    default: <div>Default absence layout</div>,
};

export function getAbsenceComponentForProject(projectId) {
    return ABSENCE_COMPONENT_MAP[projectId] || <div>Default absence layout</div>;
}