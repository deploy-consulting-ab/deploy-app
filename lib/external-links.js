import { FLEX_TIMEREPORT_URL } from '@/actions/flex/constants';

export const pensionLink = {
    title: 'Pension Plans',
    description: "Check Deploy's Pension Plans and Policies",
    href: 'https://www.notion.so/deploy-consulting/Pension-Plans-Policy-71e54f641b104eeeb82915f8059c8481',
    icon: 'Wallet',
    target: '_blank',
};

export const insuranceLink = {
    title: 'Insurance Policies',
    description: "View Deploy's Insurance Policies",
    href: 'https://www.notion.so/deploy-consulting/Insurance-Policies-6b66dea29d314304b178e78a9934e79a',
    icon: 'Shield',
    target: '_blank',
};

export const wellnessLink = {
    title: 'Wellness',
    description: 'Friskvårdsbidrag Policies',
    href: 'https://www.notion.so/deploy-consulting/Policy-Wellness-Friskv-rdsbidrag-222427198fd280bfaa02ccce51f52b92',
    icon: 'Leaf',
    target: '_blank',
};

export const flexLink = {
    title: 'Flex',
    description: 'Access Flex for Time Reporting',
    href: FLEX_TIMEREPORT_URL,
    icon: 'Clock',
    target: '_blank',
};

export const flexHowToLink = {
    title: 'How to - Flex',
    description: 'How to use Flex to report your time',
    href: 'https://www.notion.so/deploy-consulting/Flex-HRM-65a47f3220b14eb6bfb6b092ed3709c5',
    icon: 'FileText',
    target: '_blank',
};

import {
    ADMIN_PROFILE,
    CONSULTANT_PROFILE,
    SALES_PROFILE,
    MANAGEMENT_PROFILE,
} from '@/lib/rba-constants';

// Profile-specific link collections
const PROFILE_LINKS = {
    [ADMIN_PROFILE]: [pensionLink, insuranceLink, wellnessLink, flexLink],
    [MANAGEMENT_PROFILE]: [pensionLink, insuranceLink, wellnessLink, flexLink],
    [CONSULTANT_PROFILE]: [pensionLink, insuranceLink, wellnessLink, flexLink],
    [SALES_PROFILE]: [pensionLink, insuranceLink, wellnessLink, flexLink],
};

export function getHomePageLinks(profileId) {
    return PROFILE_LINKS[profileId] || [pensionLink, insuranceLink, wellnessLink, flexLink];
}

export const timeReportingLinks = [flexHowToLink, flexLink];
