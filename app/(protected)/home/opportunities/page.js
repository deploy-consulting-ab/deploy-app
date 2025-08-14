'use server';

import { OpportunitiesListComponent } from '@/components/application/opportunities/opportunities-list';
import { getOpportunities } from '@/actions/salesforce/salesforce-actions';

const OpportunitiesPage = async () => {
    const opportunities = await getOpportunities();

    console.log('opportunities...', opportunities);

    return (
        <div className="py-4">
            <OpportunitiesListComponent opportunities={opportunities}/>
        </div>
    );
};

export default OpportunitiesPage;
