'use client';

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from '@/components/auth/form/theme-provider';
import { SwipeBackProvider } from '@/components/navigation/swipe-back-provider';

export function AppProviders({ children, session }) {
    return (
        <SessionProvider session={session}>
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
                <SwipeBackProvider>
                    <div className="h-full bg-background">{children}</div>
                </SwipeBackProvider>
            </ThemeProvider>
        </SessionProvider>
    );
}
