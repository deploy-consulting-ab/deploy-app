'use client';

import { useForm } from 'react-hook-form';
import Link from 'next/link';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { PROFILES } from '@/lib/permissions';
import { updateUserAction } from '@/actions/database/user-actions';
import { FormError } from '@/components/auth/form/form-error';
import { FormSuccess } from '@/components/auth/form/form-success';
import { useState, useTransition, useEffect } from 'react';

export function UserEditForm({ user, onEditingChange, onUserUpdate }) {
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const [isPending, startTransition] = useTransition();

    const form = useForm({
        defaultValues: {
            employeeNumber: user.employeeNumber,
            profileId: user.profileId,
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

    const onSubmit = async (data) => {
        setSuccess('');
        setError('');
        startTransition(async () => {
            const response = await updateUserAction(user.id, data);

            if (response.success) {
                const updatedUser = {
                    ...user,
                    employeeNumber: data.employeeNumber,
                    profileId: data.profileId,
                };
                // Reset form with the submitted values
                form.reset({
                    employeeNumber: data.employeeNumber,
                    profileId: data.profileId,
                });
                setSuccess(response.success);
                onUserUpdate(updatedUser);
                onEditingChange(false);
            } else {
                setError(response.error);
            }
        });
    };

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    {/* Employee Number */}
                    <FormField
                        control={form.control}
                        name="employeeNumber"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Employee Number</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        placeholder="Enter employee number"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Profile */}
                    <FormField
                        control={form.control}
                        name="profileId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Profile</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
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
                                {field.value && (
                                    <Link
                                        href={`/setup/profiles/${field.value}`}
                                        className="text-sm text-blue-600 hover:text-blue-800 hover:underline mt-1 block"
                                    >
                                        View Profile Details
                                    </Link>
                                )}
                            </FormItem>
                        )}
                    />

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                        <Button type="submit" className="hover:cursor-pointer">
                            Save Changes
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            className="hover:cursor-pointer"
                            onClick={() => onEditingChange(false)}
                        >
                            Cancel
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
