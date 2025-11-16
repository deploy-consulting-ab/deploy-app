'use client';

import { useIsMobile } from '@/hooks/use-mobile';
import { OpportunitiesListPhoneComponent } from '@/components/application/opportunities/phone/opportunities-list-phone';
import { OpportunitiesListDesktopComponent } from '@/components/application/opportunities/opportunities-list-desktop';

export function OpportunitiesListComponent({ opportunities, error }) {
    const isMobile = useIsMobile();

    const opportunityViews = [
        { value: 'all', label: 'All Opportunities' },
        { value: 'Qualification', label: 'Qualification' },
        { value: 'Discovery', label: 'Discovery' },
        { value: 'Engagement Scoping', label: 'Engagement Scoping' },
        { value: 'Engagement Proposal', label: 'Engagement Proposal' },
        { value: 'Negotiation', label: 'Negotiation' },
    ];

    if (isMobile) {
        return (
            <OpportunitiesListPhoneComponent
                opportunities={opportunities}
                error={error}
                opportunityViews={opportunityViews}
            />
        );
    }

    return (
        <OpportunitiesListDesktopComponent
            opportunities={opportunities}
            error={error}
            opportunityViews={opportunityViews}
        />
    );
}
