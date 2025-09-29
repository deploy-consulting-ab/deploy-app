'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from '@/components/ui/card';
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
import { updateUserAction } from '@/actions/user/update-user';
import { useTransition } from 'react';

import { FormError } from '@/components/auth/form/form-error';
import { FormSuccess } from '@/components/auth/form/form-success';
import { AllPermissionsCardComponent } from './all-permissions-card';

export function UserCardComponent({ user }) {
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isPending, startTransition] = useTransition();
    const form = useForm({
        defaultValues: {
            employeeNumber: user.employeeNumber,
            profileId: user.profileId,
        },
    });

    const onSubmit = async (data) => {
        setSuccess('');
        setError('');
        console.log('Form submitted:', data);
        startTransition(async () => {
            const response = await updateUserAction(user.id, data);
            setSuccess(response.success);
            setError(response.error);
            setIsEditing(false);
        });
        // TODO: Implement actual update logic
    };

    // user.allPermissions = [
    //     'Home:View',
    //     'Holidays:View',
    //     'Assignments:View',
    //     'Lead:Create',
    //     'Lead:View',
    //     'Lead:Edit',
    //     'Lead:Delete',
    //     'Home:View',
    //     'Holidays:View',
    //     'Assignments:View',
    //     'Lead:Create',
    //     'Assignments:View',
    //     'Lead:Create',
    //     'Lead:View',
    //     'Lead:Edit',
    //     'Lead:Delete',
    //     'Home:View',
    // ];

    return (
        <div className="grid grid-cols-2 gap-6">
            {/* User Details Card */}
            <Card className="col-span-1 py-4">
                <CardHeader>
                    <CardTitle className="text-2xl">{user.name}</CardTitle>
                    <CardDescription>{user.email}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
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
                                                disabled={!isEditing}
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
                                            disabled={!isEditing}
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="hover:cursor-pointer">
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

                            {/* Action Buttons */}
                            {isEditing ? (
                                <div className="flex gap-2">
                                    <Button type="submit" className="hover:cursor-pointer">
                                        Save Changes
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="hover:cursor-pointer"
                                        onClick={() => setIsEditing(false)}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            ) : (
                                <Button
                                    type="button"
                                    onClick={() => setIsEditing(true)}
                                    className="hover:cursor-pointer"
                                >
                                    Edit User
                                </Button>
                            )}
                        </form>
                    </Form>
                </CardContent>
                <CardFooter>
                    <FormError message={error} />
                    <FormSuccess message={success} />
                </CardFooter>
            </Card>

            {/* Permissions Card */}
            <AllPermissionsCardComponent user={user} />

            {/** Permission Sets Card */}
            <Card className="col-span-2">
                <CardHeader>
                    <CardTitle>Permission Sets</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {user.permissionSets.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {user.permissionSets.map((permissionSet) => (
                                    <Badge key={permissionSet} variant="primary">
                                        {permissionSet}
                                    </Badge>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500">No permission sets assigned</p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
