'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { addPermissionToPermissionSetAction, removePermissionFromPermissionSetAction } from '@/actions/database/permission-set-actions';

export function PermissionSetPermissions({ permissionSet }) {
    const router = useRouter();
    const [filter, setFilter] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const filteredPermissions = permissionSet.permissions.filter((permission) =>
        permission.name.toLowerCase().includes(filter.toLowerCase())
    );

    const handleRemovePermission = async (permissionId) => {
        try {
            const result = await removePermissionFromPermissionSetAction(permissionSet.id, permissionId);
            if (result.error) {
                toast.error(result.error);
                return;
            }
            toast.success(result.success);
            router.refresh();
        } catch (error) {
            toast.error('Something went wrong');
        }
    };

    const handleAddPermission = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const permissionId = formData.get('permissionId');

        try {
            const result = await addPermissionToPermissionSetAction(permissionSet.id, permissionId);
            if (result.error) {
                toast.error(result.error);
                return;
            }
            toast.success(result.success);
            setIsDialogOpen(false);
            router.refresh();
        } catch (error) {
            toast.error('Something went wrong');
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <Input
                    placeholder="Filter permissions..."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="max-w-sm"
                />
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>Add Permission</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add Permission to Permission Set</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleAddPermission} className="space-y-4">
                            <Input
                                id="permissionId"
                                name="permissionId"
                                placeholder="Enter permission ID"
                            />
                            <Button type="submit">Add Permission</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="w-[100px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredPermissions.map((permission) => (
                            <TableRow key={permission.id}>
                                <TableCell>{permission.name}</TableCell>
                                <TableCell>{permission.description}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="ghost"
                                        className="h-8 w-8 p-0 text-red-600"
                                        onClick={() => handleRemovePermission(permission.id)}
                                    >
                                        <span className="sr-only">Remove permission</span>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="h-4 w-4"
                                        >
                                            <path d="M3 6h18" />
                                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                        </svg>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {filteredPermissions.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={3} className="h-24 text-center">
                                    No permissions found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
