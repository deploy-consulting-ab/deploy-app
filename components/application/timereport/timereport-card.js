'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { Clock, Save, RefreshCw, ExternalLink, CheckCircle, XCircle } from 'lucide-react';
import { createTimereport } from '@/actions/flex/flex-actions';
import { toastRichSuccess, toastRichError } from '@/lib/toast-library';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { WeekNavigation } from '@/components/application/timereport/week-navigation';
import {
    getWeekMonday,
    getWeekSunday,
    getUTCToday,
    formatDateToISOString,
    formatDateToSwedish,
} from '@/lib/utils';
import { ProjectSelectorComponent } from '@/components/application/timereport/project-selector';
import { HoursGridComponent } from '@/components/application/timereport/hours-grid';
import LoadingLogo from '@/components/application/loading-logo/loading-logo';
import { FLEX_TIMEREPORT_URL } from '@/actions/flex/constants';
import { postSlackTimereport } from '@/actions/slack/slack-actions';
import { AbsenceCardComponent } from '@/components/application/timereport/absence/absence-card';
import { AbsenceCardPhoneComponent } from '@/components/application/timereport/absence/absence-card-phone';

/**
 * Main time report card component.
 * Manages the state for week selection, project selection, and hour entries.
 */
export function TimereportCardComponent({
    employeeNumber,
    employeeName,
    flexEmployeeId,
    initialProjects,
    initialTimereports,
    refreshProjectsAction,
    refreshTimereportsAction,
    toggleCheckmarkAction,
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
            setIsCheckmarked(initialTimereports.isCheckmarked || false);
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
    const [isCheckmarked, setIsCheckmarked] = useState(initialTimereports?.isCheckmarked || false);
    const [isCopyingFromLastWeek, setIsCopyingFromLastWeek] = useState(false);

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
            setIsCheckmarked(response.isCheckmarked || false);
            setHasChanges(false);
        } catch (error) {
            console.error('Failed to fetch timereports:', error);
            toastRichError({ message: 'Failed to load timereports for the selected week' });
            setTimeData([]);
            setInitialTimeData([]);
            setIsCheckmarked(false);
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

    /**
     * Copy time entries from the previous week.
     * Fetches timereports for the week before the selected week and
     * adjusts dates to match the current selected week.
     * Preserves non-working time entries (absences/holidays) from the current week.
     * The copied data is NOT synced (initialTimeData remains empty).
     */
    const handleCopyFromLastWeek = useCallback(async () => {
        setIsCopyingFromLastWeek(true);
        try {
            // Calculate the previous week's Monday
            const previousWeekMonday = new Date(selectedWeek);
            previousWeekMonday.setUTCDate(previousWeekMonday.getUTCDate() - 7);

            // Fetch timereports for the previous week
            const response = await refreshTimereportsAction(previousWeekMonday.toISOString());
            const previousWeekData = response.timereportResponse || [];

            // Filter to only get working time entries from previous week
            const previousWeekWorkingTime = previousWeekData
                .map((dayEntry) => ({
                    ...dayEntry,
                    timeRows: dayEntry.timeRows?.filter((row) => row.isWorkingTime !== false) || [],
                }))
                .filter((dayEntry) => dayEntry.timeRows.length > 0);

            if (previousWeekWorkingTime.length === 0) {
                toastRichError({ message: 'No working time entries found in the previous week' });
                return;
            }

            // Extract current week's non-working time entries (absences/holidays) to preserve
            const currentWeekAbsences = timeData
                .map((dayEntry) => ({
                    ...dayEntry,
                    timeRows: dayEntry.timeRows?.filter((row) => row.isWorkingTime === false) || [],
                }))
                .filter((dayEntry) => dayEntry.timeRows.length > 0);

            // Adjust dates from previous week to current week
            const adjustedWorkingTimeData = previousWeekWorkingTime.map((dayEntry) => {
                // Extract date and calculate day of week (0=Mon, 1=Tue, ..., 6=Sun)
                const datePart = formatDateToISOString(dayEntry.date);
                const previousDate = new Date(datePart + 'T00:00:00Z');
                const dayOfWeek = (previousDate.getUTCDay() + 6) % 7;

                // Create the new date by adding the day offset to the current week's Monday
                const newDate = new Date(selectedWeek);
                newDate.setUTCDate(newDate.getUTCDate() + dayOfWeek);

                return {
                    ...dayEntry,
                    date: `${formatDateToISOString(newDate)}T00:00:00`,
                    timeRows: dayEntry.timeRows?.map((row) => ({
                        ...row,
                    })),
                };
            });

            // Merge adjusted working time with current absences
            const mergedTimeData = [...adjustedWorkingTimeData];

            currentWeekAbsences.forEach((absenceDay) => {
                const absenceDateStr = formatDateToISOString(absenceDay.date);
                const existingDayIndex = mergedTimeData.findIndex(
                    (day) => formatDateToISOString(day.date) === absenceDateStr
                );

                if (existingDayIndex >= 0) {
                    // Merge absence rows into existing day
                    mergedTimeData[existingDayIndex] = {
                        ...mergedTimeData[existingDayIndex],
                        timeRows: [
                            ...mergedTimeData[existingDayIndex].timeRows,
                            ...absenceDay.timeRows,
                        ],
                    };
                } else {
                    // Add the absence day as-is
                    mergedTimeData.push(absenceDay);
                }
            });

            // Set the merged time data (but NOT initialTimeData, so isSynced will be false)
            setTimeData(mergedTimeData);

            // Update selected projects with the project IDs from working time only
            const copiedProjectIds = new Set();
            adjustedWorkingTimeData.forEach((dayEntry) => {
                dayEntry.timeRows?.forEach((row) => {
                    if (row.isWorkingTime !== false) {
                        copiedProjectIds.add(row.projectId);
                    }
                });
            });
            setSelectedProjects(copiedProjectIds);

            // Mark as having changes since this data is not synced
            setHasChanges(true);

            toastRichSuccess({
                message: 'Time entries copied from last week',
                duration: 2000,
            });
        } catch (error) {
            console.error('Failed to copy from last week:', error);
            toastRichError({
                message: 'Failed to copy time entries from last week',
                duration: 2000,
            });
        } finally {
            setIsCopyingFromLastWeek(false);
        }
    }, [selectedWeek, refreshTimereportsAction, timeData]);

    // Handle save
    const handleSave = async () => {
        setIsSaving(true);

        try {
            const timecard = {
                week: formatDateToISOString(selectedWeek),
                timeData: timeData,
            };
            await createTimereport(flexEmployeeId, timecard);
            toastRichSuccess({ message: 'Time report saved successfully', duration: 2000 });

            // Re-fetch timereports to get the latest data from the server
            await refreshTimereports();
        } catch (error) {
            toastRichError({ message: error.message || 'Failed to save time report' });
        } finally {
            setIsSaving(false);
        }
    };

    // Handle checkmark toggle
    const handleToggleCheckmark = useCallback(async () => {
        try {
            const weekStart = getWeekMonday(selectedWeek);
            const newCheckmarkValue = await toggleCheckmarkAction(
                weekStart.toISOString(),
                isCheckmarked
            );
            setIsCheckmarked(newCheckmarkValue);

            const weekStartDate = formatDateToSwedish(weekStart);
            const weekEndDate = formatDateToSwedish(getWeekSunday(weekStart));
            if (newCheckmarkValue) {
                await postSlackTimereport(
                    employeeName,
                    employeeNumber,
                    weekStartDate,
                    weekEndDate,
                    'has checkmarked the hours for the week'
                );
                toastRichSuccess({
                    message: 'Hours checkmarked successfully',
                    duration: 2000,
                });
            } else {
                await postSlackTimereport(
                    employeeName,
                    employeeNumber,
                    weekStartDate,
                    weekEndDate,
                    'has removed the checkmark for the hours'
                );
                toastRichSuccess({ message: 'Checkmark removed successfully', duration: 2000 });
            }
        } catch (error) {
            toastRichError({
                message: error.message || 'Failed to update checkmark status',
                duration: 2000,
            });
        }
    }, [isCheckmarked, selectedWeek, toggleCheckmarkAction, employeeName, employeeNumber]);

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

    // Check if there are any working time projects in timeData (not absences)
    const hasWorkingTimeProjects = useMemo(() => {
        return timeData.some((dayEntry) =>
            dayEntry.timeRows?.some((row) => row.isWorkingTime !== false)
        );
    }, [timeData]);

    return (
        <div className="space-y-4 md:space-y-6">
            {/* Header - Desktop only */}
            <div className="hidden sm:flex flex-row items-center justify-between">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold tracking-tight">Time Report</h1>
                    <p className="text-muted-foreground text-sm md:text-base mt-1">
                        Report your working hours for the week
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                        <AbsenceCardComponent employmentNumber={employeeNumber} />
                    </div>
                    <a
                        href={FLEX_TIMEREPORT_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring hover:bg-accent hover:text-accent-foreground h-9 px-3"
                    >
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Flex</span>
                    </a>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={refreshTimereports}
                        disabled={isLoadingTimereports}
                        className={`hover:cursor-pointer ${
                            isLoadingTimereports ? 'animate-spin' : ''
                        }`}
                    >
                        <RefreshCw className="h-4 w-4 text-muted-foreground" />
                        <span className="sr-only">Refresh data</span>
                    </Button>
                </div>
            </div>

            {/* Header - Mobile only */}
            <div className="flex sm:hidden items-center justify-end">
                <AbsenceCardPhoneComponent employmentNumber={employeeNumber} />
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
                    {/* Hours Grid */}
                    <div className="relative">
                        {/* Loading Logo Overlay */}
                        <div
                            className={`absolute inset-0 flex items-center justify-center z-10 transition-opacity duration-300 ease-in-out ${
                                isSaving ? 'opacity-100' : 'opacity-0 pointer-events-none'
                            }`}
                        >
                            <div className="[&>div]:h-auto [&>div]:min-h-0 [&>div]:p-0">
                                <LoadingLogo className="h-12 w-auto" />
                            </div>
                        </div>

                        {/* Empty state - rendered separately to maintain consistent sizing during loading */}
                        {!isPastWeek && selectedProjects.size === 0 && !hasWorkingTimeProjects && (
                            <div
                                className={`transition-opacity duration-300 ease-in-out ${
                                    isLoadingProjects || isLoadingTimereports
                                        ? 'opacity-0'
                                        : 'opacity-100'
                                }`}
                            >
                                <ProjectSelectorComponent
                                    projects={projects}
                                    selectedProjects={selectedProjects}
                                    onAddProject={handleAddProject}
                                    onCopyFromLastWeek={handleCopyFromLastWeek}
                                    isCopyingFromLastWeek={isCopyingFromLastWeek}
                                />
                            </div>
                        )}

                        {/* Grid Content - fades in as logo fades out */}
                        <div
                            className={`transition-opacity duration-300 ease-in-out ${
                                isLoadingProjects || isLoadingTimereports || isSaving
                                    ? 'opacity-0'
                                    : 'opacity-100'
                            }`}
                        >
                            <HoursGridComponent
                                timeData={timeData}
                                initialTimeData={initialTimeData}
                                selectedWeek={selectedWeek}
                                onTimeDataChange={handleTimeDataChange}
                                onRemoveProject={handleRemoveProject}
                                onAddProject={handleAddProject}
                                projects={projects}
                                selectedProjects={selectedProjects}
                                disabled={isPastWeek || isCheckmarked}
                                holidays={holidays}
                                isPastWeek={isPastWeek}
                                hasChanges={hasChanges}
                                isSaving={isSaving}
                                onSave={handleSave}
                                isCheckmarked={isCheckmarked}
                                onToggleCheckmark={handleToggleCheckmark}
                            />
                        </div>
                    </div>
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

            {/* Spacer to prevent content from being hidden behind the fixed bottom bar on mobile */}
            {!isPastWeek && <div className="h-20 md:hidden" />}

            {/* Mobile bottom action bar - fixed at the bottom for easy thumb access */}
            {!isPastWeek && (
                <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/95 backdrop-blur-sm border-t border-border px-4 py-3 safe-area-pb">
                    <div className="flex items-center justify-center gap-2 max-w-md mx-auto">
                        <Button
                            onClick={handleSave}
                            disabled={!hasChanges || isSaving || isCheckmarked}
                            size="lg"
                            className="flex-1 gap-2"
                        >
                            <Save className="h-5 w-5" />
                            {isSaving ? 'Saving...' : 'Save'}
                        </Button>
                        <Button
                            variant={isCheckmarked ? 'destructive' : 'default'}
                            size="lg"
                            onClick={handleToggleCheckmark}
                            className="gap-2"
                        >
                            {isCheckmarked ? (
                                <>
                                    <XCircle className="h-5 w-5" />
                                    Uncheckmark
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="h-5 w-5" />
                                    Checkmark
                                </>
                            )}
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            onClick={refreshTimereports}
                            disabled={isLoadingTimereports}
                            className="gap-2"
                        >
                            <RefreshCw
                                className={`h-5 w-5 ${isLoadingTimereports ? 'animate-spin' : ''}`}
                            />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
