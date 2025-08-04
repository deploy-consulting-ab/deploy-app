import { OpportunitiesList } from '@/components/application/opportunities-list';
import { fetchOpportunities } from '@/actions/salesforce/fetch-opportunities';

const OpportunitiesPage = async () => {
    const data = await fetchOpportunities();

    return (
        <div className="p-8">
            <OpportunitiesList data={data}/>
        </div>
    );
};

export default OpportunitiesPage;
