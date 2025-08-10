'use client';

import { LoginSchema } from '@/schemas';
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
import { FormError } from '@/components/form-error';
import { FormSuccess } from '@/components/form-success';
import { CardWrapperComponent } from '@/components/auth/card-wrapper';

import { login } from '@/actions/login';
import { useState, useTransition } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export const LoginFormComponent = () => {
    const form = useForm({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const [isPending, startTransition] = useTransition();
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const onSubmit = (values) => {
        setSuccess('');
        setError('');

        startTransition(async () => {
            const response = await login(values);
            setSuccess(response.success);
            setError(response.error);
        });
    };

    return (
        <CardWrapperComponent
            headerLabel="Welcome Back!"
            backButtonLabel="Don't have an account?"
            backButtonHref="/auth/register"
            showSocial={true}
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-black dark:text-black">Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            disabled={isPending}
                                            placeholder="john.doe@deployconsulting.se"
                                            {...field}
                                            className="input bg-white dark:bg-white text-black dark:text-black dark:placeholder:text-gray-500"
                                            suppressHydrationWarning
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
                                    <FormLabel className="text-black dark:text-black">Password</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                disabled={isPending}
                                                type={showPassword ? "text" : "password"}
                                                placeholder="******"
                                                {...field}
                                                className="input pr-10 bg-white dark:bg-white text-black dark:text-black dark:placeholder:text-gray-500"
                                                suppressHydrationWarning
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute inset-y-0 right-0 flex items-center pr-3"
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="h-4 w-4 text-gray-500" />
                                                ) : (
                                                    <Eye className="h-4 w-4 text-gray-500" />
                                                )}
                                            </button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormError message={error} />
                    <FormSuccess message={success} />
                    <Button type="submit" className="w-full bg-black text-white" suppressHydrationWarning>
                        Login
                    </Button>
                </form>
            </Form>
        </CardWrapperComponent>
    );
};
