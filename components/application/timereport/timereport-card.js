'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { Clock, Save, RotateCcw, RefreshCw } from 'lucide-react';
import { createTimecard } from '@/actions/flex/flex-actions';
import { toastRichSuccess, toastRichError } from '@/lib/toast-library';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { WeekNavigation } from '@/components/application/timereport/week-navigation';
import { getWeekMonday, getUTCToday, formatDateToISOString } from '@/lib/utils';
import { ProjectSelectorComponent } from '@/components/application/timereport/project-selector';
import { HoursGridComponent } from '@/components/application/timereport/hours-grid';
import { Spinner } from '@/components/ui/spinner';

/**
 * Main time report card component.
 * Manages the state for week selection, project selection, and hour entries.
 */
export function TimereportCard({
    flexEmployeeId,
    initialProjects,
    initialTimereports,
    refreshProjectsAction,
    refreshTimereportsAction,
    initialError,
    holidays,
}) {
    // Get Monday of current week as default (use UTC for consistent timezone handling)
    const [selectedWeek, setSelectedWeek] = useState(() => getWeekMonday(getUTCToday()));

    // Assignments fetched from Salesforce based on selected week
    const [projects, setProjects] = useState(initialProjects || []);
    const [isLoadingProjects, setIsLoadingProjects] = useState(false);
    const [selectedProjects, setSelectedProjects] = useState(
        () => new Set(initialTimereports?.selectedProjects || [])
    );
    const [isLoadingTimereports, setIsLoadingTimereports] = useState(false);

    // Time data in the new format: [{ date, timeRows: [{ projectId, projectName, projectCode, hours }] }]
    const [timeData, setTimeData] = useState(initialTimereports?.timereportResponse || []);
    const [initialTimeData, setInitialTimeData] = useState(
        initialTimereports?.timereportResponse || []
    );

    // Update projects when initialProjects prop changes
    useEffect(() => {
        if (initialProjects) {
            setProjects(initialProjects);
        }
    }, [initialProjects]);

    // Update timereports when initialTimereports prop changes
    useEffect(() => {
        if (initialTimereports) {
            setTimeData(initialTimereports.timereportResponse || []);
            setInitialTimeData(initialTimereports.timereportResponse || []);
            setSelectedProjects(new Set(initialTimereports.selectedProjects || []));
        }
    }, [initialTimereports]);

    // Handle initial error
    useEffect(() => {
        if (initialError) {
            toastRichError({ message: 'Failed to load data for the selected week' });
        }
    }, [initialError]);

    // Check if the selected week is in the past (use UTC for consistent timezone handling)
    const isPastWeek = useMemo(() => {
        const currentWeekMonday = getWeekMonday(getUTCToday());
        const selectedWeekMonday = getWeekMonday(selectedWeek);
        return selectedWeekMonday.getTime() < currentWeekMonday.getTime();
    }, [selectedWeek]);

    // Track if there are unsaved changes
    const [hasChanges, setHasChanges] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    /**
     * Fetch projects for the given week using the server action
     */
    const refreshProjects = useCallback(async () => {
        setIsLoadingProjects(true);
        try {
            const weekStart = getWeekMonday(selectedWeek);
            const data = await refreshProjectsAction(weekStart.toISOString());
            setProjects(data || []);
        } catch (error) {
            console.error('Failed to fetch projects:', error);
            toastRichError({ message: 'Failed to load projects for the selected week' });
            setProjects([]);
        } finally {
            setIsLoadingProjects(false);
        }
    }, [refreshProjectsAction, selectedWeek]);

    /**
     * Fetch timereports for the given week using the server action
     */
    const refreshTimereports = useCallback(async () => {
        setIsLoadingTimereports(true);
        try {
            const weekStart = getWeekMonday(selectedWeek);
            const response = await refreshTimereportsAction(weekStart.toISOString());

            const timereportData = response.timereportResponse || [];
            setTimeData(timereportData);
            setInitialTimeData(JSON.parse(JSON.stringify(timereportData)));
            setSelectedProjects(new Set(response.selectedProjects || []));
            setHasChanges(false);
        } catch (error) {
            console.error('Failed to fetch timereports:', error);
            toastRichError({ message: 'Failed to load timereports for the selected week' });
            setTimeData([]);
            setInitialTimeData([]);
        } finally {
            setIsLoadingTimereports(false);
        }
    }, [refreshTimereportsAction, selectedWeek]);

    // Handle week change
    const handleWeekChange = useCallback((newWeek) => {
        setSelectedWeek(newWeek);
        // The selectedWeek change will trigger refetch via useEffect
    }, []);

    // Refetch when selectedWeek changes (after initial load)
    useEffect(() => {
        // Only refresh projects for current/future weeks, not past weeks
        if (!isPastWeek) {
            refreshProjects();
        }
        refreshTimereports();
    }, [selectedWeek]); // eslint-disable-line react-hooks/exhaustive-deps

    // Handle adding a project
    const handleAddProject = useCallback(
        (projectId) => {
            const project = projects.find((p) => p.flexId === projectId);
            if (!project) return;

            setSelectedProjects((prev) => new Set([...prev, projectId]));

            // Add empty entries for all 7 days with 0 hours (they'll be filtered out on save)
            // The grid component will handle displaying this project
            setHasChanges(true);
        },
        [projects]
    );

    // Handle removing a project
    const handleRemoveProject = useCallback((projectId) => {
        setSelectedProjects((prev) => {
            const next = new Set(prev);
            next.delete(projectId);
            return next;
        });
        setHasChanges(true);
    }, []);

    // Handle time data change from the grid
    const handleTimeDataChange = useCallback((updatedTimeData) => {
        setTimeData(updatedTimeData);

        // Add any new projects from timeData to selectedProjects, but don't remove existing ones
        // Projects should only be removed via the explicit remove button (handleRemoveProject)
        setSelectedProjects((prev) => {
            const next = new Set(prev);
            updatedTimeData.forEach((dayEntry) => {
                dayEntry.timeRows?.forEach((row) => {
                    next.add(row.projectId);
                });
            });
            return next;
        });
        setHasChanges(true);
    }, []);

    // Handle save
    const handleSave = async () => {
        setIsSaving(true);

        try {
            const timecard = {
                week: formatDateToISOString(selectedWeek),
                timeData: timeData,
            };
            await createTimecard(flexEmployeeId, timecard);
            toastRichSuccess({ message: 'Time report saved successfully' });

            // Re-fetch timereports to get the latest data from the server
            await refreshTimereports();
        } catch (error) {
            toastRichError({ message: error.message || 'Failed to save time report' });
        } finally {
            setIsSaving(false);
        }
    };

    // Handle reset
    const handleReset = useCallback(() => {
        setTimeData(JSON.parse(JSON.stringify(initialTimeData)));

        // Recalculate selectedProjects from initialTimeData
        const projectIds = new Set();
        initialTimeData.forEach((dayEntry) => {
            dayEntry.timeRows?.forEach((row) => {
                projectIds.add(row.projectId);
            });
        });
        setSelectedProjects(projectIds);
        setHasChanges(false);
    }, [initialTimeData]);

    // Calculate total hours for the week from timeData
    const weekTotal = useMemo(() => {
        return timeData.reduce((total, dayEntry) => {
            const dayTotal =
                dayEntry.timeRows?.reduce((sum, row) => sum + (row.hours || 0), 0) || 0;
            return total + dayTotal;
        }, 0);
    }, [timeData]);

    // Calculate unique projects count
    const projectCount = useMemo(() => {
        const projectIds = new Set();
        timeData.forEach((dayEntry) => {
            dayEntry.timeRows?.forEach((row) => {
                projectIds.add(row.projectId);
            });
        });
        return projectIds.size;
    }, [timeData]);

    return (
        <div className="space-y-4 md:space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold tracking-tight">Time Report</h1>
                    <p className="text-muted-foreground text-sm md:text-base mt-1">
                        Report your working hours for the week
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    {!isPastWeek && (
                        <>
                            {hasChanges && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleReset}
                                    className="gap-2"
                                >
                                    <RotateCcw className="h-4 w-4" />
                                    <span className="hidden sm:inline">Reset</span>
                                </Button>
                            )}

                            <Button
                                onClick={handleSave}
                                disabled={!hasChanges || isSaving}
                                size="sm"
                                className="gap-2"
                            >
                                <Save className="h-4 w-4" />
                                {isSaving ? (
                                    'Saving...'
                                ) : (
                                    <span className="hidden sm:inline">Save</span>
                                )}
                                {!isSaving && <span className="sm:hidden">Save</span>}
                            </Button>
                        </>
                    )}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={refreshTimereports}
                        disabled={isLoadingTimereports}
                        className={`md:hover:cursor-pointer ${
                            isLoadingTimereports ? 'animate-spin' : ''
                        }`}
                    >
                        <RefreshCw className="h-4 w-4 text-muted-foreground" />
                        <span className="sr-only">Refresh data</span>
                    </Button>
                </div>
            </div>

            {/* Week Navigation */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm md:text-base flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Select Week
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                    <WeekNavigation selectedWeek={selectedWeek} onWeekChange={handleWeekChange} />
                </CardContent>
            </Card>

            {/* Main time entry card */}
            <Card>
                <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                            <CardTitle className="text-sm md:text-base">Time Entries</CardTitle>
                            <CardDescription className="text-xs md:text-sm">
                                Add projects and enter your daily hours
                            </CardDescription>
                        </div>
                        {weekTotal > 0 && (
                            <div className="text-right shrink-0">
                                <p className="text-xl md:text-2xl font-bold text-primary">
                                    {weekTotal}h
                                </p>
                                <p className="text-[10px] md:text-xs text-muted-foreground">
                                    this week
                                </p>
                            </div>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Loading state */}

                    {/* Project Selector - only visible for current/future weeks */}
                    {!isPastWeek && (
                        <ProjectSelectorComponent
                            projects={projects}
                            selectedProjects={selectedProjects}
                            onAddProject={handleAddProject}
                        />
                    )}

                    {/* Hours Grid */}
                    {isLoadingProjects || isLoadingTimereports ? (
                        <div className="flex items-center justify-center py-8">
                            <Spinner size="lg" label="Loading..." />
                        </div>
                    ) : (
                        <HoursGridComponent
                            timeData={timeData}
                            selectedWeek={selectedWeek}
                            onTimeDataChange={handleTimeDataChange}
                            onRemoveProject={handleRemoveProject}
                            projects={projects}
                            selectedProjects={selectedProjects}
                            disabled={isPastWeek}
                            holidays={holidays}
                            isPastWeek={isPastWeek}
                        />
                    )}
                </CardContent>
            </Card>

            {/* Quick stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
                <Card size="sm">
                    <CardContent className="pt-3 md:pt-4 pb-3 md:pb-4">
                        <p className="text-[10px] md:text-xs text-muted-foreground">Total Hours</p>
                        <p className="text-lg md:text-xl font-bold tabular-nums">{weekTotal}h</p>
                    </CardContent>
                </Card>
                <Card size="sm">
                    <CardContent className="pt-3 md:pt-4 pb-3 md:pb-4">
                        <p className="text-[10px] md:text-xs text-muted-foreground">Projects</p>
                        <p className="text-lg md:text-xl font-bold tabular-nums">{projectCount}</p>
                    </CardContent>
                </Card>
                <Card size="sm">
                    <CardContent className="pt-3 md:pt-4 pb-3 md:pb-4">
                        <p className="text-[10px] md:text-xs text-muted-foreground">Avg per Day</p>
                        <p className="text-lg md:text-xl font-bold tabular-nums">
                            {weekTotal > 0 ? (weekTotal / 5).toFixed(1) : '0.0'}h
                        </p>
                    </CardContent>
                </Card>
                <Card size="sm">
                    <CardContent className="pt-3 md:pt-4 pb-3 md:pb-4">
                        <p className="text-[10px] md:text-xs text-muted-foreground">
                            Target Progress
                        </p>
                        <p className="text-lg md:text-xl font-bold tabular-nums">
                            {Math.min(100, Math.round((weekTotal / 40) * 100))}%
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
