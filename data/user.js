import { db } from '@/lib/db';
import { PROFILE_MAP } from '@/lib/permissions';

/**
 * Get a user by email
 * @param {string} email
 * @returns {Promise<User>} User with allPermissions for their profile and permission sets
 * @throws {Error} If the user is not found
 */
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

/**
 * GET METHODS
 */

/**
 * Get a user by id
 * @param {string} id
 * @returns {Promise<User>} User with allPermissions for their profile and permission sets
 * @throws {Error} If the user is not found
 */
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

/**
 * Get a user by id with allPermissions for their profile and permission sets
 * @param {*} id
 * @returns {Promise<User>} User with allPermissions for their profile and permission sets
 */
export const getUserByIdWithPermissions = async (id) => {
    try {
        const existingUser = await db.user.findUnique({
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

        const allPermissions = [
            ...existingUser.profile.permissions.map((permission) => permission.name),
            ...existingUser.permissionSets.flatMap((set) =>
                set.permissions.map((permission) => permission.name)
            ),
        ];

        existingUser.allPermissions = new Set(allPermissions);
        return existingUser;
    } catch (error) {
        console.error(error);
        return null;
    }
};

/**
 * Get all users
 * @returns {Promise<User[]>} All users
 * @throws {Error} If the users are not found
 */
export async function getUsers() {
    try {
        const users = await db.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                employeeNumber: true,
                profileId: true,
            },
            orderBy: {
                name: 'asc',
            },
        });
        return users;
    } catch (error) {
        throw error;
    }
}

/**
 * Get all permissions for a user
 * @param {string} id
 * @returns {Promise<string[]>} All permissions for the user
 * @throws {Error} If the permissions are not found
 */
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
}

/**
 * CREATE METHODS
 */

/**
 * Create a user
 * @param {Object} data
 * @returns {Promise<User>} User created
 * @throws {Error} If the user is not created
 */
export const createUser = async (data) => {
    try {
        const { name, email, hashedPassword, profileId, employeeNumber } = data;
        const user = await db.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                employeeNumber: employeeNumber,
                profileId: profileId,
            },
        });

        return user;
    } catch (error) {
        console.error(error);
        return false;
    }
};

/**
 * UPDATE METHODS
 */

export const updateUser = async (id, data) => {
    try {
        const { name, email, employeeNumber, profileId } = data;
        await db.user.update({
            where: { id },
            data: { name, email, employeeNumber, profileId },
        });
    } catch (error) {
        throw error;
    }
};
