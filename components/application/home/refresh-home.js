'use server';

import { revalidatePath } from 'next/cache';
import { requireAuth } from '@/lib/require-auth';

export async function refreshHome() {
    await requireAuth();
    revalidatePath('/home');
}
