'use client';

import { PROFILES, CONSULTANT_PROFILE } from '@/lib/rba-constants';
import { CreateUserSchema } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

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
import { FormError } from '@/components/auth/form/form-error';
import { FormSuccess } from '@/components/auth/form/form-success';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

import { createUserAction } from '@/actions/database/user-actions';
import { useState, useTransition } from 'react';

export const CreateUserComponent = ({ fireSuccess }) => {
    const form = useForm({
        resolver: zodResolver(CreateUserSchema),
        defaultValues: {
            email: '',
            password: '',
            name: '',
            employeeNumber: '',
            profileId: CONSULTANT_PROFILE,
        },
    });

    const [isSubmitting, startTransition] = useTransition();
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (values) => {
        setSuccess('');
        setError('');

        startTransition(async () => {
            try {
                await createUserAction(values);
                fireSuccess();
            } catch (err) {
                setError(err.message);
            }
        });
    };

    const resetForm = () => {
        form.reset();
        setError('');
        setSuccess('');
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <div className="space-y-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={isSubmitting}
                                        type="name"
                                        placeholder="John Doe"
                                        {...field}
                                        className="input"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        type="email"
                                        disabled={isSubmitting}
                                        placeholder="john.doe@deployconsulting.se"
                                        {...field}
                                        className="input"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="employeeNumber"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Employee Number</FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={isSubmitting}
                                        type="text"
                                        placeholder="D000"
                                        {...field}
                                        className="input"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={isSubmitting}
                                        type="password"
                                        placeholder="******"
                                        {...field}
                                        className="input"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="profileId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Profile</FormLabel>
                                <Select
                                    disabled={isSubmitting}
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger className="hover:cursor-pointer w-full">
                                            <SelectValue placeholder="Select a profile" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {PROFILES.map((profile) => (
                                            <SelectItem key={profile} value={profile}>
                                                {profile}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <FormError message={error} />
                <FormSuccess message={success} />
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
    );
};
