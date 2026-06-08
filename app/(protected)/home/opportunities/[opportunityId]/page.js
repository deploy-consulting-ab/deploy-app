import { OpportunityRecordCardComponent } from '@/components/application/opportunities/opportunity-record-card';
import { getOpportunityById, getQuoteLines } from '@/actions/salesforce/salesforce-actions';
import { auth } from '@/auth';

const OpportunityPage = async ({ params }) => {
    const { opportunityId } = await params;

    const session = await auth();
    const { user } = session;

    let opportunity = null;
    let error = null;
    let quoteLines = null;

    try {
        [opportunity, quoteLines] = await Promise.all([
            getOpportunityById(opportunityId),
            getQuoteLines(opportunityId),
        ]);
    } catch (err) {
        error = err;
    }

    return (
        <div>
            <OpportunityRecordCardComponent
                error={error}
                opportunity={opportunity}
                products={quoteLines}
            />
        </div>
    );
};

export default OpportunityPage;
