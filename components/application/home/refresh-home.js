'use server';

import { revalidatePath } from 'next/cache';

export async function refreshHome() {
    revalidatePath('/home');
}
