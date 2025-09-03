'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { formatDateToSwedish, getOpportunityStageColor } from '@/lib/utils';

export function OpportunityCardPhoneComponent({ opportunity, onClick }) {
    const formatAmount = (amount, currency) => {
        if (!amount) return '-';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
        }).format(amount);
    };

    return (
        <Card
            className="w-full mb-4 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => onClick?.(opportunity.id)}
        >
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-semibold">{opportunity.name}</CardTitle>
                    <Badge
                        className={`${getOpportunityStageColor(opportunity.stage)} text-white ml-2`}
                    >
                        {opportunity.stage}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <div>
                        <p className="text-sm text-gray-500">Account</p>
                        <p className="font-medium">{opportunity.accountName}</p>
                    </div>
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm text-gray-500">Close Date</p>
                            <p className="font-medium">
                                {opportunity.closeDate
                                    ? formatDateToSwedish(opportunity.closeDate)
                                    : '-'}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-500">Amount</p>
                            <p className="font-medium">
                                {formatAmount(opportunity.amount, opportunity.currency)}
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
