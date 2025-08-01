"use client";

import { CardWrapper } from '@/components/auth/card-wrapper';
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

export const LoginForm = () => {
    const form = useForm({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = (values) => {
        console.log('Form submitted with values:', values);
    }

    return (
        <CardWrapper
            headerLabel="Welcome Back!"
            backButtonLabel="Don't have an account?"
            backButtonHref="/auth/register"
            showSocial={true}
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6">
                    <div className="space-y-4">
                        <FormField control={form.control}
                        name="email"
                        render={( {field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        type="email"
                                        placeholder="john.doe@deployconsulting.se"
                                        {...field}
                                        className="input"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>

                        <FormField control={form.control}
                        name="password"
                        render={( {field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input
                                        type="password"
                                        placeholder="******"
                                        {...field}
                                        className="input"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                    </div>
                    <FormError message="Some error occurred while logging in." />
                    <FormSuccess message="Login successful!" />
                    <Button type="submit"
                    className="w-full">
                        Login
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    );
};
