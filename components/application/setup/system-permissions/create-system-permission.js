'use client';

import { useState } from 'react';
import { createSystemPermissionAction } from '@/actions/database/system-permission-actions';
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { FormError } from '@/components/auth/form/form-error';
import { useForm } from 'react-hook-form';
import { CreateSystemPermissionSchema } from '@/schemas';

export function CreateSystemPermissionComponent({ fireSuccess }) {
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState('');

    const handleSubmit = async (data) => {
        setSuccess('');
        setError('');
        setIsSubmitting(true);

        try {
            await createSystemPermissionAction(data);
            fireSuccess();
        } catch (error) {
            setError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const form = useForm({
        resolver: zodResolver(CreateSystemPermissionSchema),
        defaultValues: {
            name: '',
            description: '',
            id: '',
        },
    });

    const resetForm = () => {
        form.reset();
        setAssignedPermissions({});
        setError('');
        setSuccess('');
    };

    return (
        <div className="space-y-6">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={isSubmitting}
                                        placeholder="Home:View"
                                        {...field}
                                    />
                                </FormControl>
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
                                        placeholder="Access to view the home page"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="id"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>ID</FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={isSubmitting}
                                        placeholder="perm_home_view"
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
                            className="flex-1"
                            onClick={resetForm}
                            disabled={isSubmitting}
                        >
                            Reset
                        </Button>
                        <Button type="submit" className="flex-1" disabled={isSubmitting}>
                            {isSubmitting ? 'Creating...' : 'Create'}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
