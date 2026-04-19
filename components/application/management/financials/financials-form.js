'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useTransition } from 'react';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { FormError } from '@/components/auth/form/form-error';
import { CreateFinancialRecordSchema } from '@/schemas';
import { getCurrentFiscalYear } from '@/lib/utils';

const QUARTER_OPTIONS = [
    { value: '0', label: 'Total Year' },
    { value: '1', label: 'Q1 (Feb – Apr)' },
    { value: '2', label: 'Q2 (May – Jul)' },
    { value: '3', label: 'Q3 (Aug – Oct)' },
    { value: '4', label: 'Q4 (Nov – Jan)' },
];

const currentYear = getCurrentFiscalYear();
const FISCAL_YEAR_OPTIONS = Array.from({ length: 10 }, (_, i) => currentYear - i + 2);

export function FinancialsFormComponent({ record, onSubmit }) {
    const [isSubmitting, startTransition] = useTransition();
    const [error, setError] = useState('');

    const form = useForm({
        resolver: zodResolver(CreateFinancialRecordSchema),
        defaultValues: {
            fiscalYear: record?.fiscalYear ?? currentYear,
            quarter: record?.quarter ?? 1,
            revenue: record?.revenue ?? 0,
            cost: record?.cost ?? 0,
            benefit: record?.benefit ?? 0,
            taxes: record?.taxes ?? 0,
        },
    });

    const handleSubmit = async (values) => {
        setError('');
        startTransition(async () => {
            try {
                await onSubmit(values);
            } catch (err) {
                setError(err.message);
            }
        });
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="fiscalYear"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Fiscal Year</FormLabel>
                                <Select
                                    disabled={isSubmitting}
                                    onValueChange={(val) => field.onChange(parseInt(val, 10))}
                                    value={String(field.value)}
                                >
                                    <FormControl>
                                        <SelectTrigger className="hover:cursor-pointer w-full">
                                            <SelectValue placeholder="Select fiscal year" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {FISCAL_YEAR_OPTIONS.map((year) => (
                                            <SelectItem key={year} value={String(year)}>
                                                FY{String(year).slice(-2)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="quarter"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Quarter</FormLabel>
                                <Select
                                    disabled={isSubmitting}
                                    onValueChange={(val) => field.onChange(parseInt(val, 10))}
                                    value={String(field.value)}
                                >
                                    <FormControl>
                                        <SelectTrigger className="hover:cursor-pointer w-full">
                                            <SelectValue placeholder="Select quarter" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {QUARTER_OPTIONS.map((q) => (
                                            <SelectItem key={q.value} value={q.value}>
                                                {q.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="revenue"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Revenue (SEK)</FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={isSubmitting}
                                        type="number"
                                        step="any"
                                        min="0"
                                        placeholder="0"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="cost"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Cost (SEK)</FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={isSubmitting}
                                        type="number"
                                        step="any"
                                        min="0"
                                        placeholder="0"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="benefit"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Benefit (SEK)</FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={isSubmitting}
                                        type="number"
                                        step="any"
                                        placeholder="0"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="taxes"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Taxes (SEK)</FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={isSubmitting}
                                        type="number"
                                        step="any"
                                        min="0"
                                        placeholder="0"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormError message={error} />

                <Button
                    type="submit"
                    className="w-full hover:cursor-pointer"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Saving...' : record ? 'Save Changes' : 'Create Record'}
                </Button>
            </form>
        </Form>
    );
}
