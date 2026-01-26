'use client';

import { useEffect, useState, useRef, useImperativeHandle, forwardRef } from 'react';
import { deleteAbsenceRequest, updateAbsenceRequest } from '@/actions/flex/flex-actions';
import { DatatableWrapperComponent } from '@/components/application/datatable-wrapper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowUpDown, MoreHorizontal, Pencil, Trash2, Check, X, CalendarIcon } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ReadOnlyCalendar } from '@/components/ui/read-only-calendar';
import { formatDateToISOString, cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { getAbsenceStatusColor } from '@/lib/utils';
import { toastRichSuccess, toastRichError } from '@/lib/toast-library';
import { enGB } from 'react-day-picker/locale';
import { ABSENCE_STATUS_REGISTERED, ABSENCE_STATUS_APPLIED_FOR } from '@/actions/flex/constants';

/**
 * Inline editable hours input component that manages its own local state
 * and exposes getValue via ref - no parent re-renders during typing
 */
const EditableHoursInput = forwardRef(function EditableHoursInput({ initialValue }, ref) {
    const [localValue, setLocalValue] = useState(initialValue);

    // Expose getValue method to parent via ref
    useImperativeHandle(
        ref,
        () => ({
            getValue: () => localValue,
        }),
        [localValue]
    );

    const handleChange = (e) => {
        let value = e.target.value;
        // Allow empty string for clearing
        if (value === '') {
            setLocalValue('');
            return;
        }

        let numValue = parseFloat(value);
        if (isNaN(numValue) || numValue < 0) {
            return;
        }
        if (numValue > 8) numValue = 8;
        setLocalValue(numValue);
    };

    return (
        <Input
            type="number"
            inputMode="decimal"
            min="0"
            max="8"
            step="0.5"
            value={localValue}
            onChange={handleChange}
            className="h-8 w-20 text-xs [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
    );
});

/**
 * Parse a date string (YYYY-MM-DD or ISO) to a Date object in local timezone
 */
const parseToLocalDate = (dateStr) => {
    if (!dateStr) return null;
    const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (match) {
        return new Date(parseInt(match[1]), parseInt(match[2]) - 1, parseInt(match[3]));
    }
    return new Date(dateStr);
};

/**
 * Format a local Date object to YYYY-MM-DD string
 */
const formatLocalDate = (date) => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

/**
 * Default labels for absence types
 */
const DEFAULT_LABELS = {
    singular: 'request',
    plural: 'requests',
    updateSuccess: 'Request updated successfully',
    updateError: 'Error updating request',
    deleteSuccess: 'Request deleted successfully',
    deleteError: 'Error deleting request',
    loading: 'Loading requests...',
};

/**
 * Generic absence requested list component that can be used for different absence types
 * (holidays, sick leave, parental leave, etc.)
 *
 * @param {Object} props
 * @param {string} props.employmentNumber - The employee number
 * @param {string} props.absenceTypeId - The absence application type ID (e.g., 'holiday-absence-request')
 * @param {Function} props.fetchRequests - Function to fetch requests, receives (employmentNumber, currentDate)
 * @param {Object} props.labels - Custom labels for the component
 * @param {number} props.pageSize - Number of items per page (default: 5)
 */
export function AbsenceRequestedListComponent({
    employmentNumber,
    absenceTypeId,
    fetchRequests,
    labels = {},
    pageSize = 5,
}) {
    const mergedLabels = { ...DEFAULT_LABELS, ...labels };

    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [editValues, setEditValues] = useState({ FromDate: null, ToDate: null, Hours: null });
    const [fromDateOpen, setFromDateOpen] = useState(false);
    const [toDateOpen, setToDateOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const hoursInputRef = useRef(null);

    useEffect(() => {
        const loadRequests = async () => {
            setIsLoading(true);
            try {
                const response = await fetchRequests(employmentNumber, new Date());
                setRequests(response || []);
            } catch (error) {
                console.error(`Error fetching ${mergedLabels.plural}:`, error);
                setRequests([]);
            } finally {
                setIsLoading(false);
            }
        };

        loadRequests();
    }, [employmentNumber, fetchRequests]);

    const isSameDay =
        editValues.FromDate &&
        editValues.ToDate &&
        formatLocalDate(editValues.FromDate) === formatLocalDate(editValues.ToDate);

    const handleEdit = (row) => {
        const fromDate = parseToLocalDate(row.FromDate);
        const toDate = parseToLocalDate(row.ToDate);
        setEditingId(row.Id);
        setEditValues({
            FromDate: fromDate,
            ToDate: toDate,
            Hours: row.Hours || 8,
        });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditValues({ FromDate: null, ToDate: null, Hours: null });
        setFromDateOpen(false);
        setToDateOpen(false);
    };

    const handleSaveEdit = async (id) => {
        setIsSaving(true);
        // Read hours from ref if available (for same-day edits)
        const currentHours = hoursInputRef.current?.getValue?.() ?? editValues.Hours;
        try {
            await updateAbsenceRequest(absenceTypeId, id, employmentNumber, {
                FromDate: formatLocalDate(editValues.FromDate),
                ToDate: formatLocalDate(editValues.ToDate),
                Hours: isSameDay ? currentHours : null,
            });

            // Update local state
            setRequests(
                requests.map((req) => {
                    if (req.Id === id) {
                        return {
                            ...req,
                            FromDate: formatLocalDate(editValues.FromDate) + 'T00:00:00',
                            ToDate: formatLocalDate(editValues.ToDate) + 'T00:00:00',
                            Hours: isSameDay ? currentHours : null,
                        };
                    }
                    return req;
                })
            );

            toastRichSuccess({
                message: mergedLabels.updateSuccess,
                duration: 2000,
            });
            handleCancelEdit();
        } catch (error) {
            toastRichError({
                message: mergedLabels.updateError,
                duration: 2000,
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteAbsenceRequest(id);
            setRequests(requests.filter((request) => request.Id !== id));
            toastRichSuccess({
                message: mergedLabels.deleteSuccess,
                duration: 2000,
            });
        } catch (error) {
            toastRichError({
                message: mergedLabels.deleteError,
                duration: 2000,
            });
        }
    };

    const handleFromDateSelect = (date) => {
        setEditValues((prev) => {
            const newValues = { ...prev, FromDate: date };
            // If ToDate is before new FromDate, update ToDate too
            if (prev.ToDate && date && formatLocalDate(date) > formatLocalDate(prev.ToDate)) {
                newValues.ToDate = date;
            }
            return newValues;
        });
        setFromDateOpen(false);
    };

    const handleToDateSelect = (date) => {
        setEditValues((prev) => ({ ...prev, ToDate: date }));
        setToDateOpen(false);
    };

    const columns = [
        {
            accessorKey: 'FromDate',
            size: 150,
            minSize: 120,
            maxSize: 200,
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 -ml-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-transparent"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    >
                        From Date
                        <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 opacity-50" />
                    </Button>
                );
            },
            cell: ({ row }) => {
                const isEditing = editingId === row.original.Id;
                const dateValue = row.getValue('FromDate');

                if (isEditing) {
                    return (
                        <Popover open={fromDateOpen} onOpenChange={setFromDateOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className={cn(
                                        'w-full h-8 justify-start text-left font-normal text-xs',
                                        !editValues.FromDate && 'text-muted-foreground'
                                    )}
                                >
                                    <CalendarIcon className="mr-1.5 h-3 w-3 shrink-0" />
                                    {editValues.FromDate
                                        ? formatLocalDate(editValues.FromDate)
                                        : 'Select date'}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <ReadOnlyCalendar
                                    mode="single"
                                    selected={editValues.FromDate}
                                    onSelect={handleFromDateSelect}
                                    initialFocus
                                    locale={enGB}
                                    defaultMonth={editValues.FromDate || undefined}
                                />
                            </PopoverContent>
                        </Popover>
                    );
                }

                return <div className="text-foreground/80">{formatDateToISOString(dateValue)}</div>;
            },
        },
        {
            accessorKey: 'ToDate',
            size: 150,
            minSize: 120,
            maxSize: 200,
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 -ml-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-transparent"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    >
                        To Date
                        <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 opacity-50" />
                    </Button>
                );
            },
            cell: ({ row }) => {
                const isEditing = editingId === row.original.Id;
                const dateValue = row.getValue('ToDate');

                if (isEditing) {
                    return (
                        <Popover open={toDateOpen} onOpenChange={setToDateOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className={cn(
                                        'w-full h-8 justify-start text-left font-normal text-xs',
                                        !editValues.ToDate && 'text-muted-foreground'
                                    )}
                                >
                                    <CalendarIcon className="mr-1.5 h-3 w-3 shrink-0" />
                                    {editValues.ToDate
                                        ? formatLocalDate(editValues.ToDate)
                                        : 'Select date'}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <ReadOnlyCalendar
                                    mode="single"
                                    selected={editValues.ToDate}
                                    onSelect={handleToDateSelect}
                                    initialFocus
                                    locale={enGB}
                                    defaultMonth={
                                        editValues.ToDate || editValues.FromDate || undefined
                                    }
                                    disabled={
                                        editValues.FromDate
                                            ? { before: editValues.FromDate }
                                            : undefined
                                    }
                                />
                            </PopoverContent>
                        </Popover>
                    );
                }

                return <div className="text-foreground/80">{formatDateToISOString(dateValue)}</div>;
            },
        },
        {
            accessorKey: 'Hours',
            size: 100,
            minSize: 80,
            maxSize: 150,
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 -ml-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-transparent"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    >
                        Hours
                        <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 opacity-50" />
                    </Button>
                );
            },
            cell: ({ row }) => {
                const isEditing = editingId === row.original.Id;
                const hours = row.getValue('Hours');

                if (isEditing) {
                    if (!isSameDay) {
                        return (
                            <div className="text-foreground/50 text-xs italic">N/A (multi-day)</div>
                        );
                    }

                    return (
                        <EditableHoursInput ref={hoursInputRef} initialValue={editValues.Hours} />
                    );
                }

                return <div className="text-foreground/80 tabular-nums">{hours || '-'}</div>;
            },
        },
        {
            accessorKey: 'Status',
            size: 100,
            minSize: 80,
            maxSize: 150,
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 -ml-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-transparent"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    >
                        Status
                    </Button>
                );
            },
            cell: ({ row }) => {
                const status = row.original.status;
                return (
                    <Badge className={`${getAbsenceStatusColor(status)} text-white shadow-sm`}>
                        {status}
                    </Badge>
                );
            },
        },
        {
            id: 'actions',
            enableSorting: false,
            enableHiding: false,
            maxSize: 80,
            cell: ({ row }) => {
                const isEditing = editingId === row.original.Id;
                const id = row.original.Id;
                const status = row.original.status;

                // Hide actions for 'Registered' (code 0) or 'Applied for' (code 1) statuses
                const isActionHidden =
                    status === ABSENCE_STATUS_REGISTERED || status === ABSENCE_STATUS_APPLIED_FOR;

                if (isActionHidden && !isEditing) {
                    return null;
                }

                if (isEditing) {
                    return (
                        <div className="flex items-center gap-1">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-100"
                                onClick={() => handleSaveEdit(id)}
                                disabled={isSaving}
                            >
                                <Check className="h-4 w-4" />
                                <span className="sr-only">Save</span>
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-100"
                                onClick={handleCancelEdit}
                                disabled={isSaving}
                            >
                                <X className="h-4 w-4" />
                                <span className="sr-only">Cancel</span>
                            </Button>
                        </div>
                    );
                }

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className="h-8 w-8 p-0 opacity-50 hover:opacity-100"
                            >
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(row.original)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                variant="destructive"
                                onClick={() => handleDelete(id)}
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-8">
                <p className="text-muted-foreground text-sm">{mergedLabels.loading}</p>
            </div>
        );
    }

    return (
        <DatatableWrapperComponent
            data={requests}
            columns={columns}
            placeholder="Filter by date..."
            searchKey="FromDate"
            pageSize={pageSize}
        />
    );
}
