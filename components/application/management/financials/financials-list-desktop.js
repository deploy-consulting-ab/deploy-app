'use client';

import { useState } from 'react';
import { ArrowUpDown, MoreHorizontal, RefreshCw, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { DatatableWrapperComponent } from '@/components/application/datatable-wrapper';
import { FinancialsFormComponent } from '@/components/application/management/financials/financials-form';
import {
    FinancialsBarChartComponent,
    FinancialsLineChartComponent,
} from '@/components/application/management/financials/financials-chart';
import { ErrorDisplayComponent } from '@/components/errors/error-display';
import {
    getFinancialsAction,
    createFinancialRecordAction,
    updateFinancialRecordAction,
    deleteFinancialRecordAction,
} from '@/actions/database/financials-actions';
import { toastRichSuccess, toastRichError } from '@/lib/toast-library';
import { formatSEK, getCurrentFiscalYear } from '@/lib/utils';
import { QUARTER_LABELS, QUARTER_FILTER_OPTIONS } from './financials-constants';

function buildComputedTotal(records, fiscalYear) {
    const quarterRecords = records.filter(
        (r) => r.fiscalYear === fiscalYear && r.quarter >= 1 && r.quarter <= 4
    );
    if (quarterRecords.length === 0) return null;

    return {
        id: `computed-total-${fiscalYear}`,
        fiscalYear,
        quarter: -1,
        revenue: quarterRecords.reduce((sum, r) => sum + r.revenue, 0),
        cost: quarterRecords.reduce((sum, r) => sum + r.cost, 0),
        benefit: quarterRecords.reduce((sum, r) => sum + r.benefit, 0),
        taxes: quarterRecords.reduce((sum, r) => sum + r.taxes, 0),
        _isComputed: true,
    };
}

function getAvailableFiscalYears(records) {
    const years = [...new Set(records.map((r) => r.fiscalYear))].sort((a, b) => b - a);
    return years;
}

export function FinancialsListDesktopComponent({
    records: initialRecords,
    error: initialError,
    canManage,
}) {
    const [records, setRecords] = useState(initialRecords ?? []);
    const [error, setError] = useState(initialError);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [editRecord, setEditRecord] = useState(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    const currentFY = getCurrentFiscalYear();
    const availableFYs = getAvailableFiscalYears(records);
    const defaultFY = availableFYs.length > 0 ? availableFYs[0] : currentFY;

    const [selectedFY, setSelectedFY] = useState(String(defaultFY));
    const [selectedQuarter, setSelectedQuarter] = useState('all');

    const handleRefresh = async () => {
        if (isRefreshing) return;
        setIsRefreshing(true);
        try {
            const fresh = await getFinancialsAction();
            setRecords(fresh);
            setError(null);
        } catch (err) {
            setError(err);
        } finally {
            setIsRefreshing(false);
        }
    };

    const handleCreate = async (values) => {
        await createFinancialRecordAction(values);
        setIsCreateDialogOpen(false);
        toastRichSuccess({ message: 'Financial record created' });
        await handleRefresh();
    };

    const handleEdit = async (values) => {
        await updateFinancialRecordAction(editRecord.id, values);
        setIsEditDialogOpen(false);
        setEditRecord(null);
        toastRichSuccess({ message: 'Financial record updated' });
        await handleRefresh();
    };

    const handleDelete = async (id) => {
        try {
            await deleteFinancialRecordAction(id);
            toastRichSuccess({ message: 'Financial record deleted' });
            await handleRefresh();
        } catch (err) {
            toastRichError({ message: err.message });
        }
    };

    const openEditDialog = (record) => {
        setEditRecord(record);
        setIsEditDialogOpen(true);
    };

    const fyNum = parseInt(selectedFY, 10);

    const filteredRecords = (() => {
        let base = records.filter((r) => r.fiscalYear === fyNum);

        if (selectedQuarter !== 'all') {
            const qNum = parseInt(selectedQuarter, 10);
            base = base.filter((r) => r.quarter === qNum);
        }

        const rows = [...base];

        if (selectedQuarter === 'all' || selectedQuarter === '-1') {
            const computed = buildComputedTotal(records, fyNum);
            if (computed) rows.push(computed);
        }

        const sortKey = (q) => {
            if (q >= 1 && q <= 4) return q;
            if (q === 0) return 5;
            return 6;
        };
        return rows.sort((a, b) => sortKey(a.quarter) - sortKey(b.quarter));
    })();

    const columns = [
        {
            accessorKey: 'fiscalYear',
            size: 130,
            minSize: 100,
            maxSize: 160,
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 -ml-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-transparent hover:cursor-pointer"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Fiscal Year
                    <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 opacity-50" />
                </Button>
            ),
            cell: ({ row }) => {
                const fy = row.getValue('fiscalYear');
                return <div className="font-medium tabular-nums">FY{String(fy).slice(-2)}</div>;
            },
        },
        {
            accessorKey: 'quarter',
            size: 120,
            minSize: 100,
            maxSize: 150,
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 -ml-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-transparent hover:cursor-pointer"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Quarter
                    <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 opacity-50" />
                </Button>
            ),
            cell: ({ row }) => {
                const q = row.getValue('quarter');
                const isComputed = row.original._isComputed;
                return (
                    <div className="flex items-center gap-1.5">
                        <span>{q === -1 ? 'Total Year' : QUARTER_LABELS[q]}</span>
                        {isComputed && (
                            <span className="text-xs text-muted-foreground">(computed)</span>
                        )}
                    </div>
                );
            },
        },
        {
            accessorKey: 'revenue',
            size: 150,
            minSize: 120,
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 -ml-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-transparent hover:cursor-pointer"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Revenue
                    <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 opacity-50" />
                </Button>
            ),
            cell: ({ row }) => (
                <div className="tabular-nums text-foreground/80">
                    {formatSEK(row.getValue('revenue'))}
                </div>
            ),
        },
        {
            accessorKey: 'cost',
            size: 150,
            minSize: 120,
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 -ml-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-transparent hover:cursor-pointer"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Cost
                    <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 opacity-50" />
                </Button>
            ),
            cell: ({ row }) => (
                <div className="tabular-nums text-foreground/80">
                    {formatSEK(row.getValue('cost'))}
                </div>
            ),
        },
        {
            accessorKey: 'benefit',
            size: 150,
            minSize: 120,
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 -ml-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-transparent hover:cursor-pointer"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Benefit
                    <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 opacity-50" />
                </Button>
            ),
            cell: ({ row }) => (
                <div className="tabular-nums text-foreground/80">
                    {formatSEK(row.getValue('benefit'))}
                </div>
            ),
        },
        {
            accessorKey: 'taxes',
            size: 150,
            minSize: 120,
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 -ml-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-transparent hover:cursor-pointer"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Taxes
                    <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 opacity-50" />
                </Button>
            ),
            cell: ({ row }) => (
                <div className="tabular-nums text-foreground/80">
                    {formatSEK(row.getValue('taxes'))}
                </div>
            ),
        },
        ...(canManage
            ? [
                  {
                      id: 'actions',
                      enableSorting: false,
                      enableHiding: false,
                      maxSize: 10,
                      cell: ({ row }) => {
                          const record = row.original;
                          if (record._isComputed) return null;
                          return (
                              <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                      <Button
                                          variant="ghost"
                                          className="h-8 w-8 p-0 opacity-50 hover:opacity-100 hover:cursor-pointer"
                                      >
                                          <span className="sr-only">Open menu</span>
                                          <MoreHorizontal />
                                      </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                      <DropdownMenuItem onClick={() => openEditDialog(record)}>
                                          Edit
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                          variant="destructive"
                                          onClick={() => handleDelete(record.id)}
                                      >
                                          Delete
                                      </DropdownMenuItem>
                                  </DropdownMenuContent>
                              </DropdownMenu>
                          );
                      },
                  },
              ]
            : []),
    ];

    const fyOptions = (() => {
        const all = [...availableFYs];
        if (!all.includes(currentFY)) all.unshift(currentFY);
        return all;
    })();

    const fyFilterView = (
        <Select value={selectedFY} onValueChange={setSelectedFY} key="fy-filter">
            <SelectTrigger className="w-[160px] hover:cursor-pointer">
                <SelectValue placeholder="Fiscal Year" />
            </SelectTrigger>
            <SelectContent>
                {fyOptions.map((fy) => (
                    <SelectItem key={fy} value={String(fy)}>
                        FY{String(fy).slice(-2)}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );

    const quarterFilterView = (
        <Select value={selectedQuarter} onValueChange={setSelectedQuarter} key="quarter-filter">
            <SelectTrigger className="w-[150px] hover:cursor-pointer">
                <SelectValue placeholder="Quarter" />
            </SelectTrigger>
            <SelectContent>
                {QUARTER_FILTER_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );

    const createAction = canManage ? (
        <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
            key="create-financial"
        >
            <DialogTrigger asChild>
                <Button size="sm" className="hover:cursor-pointer">
                    <PlusCircle className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Add Financial Record</DialogTitle>
                    <DialogDescription>
                        Enter the financial figures for the selected fiscal year and quarter.
                    </DialogDescription>
                </DialogHeader>
                <FinancialsFormComponent onSubmit={handleCreate} />
            </DialogContent>
        </Dialog>
    ) : null;

    const refreshAction = (
        <Button
            key="refresh-financials"
            variant="ghost"
            size="icon"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className={`hover:cursor-pointer ${isRefreshing ? 'animate-spin' : ''}`}
        >
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
            <span className="sr-only">Refresh data</span>
        </Button>
    );

    if (error) {
        return <ErrorDisplayComponent error={error} />;
    }

    const views = [fyFilterView, quarterFilterView];
    const actions = [createAction, refreshAction].filter(Boolean);

    return (
        <div className="space-y-6">
            <DatatableWrapperComponent
                data={filteredRecords}
                columns={columns}
                pageSize={10}
                views={views}
                actions={actions}
                showPagination={false}
                showSearch={false}
                getRowClassName={(row) =>
                    row.original._isComputed
                        ? 'bg-muted/80 hover:bg-muted/80 dark:bg-muted/100 dark:hover:bg-muted/100'
                        : ''
                }
            />

            <div className="grid grid-cols-2 gap-6">
                <FinancialsBarChartComponent records={records} fiscalYear={fyNum} />
                <FinancialsLineChartComponent records={records} />
            </div>

            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Edit Financial Record</DialogTitle>
                        <DialogDescription>
                            Update the financial figures for this record.
                        </DialogDescription>
                    </DialogHeader>
                    {editRecord && (
                        <FinancialsFormComponent record={editRecord} onSubmit={handleEdit} />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
