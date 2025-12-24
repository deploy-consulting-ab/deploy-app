'use client';

import { useState, useCallback, useMemo } from 'react';
import { Clock, Save, RotateCcw } from 'lucide-react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardAction,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { WeekNavigation, getWeekMonday } from './week-navigation';
import { ProjectSelector } from './project-selector';
import { HoursGrid } from './hours-grid';

/**
 * Main time report card component.
 * Manages the state for week selection, project selection, and hour entries.
 */
export function TimereportCard({ projects, existingEntries, userName }) {
    // Get Monday of current week as default
    const [selectedWeek, setSelectedWeek] = useState(() => getWeekMonday(new Date()));

    // Track selected projects for the current week
    const [selectedProjects, setSelectedProjects] = useState(() => {
        // Initialize with projects from existing entries for the current week
        const weekKey = getWeekMonday(new Date()).toISOString().split('T')[0];
        const weekEntries = existingEntries?.[weekKey] || {};
        return Object.keys(weekEntries);
    });

    // Track hours per project per day
    const [hours, setHours] = useState(() => {
        // Initialize with existing entries
        const weekKey = getWeekMonday(new Date()).toISOString().split('T')[0];
        return existingEntries?.[weekKey] || {};
    });

    // Track if there are unsaved changes
    const [hasChanges, setHasChanges] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Handle week change
    const handleWeekChange = useCallback(
        (newWeek) => {
            setSelectedWeek(newWeek);

            // Load entries for the new week
            const weekKey = newWeek.toISOString().split('T')[0];
            const weekEntries = existingEntries?.[weekKey] || {};

            setHours(weekEntries);
            setSelectedProjects(Object.keys(weekEntries));
            setHasChanges(false);
        },
        [existingEntries]
    );

    // Handle adding a project
    const handleAddProject = useCallback((projectId) => {
        setSelectedProjects((prev) => [...prev, projectId]);
        setHours((prev) => ({
            ...prev,
            [projectId]: [0, 0, 0, 0, 0, 0, 0],
        }));
        setHasChanges(true);
    }, []);

    // Handle removing a project
    const handleRemoveProject = useCallback((projectId) => {
        setSelectedProjects((prev) => prev.filter((id) => id !== projectId));
        setHours((prev) => {
            const newHours = { ...prev };
            delete newHours[projectId];
            return newHours;
        });
        setHasChanges(true);
    }, []);

    // Handle hours change
    const handleHoursChange = useCallback((projectId, dayIndex, value) => {
        setHours((prev) => ({
            ...prev,
            [projectId]:
                prev[projectId]?.map((h, i) => (i === dayIndex ? value : h)) ||
                Array.from({ length: 7 }, (_, i) => (i === dayIndex ? value : 0)),
        }));
        setHasChanges(true);
    }, []);

    // Handle save
    const handleSave = async () => {
        setIsSaving(true);

        // Simulate save delay - replace with actual API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        console.log('Saving time entries:', {
            week: selectedWeek.toISOString().split('T')[0],
            entries: hours,
        });

        setIsSaving(false);
        setHasChanges(false);
    };

    // Handle reset
    const handleReset = useCallback(() => {
        const weekKey = selectedWeek.toISOString().split('T')[0];
        const weekEntries = existingEntries?.[weekKey] || {};

        setHours(weekEntries);
        setSelectedProjects(Object.keys(weekEntries));
        setHasChanges(false);
    }, [selectedWeek, existingEntries]);

    // Calculate total hours for the week
    const weekTotal = useMemo(() => {
        return Object.values(hours).reduce((total, projectHours) => {
            return total + (projectHours?.reduce((sum, h) => sum + h, 0) || 0);
        }, 0);
    }, [hours]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Time Report</h1>
                    <p className="text-muted-foreground mt-1">
                        Report your working hours for the week
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    {hasChanges && (
                        <Button variant="outline" size="sm" onClick={handleReset} className="gap-2">
                            <RotateCcw className="h-4 w-4" />
                            Reset
                        </Button>
                    )}
                    <Button
                        onClick={handleSave}
                        disabled={!hasChanges || isSaving}
                        className="gap-2"
                    >
                        <Save className="h-4 w-4" />
                        {isSaving ? 'Saving...' : 'Save Time Report'}
                    </Button>
                </div>
            </div>

            {/* Week Navigation */}
            <Card>
                <CardHeader className="pb-4">
                    <CardTitle className="text-base flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Select Week
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <WeekNavigation selectedWeek={selectedWeek} onWeekChange={handleWeekChange} />
                </CardContent>
            </Card>

            {/* Main time entry card */}
            <Card>
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <div>
                            <CardTitle className="text-base">Time Entries</CardTitle>
                            <CardDescription>
                                Add projects and enter your daily hours
                            </CardDescription>
                        </div>
                        {weekTotal > 0 && (
                            <div className="text-right">
                                <p className="text-2xl font-bold text-primary">{weekTotal}h</p>
                                <p className="text-xs text-muted-foreground">this week</p>
                            </div>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Project Selector */}
                    <ProjectSelector
                        projects={projects}
                        selectedProjects={selectedProjects}
                        onAddProject={handleAddProject}
                    />

                    {/* Hours Grid */}
                    <HoursGrid
                        projects={projects}
                        selectedProjects={selectedProjects}
                        hours={hours}
                        onHoursChange={handleHoursChange}
                        onRemoveProject={handleRemoveProject}
                        selectedWeek={selectedWeek}
                    />
                </CardContent>
            </Card>

            {/* Quick stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card size="sm">
                    <CardContent className="pt-4">
                        <p className="text-xs text-muted-foreground">Total Hours</p>
                        <p className="text-xl font-bold tabular-nums">{weekTotal}h</p>
                    </CardContent>
                </Card>
                <Card size="sm">
                    <CardContent className="pt-4">
                        <p className="text-xs text-muted-foreground">Projects</p>
                        <p className="text-xl font-bold tabular-nums">{selectedProjects.length}</p>
                    </CardContent>
                </Card>
                <Card size="sm">
                    <CardContent className="pt-4">
                        <p className="text-xs text-muted-foreground">Avg per Day</p>
                        <p className="text-xl font-bold tabular-nums">
                            {weekTotal > 0 ? (weekTotal / 5).toFixed(1) : '0.0'}h
                        </p>
                    </CardContent>
                </Card>
                <Card size="sm">
                    <CardContent className="pt-4">
                        <p className="text-xs text-muted-foreground">Target Progress</p>
                        <p className="text-xl font-bold tabular-nums">
                            {Math.min(100, Math.round((weekTotal / 40) * 100))}%
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
