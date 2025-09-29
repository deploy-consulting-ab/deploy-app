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

// Mock data - replace with real data later
const mockUser = {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    employeeNumber: 'EMP001',
    profile: 'Standard User',
    permissionSets: ['Sales User', 'Support Agent', 'Knowledge User'],
    permissions: [
        'View All Data',
        'Edit All Data',
        'Manage Users',
        'API Enabled',
        'Create Reports',
        'Export Reports',
        'Modify All Data',
        'Transfer Records',
        'Manage Dashboards',
        'Manage Public Reports',
        'View Setup',
        'Customize Application',
    ],
};

const mockProfiles = ['Standard User', 'System Administrator', 'Sales Manager', 'Support Manager'];

export function UserCardComponent({ user }) {
    const [isEditing, setIsEditing] = useState(false);
    const form = useForm({
        defaultValues: {
            employeeNumber: mockUser.employeeNumber,
            profile: mockUser.profile,
        },
    });

    const onSubmit = (data) => {
        console.log('Form submitted:', data);
        setIsEditing(false);
        // TODO: Implement actual update logic
    };

    return (
        <div className="grid grid-cols-2 gap-6">
            {/* User Details Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">{mockUser.name}</CardTitle>
                    <CardDescription>{mockUser.email}</CardDescription>
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
                                name="profile"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Profile</FormLabel>
                                        <Select
                                            disabled={!isEditing}
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a profile" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {mockProfiles.map((profile) => (
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

                            {/* Permission Sets */}
                            <div className="space-y-2">
                                <h3 className="text-sm font-medium">Assigned Permission Sets</h3>
                                {mockUser.permissionSets.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {mockUser.permissionSets.map((permSet) => (
                                            <Badge key={permSet} variant="secondary">
                                                {permSet}
                                            </Badge>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-500">No permission sets assigned</p>
                                    )}
                            </div>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter>
                    {/* Action Buttons */}
                    {isEditing ? (
                        <div className="flex gap-2">
                            <Button type="submit">Save Changes</Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsEditing(false)}
                            >
                                Cancel
                            </Button>
                        </div>
                    ) : (
                        <Button type="button" onClick={() => setIsEditing(true)}>
                            Edit User
                        </Button>
                    )}
                </CardFooter>
            </Card>

            {/* Permissions Card */}
            <Card>
                <CardHeader>
                    <CardTitle>All Permissions</CardTitle>
                    <CardDescription>
                        Combined permissions from Profile and Permission Sets
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 gap-2">
                        {mockUser.permissions.map((permission) => (
                            <Badge key={permission} variant="outline" className="justify-start">
                                {permission}
                            </Badge>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
