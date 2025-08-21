'use server';

import { OpportunitiesListComponent } from '@/components/application/opportunities/opportunities-list';
import { getOpportunities } from '@/actions/salesforce/salesforce-actions';

const OpportunitiesPage = async () => {
    let opportunities = null;
    let error = null;
    try {
        opportunities = await getOpportunities();
    } catch (err) {
        error = err;
    }

    return (
        <div className="py-4">
            <OpportunitiesListComponent error={error} opportunities={opportunities} />
        </div>
    );
};

export default OpportunitiesPage;
