import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getOpportunityStageColor } from '@/lib/utils';
import { Briefcase, Info, DollarSign, Building2, CalendarDays, Tag } from 'lucide-react';
import { formatDateToSwedish } from '@/lib/utils';
import { ErrorDisplayComponent } from '@/components/errors/error-display';

export async function OpportunityRecordCardComponent({ opportunity, error }) {
    if (error) {
        return <ErrorDisplayComponent error={error} />;
    }

    const { name, stage, amount, currency, accountName, closeDate, productType } = opportunity;

    return (
        <Card className="w-full transition-all hover:shadow-md">
            <CardHeader className="space-y-1 border-b">
                <div className="flex items-start justify-between">
                    <CardTitle className="text-2xl">{name}</CardTitle>
                    <Badge className={`${getOpportunityStageColor(stage)} text-white`}>
                        {stage}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="flex items-center space-x-2">
                        <Info className="h-4 w-4 text-muted-foreground" />
                        <div className="space-y-1">
                            <p className="text-muted-foreground font-semibold text-xs uppercase">Opportunity Name</p>
                            <p className="font-medium">{name}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <div className="space-y-1">
                            <p className="text-muted-foreground font-semibold text-xs uppercase">Account Name</p>
                            <p className="font-medium">{accountName}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                        <div className="space-y-1">
                            <p className="text-muted-foreground font-semibold text-xs uppercase">Stage</p>
                            <p className="font-medium">{stage}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <CalendarDays className="h-4 w-4 text-muted-foreground" />
                        <div className="space-y-1">
                            <p className="text-muted-foreground font-semibold text-xs uppercase">Close Date</p>
                            <p className="font-medium">{formatDateToSwedish(closeDate)}</p>
                        </div>
                    </div>
                    {productType && (
                        <div className="flex items-center space-x-2">
                            <Tag className="h-4 w-4 text-muted-foreground" />
                            <div className="space-y-1">
                                <p className="text-muted-foreground font-semibold text-xs uppercase">Product Type</p>
                                <p className="font-medium">{productType}</p>
                            </div>
                        </div>
                    )}
                    {amount && (
                        <div className="flex items-center space-x-2">
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                            <div className="space-y-1">
                                <p className="text-muted-foreground font-semibold text-xs uppercase">Amount</p>
                                <p className="font-medium">
                                    {currency} {amount.toLocaleString()}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
