import { ConsultantLayout, SalesLayout, ManagementLayout, AdminLayout } from './home-layouts';

import {
    ADMIN_PROFILE,
    CONSULTANT_PROFILE,
    SALES_PROFILE,
    MANAGEMENT_PROFILE,
} from '@/lib/permissions';

const LAYOUT_MAP = {
    [ADMIN_PROFILE]: AdminLayout,
    [MANAGEMENT_PROFILE]: ManagementLayout,
    [CONSULTANT_PROFILE]: ConsultantLayout,
    [SALES_PROFILE]: SalesLayout,
};

export function getLayoutForProfile(profileId) {
    return LAYOUT_MAP[profileId] || ConsultantLayout; // Default to consultant layout
}

export function getRequiredDataForProfile(profileId) {
    const dataRequirements = {
        holidays: true, // All profiles see holidays
    };

    switch (profileId) {
        case ADMIN_PROFILE:
            return {
                ...dataRequirements,
                occupancyRates: true,
                holidays: true,
            };
        case MANAGEMENT_PROFILE:
            return {
                ...dataRequirements,
                occupancyRates: true,
                holidays: true,
            };
        case CONSULTANT_PROFILE:
            return {
                ...dataRequirements,
                occupancyRates: true,
                holidays: true,
            };
        case SALES_PROFILE:
            return {
                ...dataRequirements,
                occupancyRates: false,
                holidays: true,
            };
        default:
            return dataRequirements;
    }
}
