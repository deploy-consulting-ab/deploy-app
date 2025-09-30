'use client';

import { PROFILES, CONSULTANT_PROFILE } from '@/lib/permissions';
import { RegisterSchema } from '@/schemas';
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

import { register } from '@/actions/user/register';
import { useState, useTransition } from 'react';

export const RegisterFormComponent = () => {
    const form = useForm({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            email: '',
            password: '',
            name: '',
            employeeNumber: '',
            profileId: CONSULTANT_PROFILE,
        },
    });

    const [isPending, startTransition] = useTransition();
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const onSubmit = (values) => {
        setSuccess('');
        setError('');

        console.log('Form submitted:', values);

        startTransition(async () => {
            const response = await register(values);
            setSuccess(response.success);
            setError(response.error);

            if (response.success) {
                form.reset({
                    email: '',
                    password: '',
                    name: '',
                    employeeNumber: '',
                    profileId: CONSULTANT_PROFILE,
                });
            }
        });
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={isPending}
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
                                        disabled={isPending}
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
                                        disabled={isPending}
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
                                        disabled={isPending}
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
                                    disabled={isPending}
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
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
                <Button type="submit" className="w-full">
                    Register
                </Button>
            </form>
        </Form>
    );
};
