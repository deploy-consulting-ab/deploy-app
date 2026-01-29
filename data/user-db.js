import { db } from '@/lib/db';

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
        throw error;
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
        throw error;
    }
};

/**
 * Get a user by id with allPermissions for their profile and permission sets
 * @param {*} id
 * @returns {Promise<User>} User with allPermissions for their profile and permission sets
 */
export const getUserByIdWithSystemPermissions = async (id) => {
    try {
        const existingUser = await db.user.findUnique({
            where: { id },
            include: {
                profile: {
                    include: {
                        systemPermissions: true, // Get system permissions from the profile
                    },
                },
                permissionSets: {
                    include: {
                        systemPermissions: true, // Get system permissions from all permission sets
                    },
                },
            },
        });

        const allPermissions = [
            ...existingUser.profile.systemPermissions.map(
                (systemPermission) => systemPermission.name
            ),
            ...existingUser.permissionSets.flatMap((set) =>
                set.systemPermissions.map((systemPermission) => systemPermission.name)
            ),
        ];

        existingUser.allPermissions = new Set(allPermissions);
        return existingUser;
    } catch (error) {
        throw error;
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
                isActive: true,
                yearlyHolidays: true,
                carriedOverHolidays: true,
            },
            orderBy: [
                {
                    isActive: 'desc',
                },
                {
                    name: 'desc',
                },
            ],
        });
        return users;
    } catch (error) {
        throw error;
    }
}

/**
 * Get all system permissions for a user
 * @param {string} id
 * @returns {Promise<string[]>} All system permissions for the user
 * @throws {Error} If the system permissions are not found
 */
export async function getCombinedSystemPermissionsForUser(id) {
    try {
        // 1. Fetch the user and include their profile, permission sets,
        //    and all nested system permissions in a single query.
        const userWithPermissions = await db.user.findUnique({
            where: { id },
            include: {
                profile: {
                    include: {
                        systemPermissions: true, // Get system permissions from the profile
                    },
                },
                permissionSets: {
                    include: {
                        systemPermissions: true, // Get system permissions from all permission sets
                    },
                },
            },
        });

        if (!userWithPermissions) {
            return []; // Return empty array if user not found
        }

        // 2. Extract system permissions from the user's profile
        const profileSystemPermissions = (userWithPermissions.profile?.systemPermissions || []).map(
            (systemPermission) => systemPermission.name
        );

        // 3. Extract system permissions from all assigned permission sets flatMap is used to merge the system permissions from multiple sets into one array
        const permissionSetSystemPermissions = userWithPermissions.permissionSets.flatMap((set) =>
            set.systemPermissions.map((systemPermission) => systemPermission.name)
        );

        // 4. Combine both lists
        const allSystemPermissions = [
            ...profileSystemPermissions,
            ...permissionSetSystemPermissions,
        ];

        return allSystemPermissions;
    } catch (error) {
        throw error;
    }
}

/**
 * Get all users for a profile
 * @param {string} profileId
 * @returns {Promise<User[]>} All users for the profile
 * @throws {Error} If the users are not found
 */
export async function getUsersForProfile(profileId) {
    try {
        const users = await db.user.findMany({
            where: { profileId },
        });
        return users;
    } catch (error) {
        throw error;
    }
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
        const user = await db.user.create({
            data: data,
        });

        return user;
    } catch (error) {
        throw error;
    }
};

/**
 * UPDATE METHODS
 */

export const updateUser = async (id, data) => {
    try {
        await db.user.update({
            where: { id },
            data: data,
        });
    } catch (error) {
        throw error;
    }
};

/**
 * Update a user's profile
 * @param {string} userId - The ID of the user to update
 * @param {string} profileId - The ID of the profile to assign
 * @returns {Promise<User>} The updated user
 * @throws {Error} If the update fails
 */
export const updateUserProfile = async (userId, profileId) => {
    try {
        const updatedUser = await db.user.update({
            where: { id: userId },
            data: { profileId },
            select: {
                id: true,
                name: true,
                email: true,
                employeeNumber: true,
                profileId: true,
                yearlyHolidays: true,
                carriedOverHolidays: true,
            },
        });
        return updatedUser;
    } catch (error) {
        throw error;
    }
};

/**
 * SEARCH METHODS
 */

/**
 * Search users by name or email
 * @param {string} searchTerm
 * @returns {Promise<User[]>} Users matching the search term
 * @throws {Error} If the search fails
 */
export async function searchUsers(searchTerm) {
    try {
        const users = await db.user.findMany({
            where: {
                OR: [
                    { name: { contains: searchTerm, mode: 'insensitive' } },
                    { email: { contains: searchTerm, mode: 'insensitive' } },
                ],
            },
            select: {
                id: true,
                name: true,
                email: true,
                employeeNumber: true,
                profileId: true,
                yearlyHolidays: true,
                carriedOverHolidays: true,
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
 * Add a permission set to a user
 * @param {string} id
 * @param {string} permissionSetId
 * @returns {Promise<User>} The updated user
 * @throws {Error} If the update fails
 */
export async function addPermissionSetToUser(id, permissionSetId) {
    try {
        const user = await db.user.update({
            where: { id },
            data: { permissionSets: { connect: { id: permissionSetId } } },
        });
        return user;
    } catch (error) {
        throw error;
    }
}

/**
 * Remove a permission set from a user
 * @param {string} id
 * @param {string} permissionSetId
 * @returns {Promise<User>} The updated user
 * @throws {Error} If the update fails
 */
export async function removePermissionSetFromUser(id, permissionSetId) {
    try {
        const user = await db.user.update({
            where: { id },
            data: { permissionSets: { disconnect: { id: permissionSetId } } },
        });
        return user;
    } catch (error) {
        throw error;
    }
}

/**
 * DELETE METHODS
 */

/**
 * Delete a user
 * @param {string} id
 * @returns {Promise<User>} The deleted user
 * @throws {Error} If the user is not deleted
 */
export async function deleteUser(id) {
    try {
        await db.user.delete({ where: { id } });
    } catch (error) {
        throw error;
    }
}
