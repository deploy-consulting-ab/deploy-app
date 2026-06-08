import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDateToSwedish, formatCurrency } from '@/lib/utils';
import { ErrorDisplayComponent } from '@/components/errors/error-display';
import { EmployeeRecordMetrics } from '@/components/application/management/employees/employee-record-metrics';

function formatMetricCurrency(value, currency = 'SEK') {
    return value != null ? formatCurrency(value, currency) : null;
}

export async function EmployeeRecordCardComponent({ employee, fyAmounts, error }) {
    if (error) {
        return <ErrorDisplayComponent error={error} />;
    }

    const {
        name,
        isActive,
        employeeId,
        employmentType,
        employmentStartDate,
        employmentEndDate,
        adjustedCostFY,
        adjustedCostFYTD,
    } = employee;

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
                <div className="flex items-start justify-between">
                    <div>
                        <CardTitle className="text-2xl">{name}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-0.5">{employeeId}</p>
                    </div>
                    <Badge
                        className={
                            isActive
                                ? 'bg-green-100 text-green-700 border-green-200 hover:bg-green-100'
                                : 'bg-red-100 text-red-700 border-red-200 hover:bg-red-100'
                        }
                        variant="outline"
                    >
                        <span className="uppercase">
                            {isActive ? 'Active' : 'Inactive'}
                        </span>
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <EmployeeRecordMetrics
                    employmentType={employmentType}
                    employmentStartDate={formatDateToSwedish(employmentStartDate)}
                    employmentEndDate={
                        employmentEndDate ? formatDateToSwedish(employmentEndDate) : null
                    }
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
