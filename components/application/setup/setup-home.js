'use server';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, UserCheck, Shield, UserCircle, Box } from 'lucide-react';
import Link from 'next/link';
import {
    USERS_ROUTE,
    PROFILES_ROUTE,
    SYSTEM_PERMISSIONS_ROUTE,
    PERMISSION_SETS_ROUTE,
} from '@/menus/routes';
import { ErrorDisplayComponent } from '@/components/errors/error-display';
import { MetricsCardComponent } from '@/components/application/metrics-card';

export async function SetupHomeComponent({ metrics, error }) {
    if (error) {
        return <ErrorDisplayComponent error={error} />;
    }

    return (
        <div className="space-y-8">
            {/* Introduction Section */}
            <div className="space-y-4">
                <h1 className="text-4xl font-bold">Setup & Configuration</h1>
                <p className="text-muted-foreground text-lg">
                    Welcome to the setup area. Here you can manage your organization&apos;s users,
                    profiles, and system permissions. Use the cards below to navigate to different
                    configuration sections.
                </p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total Users Card */}
                <MetricsCardComponent
                    metric={metrics.totalUsers}
                    linkRoute={USERS_ROUTE}
                    title="Total Users"
                    IconComponent={<Users className="h-4 w-4 text-primary" />}
                    description="Total users in the system"
                />

                {/* Active Users Card */}
                <MetricsCardComponent
                    metric={metrics.activeUsers}
                    linkRoute={USERS_ROUTE}
                    title="Active Users"
                    IconComponent={<UserCheck className="h-4 w-4 text-primary" />}
                    description="Total active users in the system"
                />

                {/* Profiles Card */}
                <MetricsCardComponent
                    metric={metrics.totalProfiles}
                    linkRoute={PROFILES_ROUTE}
                    title="Profiles"
                    IconComponent={<UserCircle className="h-4 w-4 text-primary" />}
                    description="Total user profiles in the system"
                />

                {/* System Permissions Card */}
                <MetricsCardComponent
                    metric={metrics.totalSystemPermissions}
                    linkRoute={SYSTEM_PERMISSIONS_ROUTE}
                    title="System Permissions"
                    IconComponent={<Shield className="h-4 w-4 text-primary" />}
                    description="Total system permissions in the system"
                />

                {/* Permission Sets Card */}
                <MetricsCardComponent
                    metric={metrics.totalPermissionSets}
                    linkRoute={PERMISSION_SETS_ROUTE}
                    title="Permission Sets"
                    IconComponent={<Box className="h-4 w-4 text-primary" />}
                    description="Total permission sets in the system"
                />
            </div>
        </div>
    );
}
