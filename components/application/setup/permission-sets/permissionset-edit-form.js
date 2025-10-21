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
import { FormSuccess } from '@/components/auth/form/form-success';
import { useState, useEffect } from 'react';

export function PermissionSetEditForm({ permissionSet, onSubmit, onEditingChange }) {
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm({
        defaultValues: {
            description: permissionSet.description,
            name: permissionSet.name,
            id: permissionSet.id,
        },
    });

    // Effect to handle fade out animation
    useEffect(() => {
        let fadeOutTimer;
        let removeTimer;

        if (success) {
            setIsVisible(true);
            // Start fade out after 1 second
            fadeOutTimer = setTimeout(() => {
                setIsVisible(false);
                // Remove message after animation completes (0.5s)
                removeTimer = setTimeout(() => {
                    setSuccess('');
                }, 500);
            }, 1000);
        }

        return () => {
            clearTimeout(fadeOutTimer);
            clearTimeout(removeTimer);
        };
    }, [success]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = form.getValues();
        setSuccess('');
        setError('');
        setIsSubmitting(true);
        try {
            await onSubmit(data);
            form.reset(data);
            setSuccess('Permission Set updated successfully');
        } catch (err) {
            setError(err.message || 'An error occurred while updating the permission set');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Form {...form}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Permission Set Name</FormLabel>
                                <FormControl>
                                    <Input {...field} />
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
                                <FormLabel>Permission Set ID</FormLabel>
                                <FormControl>
                                    <Input {...field} />
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
                    <div className="flex justify-end gap-4 mt-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onEditingChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : 'Save'}
                        </Button>
                    </div>
                </form>
            </Form>
            <div className="mt-4">
                <FormError message={error} />
                <div
                    className={`transition-opacity duration-500 ease-in-out ${
                        isVisible ? 'opacity-100' : 'opacity-0'
                    }`}
                >
                    <FormSuccess message={success} />
                </div>
            </div>
        </>
    );
}
