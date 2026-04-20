import { Card, CardContent } from '@/components/ui/card';
import { formatSEK } from '@/lib/utils';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
const QUARTER_LABELS = {
    0: 'Total Year',
    1: 'Q1',
    2: 'Q2',
    3: 'Q3',
    4: 'Q4',
};

export function FinancialCardPhoneComponent({ record, canManage, openEditDialog, handleDelete }) {

    const quarterLabel =
    record.quarter === -1 ? 'Total Year' : QUARTER_LABELS[record.quarter];
    return (
        <Card key={record.id} className={record._isComputed ? 'bg-muted/80 dark:bg-muted' : ''}>
            <CardContent>
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">
                            FY{String(record.fiscalYear).slice(-2)}
                        </span>
                        <span className="text-muted-foreground text-sm">—</span>
                        <span className="text-sm">{quarterLabel}</span>
                        {record._isComputed && (
                            <span className="text-xs text-muted-foreground">(computed)</span>
                        )}
                    </div>
                    {canManage && !record._isComputed && (
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
                    )}
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">
                            Revenue
                        </p>
                        <p className="font-medium tabular-nums text-sm">
                            {formatSEK(record.revenue)}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">
                            Cost
                        </p>
                        <p className="font-medium tabular-nums text-sm">{formatSEK(record.cost)}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">
                            Profit
                        </p>
                        <p className="font-medium tabular-nums text-sm">
                            {formatSEK(record.profit)}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">
                            Taxes
                        </p>
                        <p className="font-medium tabular-nums text-sm">
                            {formatSEK(record.taxes)}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
