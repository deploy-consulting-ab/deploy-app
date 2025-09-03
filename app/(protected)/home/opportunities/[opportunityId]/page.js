import { OpportunityCardComponent } from '@/components/application/opportunities/opportunity-card';
import { getOpportunityById } from '@/actions/salesforce/salesforce-actions';

const OpportunityPage = async ({ params }) => {
    const { opportunityId } = await params;

    let opportunity = null;
    let error = null;

    try {
        opportunity = await getOpportunityById(opportunityId);
    } catch (err) {
        console.log('#error', err);
        error = err;
    }

    return (
        <div className="py-4">
            <OpportunityCardComponent error={error} opportunity={opportunity} />
        </div>
    );
};

export default OpportunityPage;
