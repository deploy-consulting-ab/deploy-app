import {
    ConsultantHomeLayout,
    SalesHomeLayout,
    ManagementHomeLayout,
    AdminHomeLayout,
    SubcontractorHomeLayout,
} from '@/components/application/home/home-layouts';

import {
    ADMIN_PROFILE,
    CONSULTANT_PROFILE,
    SALES_PROFILE,
    MANAGEMENT_PROFILE,
    SUBCONTRACTOR_PROFILE,
} from '@/lib/rba-constants';

const HOME_LAYOUT_MAP = {
    [ADMIN_PROFILE]: AdminHomeLayout,
    [MANAGEMENT_PROFILE]: ManagementHomeLayout,
    [CONSULTANT_PROFILE]: ConsultantHomeLayout,
    [SALES_PROFILE]: SalesHomeLayout,
    [SUBCONTRACTOR_PROFILE]: SubcontractorHomeLayout,
};

export function getHomeLayoutForProfile(profileId) {
    return HOME_LAYOUT_MAP[profileId] || ConsultantHomeLayout; // Default to consultant layout
}

export function getHomeRequiredDataForProfile(profileId) {
    const dataRequirements = {}; // Add data requirements shared by all profiles

    switch (profileId) {
        case ADMIN_PROFILE:
            return {
                ...dataRequirements,
                occupancyRates: true,
                holidays: true,
                assignmentsMetrics: true,
            };
        case MANAGEMENT_PROFILE:
            return {
                ...dataRequirements,
                occupancyRates: true,
                holidays: true,
                assignmentsMetrics: false,
            };
        case CONSULTANT_PROFILE:
            return {
                ...dataRequirements,
                occupancyRates: true,
                holidays: true,
                assignmentsMetrics: false,
            };
        case SALES_PROFILE:
            return {
                ...dataRequirements,
                occupancyRates: false,
                holidays: true,
                assignmentsMetrics: false,
            };
        case SUBCONTRACTOR_PROFILE:
            return {
                ...dataRequirements,
                occupancyRates: false,
                holidays: false,
                assignmentsMetrics: false,
            };
        default:
            return dataRequirements;
    }
}
