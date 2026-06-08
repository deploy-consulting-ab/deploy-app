'use client';

import { useMemo, useState } from 'react';
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { formatCurrency } from '@/lib/utils';
import { ErrorDisplayComponent } from '@/components/errors/error-display';
import { NoDataComponent } from '@/components/errors/no-data';
import { RefreshCw, ChevronDown, ChevronRight, TrendingUp, TrendingDown } from 'lucide-react';
import { getEmployeeProfitabilityData } from '@/actions/salesforce/salesforce-actions';

const SEK = 'SEK';
const fmt = (v) => formatCurrency(v, SEK);

function ProfitBadge({ value, label = 'FYTD' }) {
    if (value === null || value === undefined) return null;
    const positive = value >= 0;
    return (
        <span
            className={`inline-flex flex-col items-end gap-0.5 text-sm font-semibold px-2.5 py-1 rounded-lg tabular-nums whitespace-nowrap ${
                positive
                    ? 'bg-deploy-blue/10 text-deploy-blue dark:bg-deploy-blue/20 dark:text-deploy-ocean'
                    : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
            }`}
        >
            <span className="text-[10px] font-semibold uppercase tracking-wider opacity-80">
                {label}
            </span>
            <span className="inline-flex items-center gap-1.5">
                {positive ? (
                    <TrendingUp className="h-4 w-4 shrink-0" />
                ) : (
                    <TrendingDown className="h-4 w-4 shrink-0" />
                )}
                {fmt(value)}
            </span>
        </span>
    );
}

function MetricBar({ label, value, maxValue, colorClass }) {
    const pct = maxValue > 0 ? Math.min((Math.abs(value) / maxValue) * 100, 100) : 0;
    return (
        <div className="space-y-1">
            <div className="flex justify-between items-center gap-2">
                <span className="text-sm text-muted-foreground truncate">{label}</span>
                <span className="text-sm font-medium tabular-nums shrink-0">{fmt(value)}</span>
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${colorClass}`} style={{ width: `${pct}%` }} />
            </div>
        </div>
    );
}

const PROJECT_COLUMNS = [
    {
        accessorKey: 'projectName',
        header: 'Project',
        size: 300,
        minSize: 120,
        maxSize: 500,
        cell: ({ row, getValue }) => (
            <span
                className={`block truncate ${
                    row.original.isSubtotal
                        ? 'text-xs font-semibold uppercase tracking-wider text-foreground/80'
                        : 'text-sm text-foreground/80'
                }`}
                title={getValue()}
            >
                {getValue()}
            </span>
        ),
    },
    {
        accessorKey: 'projectedAmountFY',
        header: 'Proj. Invoiced FY',
        size: 150,
        minSize: 110,
        maxSize: 280,
        cell: ({ row, getValue }) => (
            <span
                className={`block text-right tabular-nums ${
                    row.original.isSubtotal
                        ? 'text-sm font-semibold'
                        : 'text-sm text-foreground/80'
                }`}
            >
                {fmt(getValue())}
            </span>
        ),
    },
    {
        accessorKey: 'timecardAmount',
        header: 'Invoiced',
        size: 130,
        minSize: 100,
        maxSize: 240,
        cell: ({ row, getValue }) => (
            <span
                className={`block text-right tabular-nums ${
                    row.original.isSubtotal
                        ? 'text-sm font-semibold'
                        : 'text-sm text-foreground/80'
                }`}
            >
                {fmt(getValue())}
            </span>
        ),
    },
];

function ProjectBreakdownTable({ assignments, totalProjected, totalInvoiced }) {
    const [columnSizing, setColumnSizing] = useState({});

    const data = useMemo(() => {
        const rows = assignments.map((asgn, i) => ({
            id: `project-${i}`,
            projectName: asgn.projectName,
            projectedAmountFY: asgn.projectedAmountFY,
            timecardAmount: asgn.timecardAmount,
            isSubtotal: false,
        }));

        rows.push({
            id: 'subtotal',
            projectName: 'Subtotal',
            projectedAmountFY: totalProjected,
            timecardAmount: totalInvoiced,
            isSubtotal: true,
        });

        return rows;
    }, [assignments, totalProjected, totalInvoiced]);

    const table = useReactTable({
        data,
        columns: PROJECT_COLUMNS,
        getCoreRowModel: getCoreRowModel(),
        enableColumnResizing: true,
        columnResizeMode: 'onChange',
        state: { columnSizing },
        onColumnSizingChange: setColumnSizing,
    });

    return (
        <div className="mt-2 rounded-lg border border-border/40 overflow-hidden">
            <div className="overflow-x-auto">
                <table
                    className="caption-bottom text-sm border-separate border-spacing-0 table-fixed"
                    style={{ width: table.getCenterTotalSize() }}
                >
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="hover:bg-transparent bg-muted/30">
                                {headerGroup.headers.map((header) => (
                                    <TableHead
                                        key={header.id}
                                        className="relative text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                                        style={{ width: header.getSize() }}
                                    >
                                        {header.isPlaceholder ? null : (
                                            <>
                                                <span
                                                    className={
                                                        header.column.id === 'projectName'
                                                            ? 'block truncate pr-3'
                                                            : 'block text-right truncate pr-3'
                                                    }
                                                >
                                                    {flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                                </span>
                                                <div
                                                    role="separator"
                                                    aria-orientation="vertical"
                                                    onMouseDown={header.getResizeHandler()}
                                                    onTouchStart={header.getResizeHandler()}
                                                    onDoubleClick={() => header.column.resetSize()}
                                                    className={`absolute right-0 top-0 z-10 h-full w-3 -mr-1.5 cursor-col-resize select-none touch-none flex items-center justify-center ${
                                                        header.column.getIsResizing()
                                                            ? 'bg-primary/20'
                                                            : ''
                                                    }`}
                                                >
                                                    <div
                                                        className={`h-full w-0.5 rounded-full transition-opacity ${
                                                            header.column.getIsResizing()
                                                                ? 'bg-primary opacity-100'
                                                                : 'bg-border opacity-60 hover:opacity-100'
                                                        }`}
                                                    />
                                                </div>
                                            </>
                                        )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                className={
                                    row.original.isSubtotal
                                        ? 'bg-muted/40 hover:bg-muted/50 border-t border-border/50'
                                        : 'hover:bg-muted/20'
                                }
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell
                                        key={cell.id}
                                        style={{ width: cell.column.getSize() }}
                                    >
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </table>
            </div>
        </div>
    );
}

function ProfitMetric({ label, value }) {
    const positive = value >= 0;
    return (
        <div className="flex flex-col gap-0.5 min-w-0">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground leading-tight truncate">
                {label}
            </span>
            <span
                className={`text-sm font-semibold tabular-nums ${
                    positive
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-red-500 dark:text-red-400'
                }`}
            >
                {fmt(value)}
            </span>
        </div>
    );
}

function EmployeeCard({ employee }) {
    const [expanded, setExpanded] = useState(false);
    const { employeeId, employeeName, adjustedCostFY, adjustedCostFYTD, assignments } = employee;

    const totalProjected = assignments.reduce((s, a) => s + a.projectedAmountFY, 0);
    const totalInvoiced = assignments.reduce((s, a) => s + a.timecardAmount, 0);

    const projProfitFY = totalProjected - adjustedCostFY;
    const profitFY = totalInvoiced - adjustedCostFY;
    const profitFYTD = totalInvoiced - adjustedCostFYTD;

    const maxBar = Math.max(totalProjected, totalInvoiced, adjustedCostFY, 1);
    const isProfitableFYTD = profitFYTD >= 0;

    return (
        <Card
            className={`relative overflow-hidden transition-all hover:shadow-md border-l-4 ${
                isProfitableFYTD ? 'border-l-deploy-blue' : 'border-l-deploy-accent-orange'
            }`}
        >
            <CardHeader className="pb-2 pt-4 px-4">
                <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-base leading-snug">{employeeName}</h3>
                    <ProfitBadge value={profitFYTD} />
                </div>
            </CardHeader>

            <CardContent className="px-4 pb-4 space-y-4">
                {/* Visual bars: invoiced amounts vs cost */}
                <div className="space-y-2">
                    <MetricBar
                        label="Projected Invoiced FY"
                        value={totalProjected}
                        maxValue={maxBar}
                        colorClass="bg-deploy-blue"
                    />
                    <MetricBar
                        label="Invoiced Amount"
                        value={totalInvoiced}
                        maxValue={maxBar}
                        colorClass="bg-deploy-teal"
                    />
                    <MetricBar
                        label="Adjusted Cost FY"
                        value={adjustedCostFY}
                        maxValue={maxBar}
                        colorClass="bg-deploy-accent-orange"
                    />
                </div>

                {/* Profitability computed metrics */}
                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border/50">
                    <ProfitMetric label="Proj. Prof. FY" value={projProfitFY} />
                    <ProfitMetric label="Profit FY" value={profitFY} />
                    <ProfitMetric label="Profit FYTD" value={profitFYTD} />
                </div>

                {/* Expandable project list */}
                {assignments.length > 0 && (
                    <div className="pt-1">
                        <button
                            type="button"
                            onClick={() => setExpanded((v) => !v)}
                            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors w-full"
                        >
                            {expanded ? (
                                <ChevronDown className="h-4 w-4 shrink-0" />
                            ) : (
                                <ChevronRight className="h-4 w-4 shrink-0" />
                            )}
                            <span>
                                {assignments.length} project{assignments.length !== 1 ? 's' : ''}
                            </span>
                        </button>

                        {expanded && (
                            <ProjectBreakdownTable
                                assignments={assignments}
                                totalProjected={totalProjected}
                                totalInvoiced={totalInvoiced}
                            />
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

function SummaryStrip({ employees }) {
    const total = employees.length;
    const profitable = employees.filter((e) => {
        const inv = e.assignments.reduce((s, a) => s + a.timecardAmount, 0);
        return inv - e.adjustedCostFYTD >= 0;
    }).length;

    const totals = employees.reduce(
        (acc, e) => {
            const inv = e.assignments.reduce((s, a) => s + a.timecardAmount, 0);
            acc.invoiced += inv;
            acc.cost += e.adjustedCostFY;
            return acc;
        },
        { invoiced: 0, cost: 0 }
    );
    const totalProfitFY = totals.invoiced - totals.cost;

    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            {[
                { label: 'Employees', value: total, isCount: true },
                { label: 'Profitable', value: profitable, isCount: true, positive: true },
                { label: 'Unprofitable', value: total - profitable, isCount: true, negative: true },
                { label: 'Total Profit FY', value: fmt(totalProfitFY), profit: totalProfitFY },
            ].map((item) => (
                <div
                    key={item.label}
                    className="rounded-xl border border-border/30 bg-card px-4 py-3 shadow-sm"
                >
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                        {item.label}
                    </p>
                    <p
                        className={`text-xl font-bold tabular-nums ${
                            item.profit !== undefined
                                ? item.profit >= 0
                                    ? 'text-emerald-600 dark:text-emerald-400'
                                    : 'text-red-500 dark:text-red-400'
                                : item.positive
                                  ? 'text-emerald-600 dark:text-emerald-400'
                                  : item.negative
                                    ? 'text-red-500 dark:text-red-400'
                                    : 'text-foreground'
                        }`}
                    >
                        {item.isCount ? item.value : item.value}
                    </p>
                </div>
            ))}
        </div>
    );
}

export function EmployeeProfitabilityTableComponent({
    employees: initialEmployees,
    error: initialError,
}) {
    const [employees, setEmployees] = useState(initialEmployees ?? []);
    const [error, setError] = useState(initialError ?? null);
    const [search, setSearch] = useState('');
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = async () => {
        if (isRefreshing) return;
        setIsRefreshing(true);
        try {
            const fresh = await getEmployeeProfitabilityData();
            setEmployees(fresh);
            setError(null);
        } catch (err) {
            setError(err?.message ?? 'Failed to load profitability data.');
        } finally {
            setIsRefreshing(false);
        }
    };

    const filtered = useMemo(() => {
        if (!search.trim()) return employees;
        const q = search.toLowerCase();
        return employees.filter((e) => e.employeeName.toLowerCase().includes(q));
    }, [employees, search]);

    if (error) return <ErrorDisplayComponent error={error} />;

    return (
        <>
            <SummaryStrip employees={filtered} />

            <div className="flex items-center justify-between mb-4">
                <Input
                    placeholder="Filter by employee name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="max-w-sm bg-card border-border/50 focus-visible:ring-0 focus-visible:border-border transition-[border-color] duration-300 ease-in-out"
                />
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className={`md:hover:cursor-pointer ${isRefreshing ? 'animate-spin' : ''}`}
                >
                    <RefreshCw className="h-4 w-4 text-muted-foreground" />
                    <span className="sr-only">Refresh data</span>
                </Button>
            </div>

            {filtered.length === 0 ? (
                <div className="rounded-xl border border-border/30 bg-card shadow-sm">
                    <NoDataComponent text="No profitability data found" />
                </div>
            ) : (
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                    {filtered.map((emp) => (
                        <EmployeeCard key={emp.employeeId} employee={emp} />
                    ))}
                </div>
            )}
        </>
    );
}
