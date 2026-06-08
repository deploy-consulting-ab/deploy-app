import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { ErrorDisplayComponent } from '@/components/errors/error-display';
import { EmployeeFinancialMetrics } from '@/components/application/management/employees/employee-financial-metrics';

function formatMetricCurrency(value, currency = 'SEK') {
    return value != null ? formatCurrency(value, currency) : null;
}

export async function EmployeeFinancialCardComponent({ employee, fyAmounts, error }) {
    if (error) {
        return <ErrorDisplayComponent error={error} />;
    }

    const { adjustedCostFY, adjustedCostFYTD } = employee;
    const currency = 'SEK';
    const projectedAmountFY = fyAmounts?.projectedAmountFY ?? null;
    const actualAmount = fyAmounts?.actualAmount ?? null;

    const projectedProfitabilityFY =
        projectedAmountFY != null && adjustedCostFY != null
            ? projectedAmountFY - adjustedCostFY
            : null;
    const profitabilityFY =
        actualAmount != null && adjustedCostFY != null ? actualAmount - adjustedCostFY : null;
    const profitabilityFYTD =
        actualAmount != null && adjustedCostFYTD != null
            ? actualAmount - adjustedCostFYTD
            : null;

    return (
        <Card className="w-full transition-all hover:shadow-md border-l-4 border-l-deploy-blue">
            <CardHeader className="space-y-1 border-b">
                <CardTitle className="text-base">Financial Overview</CardTitle>
            </CardHeader>
            <CardContent>
                <EmployeeFinancialMetrics
                    adjustedCostFY={formatMetricCurrency(adjustedCostFY, currency)}
                    adjustedCostFYTD={formatMetricCurrency(adjustedCostFYTD, currency)}
                    projectedInvoicedAmountFY={formatMetricCurrency(projectedAmountFY, currency)}
                    invoicedAmount={formatMetricCurrency(actualAmount, currency)}
                    projectedProfitabilityFY={formatMetricCurrency(
                        projectedProfitabilityFY,
                        currency
                    )}
                    profitabilityFY={formatMetricCurrency(profitabilityFY, currency)}
                    profitabilityFYTD={formatMetricCurrency(profitabilityFYTD, currency)}
                />
            </CardContent>
        </Card>
    );
}
