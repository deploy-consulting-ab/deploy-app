'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { updatePermissionSetAction } from '@/actions/database/permission-set-actions';

export function PermissionSetForm({ permissionSet }) {
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const description = formData.get('description');

        try {
            const result = await updatePermissionSetAction(permissionSet.id, {
                description,
            });

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
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={permissionSet.name} disabled />
            </div>
            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                    id="description"
                    name="description"
                    defaultValue={permissionSet.description}
                />
            </div>
            <Button type="submit">Save Changes</Button>
        </form>
    );
}
