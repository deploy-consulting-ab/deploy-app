import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getOpportunityStageColor } from '@/lib/utils';
import { formatDateToSwedish } from '@/lib/utils';
import { ErrorDisplayComponent } from '@/components/errors/error-display';

export async function OpportunityRecordCardComponent({ opportunity, error }) {
    if (error) {
        return <ErrorDisplayComponent error={error} />;
    }

    const { name, stage, amount, currency, accountName, closeDate, productType } = opportunity;

    return (
        <Card className="w-full transition-all hover:shadow-md border-l-4 border-l-deploy-blue">
            <CardHeader className="space-y-1 border-b">
                <div className="flex items-start justify-between">
                    <div>
                        <CardTitle className="text-2xl">{name}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-0.5">{accountName}</p>
                    </div>
                    <Badge className={`${getOpportunityStageColor(stage)} text-white`} variant="outline">
                        <span className="mr-1 text-base leading-none">•</span>
                        {stage}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-1">
                        <p className="text-muted-foreground font-semibold text-xs uppercase">Stage</p>
                        <p className="font-medium">{stage}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-muted-foreground font-semibold text-xs uppercase">Close Date</p>
                        <p className="font-medium">{formatDateToSwedish(closeDate)}</p>
                    </div>
                    {productType && (
                        <div className="space-y-1">
                            <p className="text-muted-foreground font-semibold text-xs uppercase">Product Type</p>
                            <p className="font-medium">{productType}</p>
                        </div>
                    )}
                    {amount && (
                        <div className="space-y-1">
                            <p className="text-muted-foreground font-semibold text-xs uppercase">Amount</p>
                            <p className="font-medium">{currency} {amount.toLocaleString()}</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
