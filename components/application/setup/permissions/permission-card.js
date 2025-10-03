'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FormError } from '@/components/auth/form/form-error';
import { FormSuccess } from '@/components/auth/form/form-success';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { PermissionAssignmentsListComponent } from '@/components/application/setup/permissions/permission-assignments-list';

export function PermissionCardComponent({ permission }) {

    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isVisible, setIsVisible] = useState(false);

    const form = useForm({
        defaultValues: {
            description: permission.description,
        },
    });

    return (
        <div className="grid grid-cols-1 gap-6">
            {/* User Details Card */}
            <Card className="col-span-1 py-4 h-fit">
                <CardHeader>
                    <CardTitle className="text-2xl">{permission.name}</CardTitle>
                    <CardDescription className="text-base">{permission.id}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <Form {...form}>
                        <form className="space-y-4">
                            {/* Profile Description */}
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Permission Description</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                disabled={!isEditing}
                                                placeholder="Enter permission description"
                                            />
                                        </FormControl>
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
                                    Edit Permission
                                </Button>
                            )}
                        </form>
                    </Form>
                </CardContent>
                <CardFooter>
                    <FormError message={error} />
                    <div
                        className={`transition-opacity duration-500 ease-in-out ${
                            isVisible ? 'opacity-100' : 'opacity-0'
                        }`}
                    >
                        <FormSuccess message={success} />
                    </div>
                </CardFooter>
            </Card>
            
            {/** Add a datatable displaying all the users in the permission, add an action button to add a new user to the permission*/}
            <div className="col-span-2">
                <PermissionAssignmentsListComponent profileAssignments={permission.profiles} permissionAssignments={permission.assignments} />
            </div>
        </div>
    );
}