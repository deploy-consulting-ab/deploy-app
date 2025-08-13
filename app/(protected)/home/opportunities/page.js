import { OpportunitiesListComponent } from '@/components/application/opportunities-list';
import { fetchOpportunities } from '@/actions/salesforce/fetch-opportunities';

const OpportunitiesPage = async () => {
    const data = await fetchOpportunities();

    return (
        <div className="py-4">
            <OpportunitiesListComponent data={data}/>
        </div>
    );
};

export default OpportunitiesPage;
