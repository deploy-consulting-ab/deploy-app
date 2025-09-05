import { PrismaClient } from '@prisma/client';

export const db = globalThis.prisma || new PrismaClient();

// Avoid hotreload in Development, where everytime we save a new PrismaClient would be created and that
// would create too many instances
if (process.env.NODE_ENV !== 'production') {
    globalThis.prisma = db;
}
