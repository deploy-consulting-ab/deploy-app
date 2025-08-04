import { OpportunitiesListComponent } from '@/components/application/opportunities-list';
import { OpportunitiesListEnhancedComponent } from '@/components/application/opportunities-list-enhanced';
import { fetchOpportunities } from '@/actions/salesforce/fetch-opportunities';

const OpportunitiesPage = async () => {
    const data = await fetchOpportunities();

    return (
        <div className="p-8">
            {/* <OpportunitiesListComponent data={data}/> */}
            <OpportunitiesListEnhancedComponent data={data}/>
        </div>
    );
};

export default OpportunitiesPage;
