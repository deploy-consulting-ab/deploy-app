'use client';

import { Card } from '@/components/ui/card';
import { ModernMetricCard } from './modern-metric-card';
import { ProgressRing } from './progress-ring';
import { ActivityCalendar } from './activity-calendar';
import { MiniLineChart, MiniBarChart } from './mini-chart';
import { Calendar, TrendingUp, Users, Briefcase, Clock, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ModernAdminHome({
    holidays,
    occupancyRates,
    assignmentsMetrics,
    userName = 'User',
}) {
    // Process data for visualizations
    const activeAssignments = assignmentsMetrics?.find((m) => m.status === 'Active')?.count || 0;
    const proposedAssignments =
        assignmentsMetrics?.find((m) => m.status === 'Proposed')?.count || 0;
    const closedAssignments = assignmentsMetrics?.find((m) => m.status === 'Closed')?.count || 0;

    // Mock data for charts (you can replace with real data)
    const weeklyOccupancy = [75, 82, 88, 85, 90, 87, 92];
    const weeklyAssignments = [3, 4, 4, 5, 6, 5, 5];

    // Calculate occupancy percentage
    const currentOccupancy = occupancyRates?.[0]?.occupancyRate || 0;
    const occupancyPercentage = Math.round(currentOccupancy * 100);

    // Get upcoming holidays
    const upcomingHolidays = Array.isArray(holidays) ? holidays.slice(0, 3) : [];

    // Calculate active days (days with work)
    const activeDaysThisMonth = [
        1, 2, 3, 4, 5, 8, 9, 10, 11, 12, 15, 16, 17, 18, 19, 22, 23, 24, 25, 26, 29, 30,
    ];

    return (
        <div className="min-h-screen p-6 space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Hello, {userName}!</h1>
                    <p className="text-muted-foreground mt-1">Ready for today's challenges?</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content - Left Side */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Business Activity Section */}
                    <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-foreground">
                                Business Activity
                            </h2>
                            <select className="bg-background border border-border rounded-lg px-3 py-1 text-sm">
                                <option>This Week</option>
                                <option>This Month</option>
                                <option>This Quarter</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-3 gap-6">
                            {/* Assignments Metric */}
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="h-20 w-full">
                                        <MiniLineChart
                                            data={weeklyAssignments}
                                            color="var(--accent-yellow)"
                                        />
                                    </div>
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-sm text-muted-foreground">Active</span>
                                    <div className="h-2 w-2 rounded-full bg-[var(--accent-yellow)]" />
                                </div>
                                <div className="space-y-1">
                                    <div className="text-3xl font-bold text-foreground">
                                        {activeAssignments}
                                    </div>
                                    <div className="text-xs text-muted-foreground space-y-0.5">
                                        <div>Goal: 10</div>
                                        <div>Average: 7</div>
                                    </div>
                                </div>
                            </div>

                            {/* Occupancy Rate */}
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="h-20 w-full">
                                        <MiniLineChart
                                            data={weeklyOccupancy}
                                            color="var(--accent-orange)"
                                        />
                                    </div>
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-sm text-muted-foreground">Occupancy</span>
                                    <div className="h-2 w-2 rounded-full bg-[var(--accent-orange)]" />
                                </div>
                                <div className="space-y-1">
                                    <div className="text-3xl font-bold text-foreground">
                                        {occupancyPercentage}%
                                    </div>
                                    <div className="text-xs text-muted-foreground space-y-0.5">
                                        <div>Goal: 90%</div>
                                        <div>Average: 85%</div>
                                    </div>
                                </div>
                            </div>

                            {/* Work Time */}
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="h-20 w-full">
                                        <MiniLineChart
                                            data={[35, 38, 40, 42, 40, 38, 40]}
                                            color="var(--accent-blue-bright)"
                                        />
                                    </div>
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-sm text-muted-foreground">
                                        Weekly Hours
                                    </span>
                                    <div className="h-2 w-2 rounded-full bg-[var(--accent-blue-bright)]" />
                                </div>
                                <div className="space-y-1">
                                    <div className="text-3xl font-bold text-foreground">40h</div>
                                    <div className="text-xs text-muted-foreground space-y-0.5">
                                        <div>Goal: 40h</div>
                                        <div>Average: 38h</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Secondary Metrics */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Capacity Card */}
                        <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
                            <h3 className="text-sm font-medium text-muted-foreground mb-4">
                                Team Capacity
                            </h3>
                            <div className="flex items-center justify-center py-4">
                                <ProgressRing
                                    progress={occupancyPercentage}
                                    size={100}
                                    color="var(--accent-lime)"
                                >
                                    <div className="text-center">
                                        <div className="text-2xl font-bold">
                                            {occupancyPercentage}%
                                        </div>
                                    </div>
                                </ProgressRing>
                            </div>
                            <p className="text-xs text-muted-foreground text-center mt-4">
                                Target is 90% utilization
                            </p>
                        </Card>

                        {/* Assignments Progress */}
                        <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-medium text-muted-foreground">
                                    Assignments Progress
                                </h3>
                                <span className="text-xs font-medium text-[var(--accent-lime)]">
                                    {Math.round(
                                        (closedAssignments /
                                            (activeAssignments +
                                                proposedAssignments +
                                                closedAssignments || 1)) *
                                            100
                                    )}
                                    % completed
                                </span>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span>Active</span>
                                    <span className="font-bold">{activeAssignments}</span>
                                </div>
                                <div className="h-2 bg-muted rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-[var(--accent-yellow)] to-[var(--accent-lime)] transition-all duration-500"
                                        style={{ width: `${(activeAssignments / 20) * 100}%` }}
                                    />
                                </div>

                                <div className="flex items-center justify-between text-sm pt-2">
                                    <span>Proposed</span>
                                    <span className="font-bold">{proposedAssignments}</span>
                                </div>
                                <div className="h-2 bg-muted rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-[var(--accent-orange)] to-[var(--accent-yellow)] transition-all duration-500"
                                        style={{ width: `${(proposedAssignments / 20) * 100}%` }}
                                    />
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-3 gap-4">
                        {assignmentsMetrics?.map((metric, index) => {
                            const colors = [
                                'from-blue-500 to-cyan-500',
                                'from-purple-500 to-pink-500',
                                'from-orange-500 to-red-500',
                                'from-green-500 to-emerald-500',
                            ];

                            return (
                                <Card
                                    key={metric.status}
                                    className="p-4 bg-card/50 backdrop-blur border-border/50 hover:shadow-lg transition-all cursor-pointer group"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <Briefcase className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                                        <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-[var(--accent-lime)] transition-colors" />
                                    </div>
                                    <div className="text-2xl font-bold mb-1">{metric.count}</div>
                                    <div className="text-sm text-muted-foreground">
                                        {metric.status}
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="space-y-6">
                    <ActivityCalendar activeDays={activeDaysThisMonth} currentMonth="January" />

                    {/* Upcoming Holidays */}
                    <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            Upcoming Time Off
                        </h3>
                        <div className="space-y-3">
                            {upcomingHolidays.length > 0 ? (
                                upcomingHolidays.map((holiday, index) => (
                                    <div
                                        key={index}
                                        className="p-3 rounded-lg bg-background/50 border border-border/50 hover:border-border transition-colors"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <div className="font-medium text-sm">
                                                    {holiday.type || 'Holiday'}
                                                </div>
                                                <div className="text-xs text-muted-foreground mt-1">
                                                    {holiday.startDate &&
                                                        new Date(
                                                            holiday.startDate
                                                        ).toLocaleDateString()}
                                                </div>
                                            </div>
                                            <div className="text-xs font-medium text-[var(--accent-lime)]">
                                                {holiday.days || 1} day
                                                {holiday.days !== 1 ? 's' : ''}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-sm text-muted-foreground text-center py-4">
                                    No upcoming time off scheduled
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Quick Actions */}
                    <Card className="p-6 bg-gradient-to-br from-[var(--accent-yellow)] to-[var(--accent-orange)] border-0 text-gray-900">
                        <h3 className="text-lg font-bold mb-2">Need help?</h3>
                        <p className="text-sm mb-4 opacity-90">
                            Access resources and support anytime
                        </p>
                        <button className="w-full bg-white/90 hover:bg-white text-gray-900 font-medium py-2 px-4 rounded-lg transition-all">
                            View Resources
                        </button>
                    </Card>
                </div>
            </div>
        </div>
    );
}
