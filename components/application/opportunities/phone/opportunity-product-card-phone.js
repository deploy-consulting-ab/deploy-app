'use client';

import { Card, CardContent } from '@/components/ui/card';
import { formatDateToSwedish } from '@/lib/utils';

export function OpportunityProductCardPhone({ product }) {
    return (
        <Card className="bg-muted/50 shadow-none">
            <CardContent className="pt-4">
                <p className="font-semibold text-sm">{product.productName}</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2">
                    <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">
                            Start Date
                        </p>
                        <p className="font-medium text-sm">
                            {product.startDate ? formatDateToSwedish(product.startDate) : '-'}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">
                            End Date
                        </p>
                        <p className="font-medium text-sm">
                            {product.endDate ? formatDateToSwedish(product.endDate) : '-'}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
