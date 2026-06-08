'use client';

import { useState } from 'react';
import { createFieldPermissionAction } from '@/actions/database/field-permission-actions';
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
    FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { FormError } from '@/components/auth/form/form-error';
import { useForm } from 'react-hook-form';
import { CreateFieldPermissionSchema } from '@/schemas';

export function CreateFieldPermissionComponent({ fireSuccess }) {
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm({
        resolver: zodResolver(CreateFieldPermissionSchema),
        defaultValues: {
            system: '',
            objectName: '',
            fieldName: '',
            label: '',
            description: '',
        },
    });

    const handleSubmit = async (data) => {
        setError('');
        setIsSubmitting(true);
        try {
            await createFieldPermissionAction(data);
            fireSuccess();
        } catch (err) {
            setError(err.message || 'An error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        form.reset();
        setError('');
    };

    return (
        <div className="space-y-6">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="system"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>System</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder="salesforce"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>e.g. salesforce, flex</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="objectName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Object Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder="Assignment__c"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>API object name</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="fieldName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Field API Name</FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={isSubmitting}
                                        placeholder="ActualAmount__c"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    The exact API field name as it appears in the source system
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="label"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Label</FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={isSubmitting}
                                        placeholder="Actual Amount"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>Human-readable display name</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={isSubmitting}
                                        placeholder="Controls visibility of the actual amount field on assignments"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormError message={error} />

                    <div className="flex gap-4">
                        <Button
                            type="button"
                            variant="outline"
                            className="flex-1 hover:cursor-pointer"
                            onClick={resetForm}
                            disabled={isSubmitting}
                        >
                            Reset
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1 hover:cursor-pointer"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Creating...' : 'Create'}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
