import { getEmployeeProfitabilityData } from '@/actions/salesforce/salesforce-actions';
import { EmployeeProfitabilityTableComponent } from '@/components/application/management/employee-profitability/employee-profitability-table';

export default async function EmployeeProfitabilityPage() {
    let employees = [];
    let error = null;

    try {
        employees = await getEmployeeProfitabilityData();
    } catch (err) {
        error = err?.message ?? 'Failed to load profitability data.';
    }

    return (
        <div className="space-y-4">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Employee Profitability</h1>
                <p className="text-muted-foreground text-sm mt-1">
                    FY assignment-level invoiced amounts vs. adjusted employee costs.
                </p>
            </div>
            <EmployeeProfitabilityTableComponent employees={employees} error={error} />
        </div>
    );
}
