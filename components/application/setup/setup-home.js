'use client';

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import { Users, Shield, UserCircle } from 'lucide-react';
import Link from 'next/link';
import { USERS_ROUTE, PROFILES_ROUTE, PERMISSIONS_ROUTE } from '@/menus/routes';

export function SetupHomeComponent() {
    // TODO: Replace with actual database queries
    const metrics = {
        activeUsers: 42,
        totalProfiles: 5,
        totalPermissions: 15,
    };

    return (
        <div className="space-y-8">
            {/* Introduction Section */}
            <div className="space-y-4">
                <h1 className="text-4xl font-bold">Setup & Configuration</h1>
                <p className="text-muted-foreground text-lg">
                    Welcome to the setup area. Here you can manage your organization&apos;s users,
                    profiles, and permissions. Use the cards below to navigate to different
                    configuration sections.
                </p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Active Users Card */}
                <Link href={USERS_ROUTE} className="block">
                    <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer">
                        <CardHeader className="space-y-1">
                            <div className="flex items-center space-x-2">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <Users className="h-4 w-4 text-primary" />
                                </div>
                                <CardTitle className="text-xl">Active Users</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{metrics.activeUsers}</div>
                            <CardDescription>Total active users in the system</CardDescription>
                        </CardContent>
                    </Card>
                </Link>

                {/* Profiles Card */}
                <Link href={PROFILES_ROUTE} className="block">
                    <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer">
                        <CardHeader className="space-y-1">
                            <div className="flex items-center space-x-2">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <UserCircle className="h-4 w-4 text-primary" />
                                </div>
                                <CardTitle className="text-xl">Profiles</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{metrics.totalProfiles}</div>
                            <CardDescription>User profiles configured</CardDescription>
                        </CardContent>
                    </Card>
                </Link>

                {/* Permissions Card */}
                <Link href={PERMISSIONS_ROUTE} className="block">
                    <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer">
                        <CardHeader className="space-y-1">
                            <div className="flex items-center space-x-2">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <Shield className="h-4 w-4 text-primary" />
                                </div>
                                <CardTitle className="text-xl">Permissions</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{metrics.totalPermissions}</div>
                            <CardDescription>Total system permissions</CardDescription>
                        </CardContent>
                    </Card>
                </Link>
            </div>
        </div>
    );
}
