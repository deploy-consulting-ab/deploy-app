import { OpportunityCardComponent } from '@/components/application/opportunities/opportunity-card';
import { getOpportunityById } from '@/actions/salesforce/salesforce-actions';

const OpportunityPage = async ({ params }) => {
    const { opportunityId } = await params;

    let opportunity = null;
    let error = null;

    try {
        opportunity = await getOpportunityById(opportunityId);
    } catch (err) {
        error = err;
    }

    return (
        <div>
            <OpportunityCardComponent error={error} opportunity={opportunity} />
        </div>
    );
};

export default OpportunityPage;
