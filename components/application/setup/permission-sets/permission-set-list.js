'use client';

import { useState } from 'react';
import Link from 'next/link';
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
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { deletePermissionSetAction } from '@/actions/database/permission-set-actions';

export function PermissionSetList({ permissionSets }) {
    const router = useRouter();
    const [filter, setFilter] = useState('');

    const filteredPermissionSets = permissionSets.filter((permissionSet) =>
        permissionSet.name.toLowerCase().includes(filter.toLowerCase())
    );

    const handleDelete = async (id) => {
        try {
            const result = await deletePermissionSetAction(id);
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

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <Input
                    placeholder="Filter permission sets..."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="max-w-sm"
                />
                <Button asChild>
                    <Link href="/setup/permission-sets/new">New Permission Set</Link>
                </Button>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Users</TableHead>
                            <TableHead>Permissions</TableHead>
                            <TableHead className="w-[50px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredPermissionSets.map((permissionSet) => (
                            <TableRow key={permissionSet.id}>
                                <TableCell>
                                    <Link
                                        href={`/setup/permission-sets/${permissionSet.id}`}
                                        className="text-blue-600 hover:underline"
                                    >
                                        {permissionSet.name}
                                    </Link>
                                </TableCell>
                                <TableCell>{permissionSet.description}</TableCell>
                                <TableCell>{permissionSet.users.length}</TableCell>
                                <TableCell>{permissionSet.permissions.length}</TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <span className="sr-only">Open menu</span>
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
                                                    <circle cx="12" cy="12" r="1" />
                                                    <circle cx="12" cy="5" r="1" />
                                                    <circle cx="12" cy="19" r="1" />
                                                </svg>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem
                                                onClick={() => handleDelete(permissionSet.id)}
                                                className="text-red-600"
                                            >
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                        {filteredPermissionSets.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    No permission sets found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
