'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { formatDateToSwedish } from '@/lib/utils';

export function OpportunityCardPhoneComponent({ opportunity, onClick }) {
    const getStageColor = (stage) => {
        switch (stage.toLowerCase()) {
            case 'closed won':
                return 'bg-green-500';
            case 'closed lost':
                return 'bg-red-500';
            case 'proposal/price quote':
                return 'bg-yellow-500';
            case 'negotiation/review':
                return 'bg-purple-500';
            case 'qualification':
                return 'bg-blue-500';
            case 'needs analysis':
                return 'bg-orange-500';
            default:
                return 'bg-gray-500';
        }
    };

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
                    <CardTitle className="text-lg font-semibold">
                        {opportunity.name}
                    </CardTitle>
                    <Badge className={`${getStageColor(opportunity.stage)} text-white ml-2`}>
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
                                {opportunity.closeDate ? formatDateToSwedish(opportunity.closeDate) : '-'}
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
