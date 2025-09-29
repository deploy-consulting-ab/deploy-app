'use server';

import { UsersListComponent } from '@/components/application/setup/users/users-list';

const users = [
    {
        id: 'cmf2e9dsy0000v9ey5ssgehgy',
        name: 'John Doe',
        email: 'john.doe@example.com',
        profile: 'deploy_admin',
        employeeNumber: '333121',
    },
    {
        id: 'cmf2euf7i0002v9eyvklvk5ko',
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        profile: 'deploy_consultant',
        employeeNumber: '98923',
    },
    {
        id: 'cmf40bicv0000v9ydu1l9cbgh',
        name: 'Jim Doe',
        email: 'jim.doe@example.com',
        profile: 'deploy_sales',
        employeeNumber: '64672',
    },
    {
        id: 'cmf416l1r0002v9ydlbkootb0',
        name: 'Jill Doe',
        email: 'jill.doe@example.com',
        profile: 'deploy_management',
        employeeNumber: '63527',
    },
];

export default async function UsersPage() {
    return (
        <div className="py-4">
            <UsersListComponent users={users} />
        </div>
    );
}
