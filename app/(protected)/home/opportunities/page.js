
import { OpportunitiesListComponent } from '@/components/application/opportunities/opportunities-list';
import { getOpportunities } from '@/actions/salesforce/salesforce-actions';
import { auth } from '@/auth';

const OpportunitiesPage = async () => {
    const session = await auth();
    const { user } = session;

    let opportunities = null;
    let error = null;
    try {
        opportunities = await getOpportunities();
    } catch (err) {
        error = err;
    }

    return (
        <div>
            <OpportunitiesListComponent error={error} opportunities={opportunities} />
        </div>
    );
};

export default OpportunitiesPage;
