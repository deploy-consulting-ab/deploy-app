'use client';

import { useIsMobile } from '@/hooks/use-mobile';
import { OpportunityProductsDatatable } from '@/components/application/opportunities/opportunity-products-datatable';
import { OpportunityProductCardPhone } from '@/components/application/opportunities/phone/opportunity-product-card-phone';

export function OpportunityProductsView({ products }) {
    const isMobile = useIsMobile();

    if (!products || products.length === 0) {
        return null;
    }

    if (isMobile) {
        return (
            <div className="space-y-2">
                {products.map((product) => (
                    <OpportunityProductCardPhone key={product.id} product={product} />
                ))}
            </div>
        );
    }

    return <OpportunityProductsDatatable products={products} />;
}
