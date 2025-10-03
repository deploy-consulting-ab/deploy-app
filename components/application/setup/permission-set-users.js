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
import { addUserToPermissionSetAction, removeUserFromPermissionSetAction } from '@/actions/database/permission-set-actions';

export function PermissionSetUsers({ permissionSet }) {
    const router = useRouter();
    const [filter, setFilter] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const filteredUsers = permissionSet.users.filter((user) =>
        user.name?.toLowerCase().includes(filter.toLowerCase()) ||
        user.email.toLowerCase().includes(filter.toLowerCase())
    );

    const handleRemoveUser = async (userId) => {
        try {
            const result = await removeUserFromPermissionSetAction(permissionSet.id, userId);
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

    const handleAddUser = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const userId = formData.get('userId');

        try {
            const result = await addUserToPermissionSetAction(permissionSet.id, userId);
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
                    placeholder="Filter users..."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="max-w-sm"
                />
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>Add User</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add User to Permission Set</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleAddUser} className="space-y-4">
                            <Input
                                id="userId"
                                name="userId"
                                placeholder="Enter user ID"
                            />
                            <Button type="submit">Add User</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Employee Number</TableHead>
                            <TableHead className="w-[100px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredUsers.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.employeeNumber}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="ghost"
                                        className="h-8 w-8 p-0 text-red-600"
                                        onClick={() => handleRemoveUser(user.id)}
                                    >
                                        <span className="sr-only">Remove user</span>
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
                        {filteredUsers.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">
                                    No users found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
