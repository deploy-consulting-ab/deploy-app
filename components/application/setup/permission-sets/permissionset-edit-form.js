'use client';

import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { FormError } from '@/components/auth/form/form-error';
import { useState } from 'react';

export function PermissionSetEditForm({ permissionSet, onSubmit, onEditingChange }) {
    const [error, setError] = useState('');
    
    const form = useForm({
        defaultValues: {
            description: permissionSet.description,
        },
    });

    const handleSubmit = async (data) => {
        try {
            await onSubmit(data);
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Permission Set Description</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder="Enter permission set description"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex gap-2">
                    <Button type="submit" className="hover:cursor-pointer">
                        Save Changes
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onEditingChange(false)}
                        className="hover:cursor-pointer"
                    >
                        Cancel
                    </Button>
                </div>

                <FormError message={error} />
            </form>
        </Form>
    );
}
