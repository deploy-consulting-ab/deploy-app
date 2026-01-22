'use client';

import { Briefcase, Copy } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

/**
 * Empty state component shown when no projects are selected.
 * Displays a message and buttons to add the first project.
 */
export function ProjectSelectorComponent({
    projects,
    onAddProject,
    onCopyFromLastWeek,
    isCopyingFromLastWeek = false,
}) {
    const handleProjectSelect = (projectId) => {
        if (projectId) {
            onAddProject(projectId);
        }
    };

    console.log('#### projects', projects);

    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-muted/30 rounded-lg border border-dashed border-border">
            <div className="flex items-center gap-3 flex-1">
                <Briefcase className="h-5 w-5 text-muted-foreground shrink-0" />
                <div className="min-w-0">
                    <p className="text-sm font-medium">No projects added</p>
                    <p className="text-xs text-muted-foreground">
                        Select a project to start logging hours
                    </p>
                </div>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                {onCopyFromLastWeek && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onCopyFromLastWeek}
                        disabled={isCopyingFromLastWeek}
                        className="gap-2 hover:cursor-pointer"
                    >
                        <Copy className="h-4 w-4" />
                        {isCopyingFromLastWeek ? 'Copying...' : 'Copy from last week'}
                    </Button>
                )}
                <Select onValueChange={handleProjectSelect}>
                    <SelectTrigger className="w-full sm:w-[200px]">
                        <SelectValue placeholder="Add project" />
                    </SelectTrigger>
                    <SelectContent>
                        {projects.map((project) => (
                            <SelectItem key={project.flexId} value={project.flexId}>
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-2 h-2 rounded-full shrink-0"
                                        style={{ backgroundColor: project.color }}
                                    />
                                    <span className="truncate">{project.name}</span>
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
