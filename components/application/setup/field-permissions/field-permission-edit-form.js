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
    FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import { FormError } from '@/components/auth/form/form-error';
import { FormSuccess } from '@/components/auth/form/form-success';

export function FieldPermissionEditForm({ fieldPermission, onEditingChange, onSubmit }) {
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm({
        defaultValues: {
            system: fieldPermission.system,
            objectName: fieldPermission.objectName,
            fieldName: fieldPermission.fieldName,
            label: fieldPermission.label || '',
            description: fieldPermission.description || '',
        },
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = form.getValues();
        setSuccess('');
        setError('');
        setIsSubmitting(true);
        try {
            await onSubmit(data);
            form.reset(data);
            setSuccess('Field permission updated successfully');
        } catch (err) {
            setError(err.message || 'An error occurred while updating the field permission');
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        let fadeOutTimer;
        let removeTimer;

        if (success) {
            setIsVisible(true);
            fadeOutTimer = setTimeout(() => {
                setIsVisible(false);
                removeTimer = setTimeout(() => setSuccess(''), 500);
            }, 1000);
        }

        return () => {
            clearTimeout(fadeOutTimer);
            clearTimeout(removeTimer);
        };
    }, [success]);

    return (
        <>
            <Form {...form}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="system"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>System</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="salesforce" />
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
                                        <Input {...field} placeholder="Assignment__c" />
                                    </FormControl>
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
                                    <Input {...field} placeholder="ActualAmount__c" />
                                </FormControl>
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
                                    <Input {...field} placeholder="Actual Amount" />
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
                                    <Input {...field} placeholder="Controls visibility of..." />
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
                            className="hover:cursor-pointer"
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting} className="hover:cursor-pointer">
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
