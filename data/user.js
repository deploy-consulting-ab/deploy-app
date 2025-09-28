import { db } from '@/lib/db';
import { PROFILE_MAP } from '@/lib/permissions';

export const getUserByEmail = async (email) => {
    try {
        const existingUser = await db.user.findUnique({
            where: {
                email,
            },
        });
        return existingUser;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const getUserById = async (id) => {
    try {
        const existingUser = await db.user.findUnique({
            where: {
                id,
            },
        });
        return existingUser;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const createUser = async (data) => {
    try {
        const { name, email, hashedPassword, profile, employeeNumber } = data;
        const user = await db.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                employeeNumber: employeeNumber,
                profile: {
                    connect: {
                        id: PROFILE_MAP[profile],
                    },
                },
            },
        });

        return user;
    } catch (error) {
        console.error(error);
        return false;
    }
};

export async function getUsers() {
    try {
        const users = await db.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
            },
            orderBy: {
                name: 'asc',
            },
        });
        return users;
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function getCombinedPermissionsForUser(id) {
    // 1. Fetch the user and include their profile, permission sets,
    //    and all nested permissions in a single query.
    const userWithPermissions = await db.user.findUnique({
        where: { id },
        include: {
            profile: {
                include: {
                    permissions: true, // Get permissions from the profile
                },
            },
            permissionSets: {
                include: {
                    permissions: true, // Get permissions from all permission sets
                },
            },
        },
    });

    if (!userWithPermissions) {
        return []; // Return empty array if user not found
    }

    // 2. Extract permissions from the user's profile
    const profilePermissions = (userWithPermissions.profile?.permissions || []).map(
        (permission) => permission.name
    );

    // 3. Extract permissions from all assigned permission sets flatMap is used to merge the permissions from multiple sets into one array
    const permissionSetPermissions = userWithPermissions.permissionSets.flatMap((set) =>
        set.permissions.map((permission) => permission.name)
    );

    // 4. Combine both lists
    const allPermissions = [...profilePermissions, ...permissionSetPermissions];

    return allPermissions;

    // const allPermissionsMap = new Set(allPermissions);

    // return allPermissionsMap;
}
