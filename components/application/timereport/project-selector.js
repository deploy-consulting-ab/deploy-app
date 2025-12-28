'use client';

import { Plus, Briefcase } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

/**
 * Minimal project selector for adding projects to time report.
 */
export function ProjectSelectorComponent({ projects, selectedProjects, onAddProject }) {
    // Filter out already selected projects
    const availableProjects = projects.filter((p) => !selectedProjects.has(p.flexId));

    const handleProjectSelect = (projectId) => {
        if (projectId && !selectedProjects.has(projectId)) {
            onAddProject(projectId);
        }
    };

    // All projects selected
    if (availableProjects.length === 0 && selectedProjects.size > 0) {
        return null;
    }

    // Empty state - no projects selected yet
    if (selectedProjects.size === 0) {
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
        );
    }

    // Compact add button when projects are already selected
    return (
        <div className="flex items-center gap-2">
            <Select onValueChange={handleProjectSelect}>
                <SelectTrigger className="w-full sm:w-auto gap-2 border-dashed hover:cursor-pointer">
                    <Plus className="h-4 w-4" />
                    <span className="text-muted-foreground">Add project</span>
                </SelectTrigger>
                <SelectContent>
                    {availableProjects.map((project) => (
                        <SelectItem key={project.flexId} value={project.flexId} className="hover:cursor-pointer">
                            <div className="flex items-center gap-2">
                                <div
                                    className="w-2 h-2 rounded-full shrink-0"
                                    style={{ backgroundColor: project.color }}
                                />
                                <span className="truncate">{project.name}</span>
                                <span className="text-muted-foreground text-xs hidden sm:inline">
                                    {project.client}
                                </span>
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
