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
export function ProjectSelector({ projects, selectedProjects, onAddProject }) {
    // Filter out already selected projects
    const availableProjects = projects.filter((p) => !selectedProjects.includes(p.id));

    const handleProjectSelect = (projectId) => {
        if (projectId && !selectedProjects.includes(projectId)) {
            onAddProject(projectId);
        }
    };

    // All projects selected
    if (availableProjects.length === 0 && selectedProjects.length > 0) {
        return null;
    }

    // Empty state - no projects selected yet
    if (selectedProjects.length === 0) {
        return (
            <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg border border-dashed border-border">
                <Briefcase className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                    <p className="text-sm font-medium">No projects added</p>
                    <p className="text-xs text-muted-foreground">
                        Select a project to start logging hours
                    </p>
                </div>
                <Select onValueChange={handleProjectSelect}>
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Add project" />
                    </SelectTrigger>
                    <SelectContent>
                        {projects.map((project) => (
                            <SelectItem key={project.id} value={project.id}>
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-2 h-2 rounded-full"
                                        style={{ backgroundColor: project.color }}
                                    />
                                    <span>{project.name}</span>
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
                <SelectTrigger className="w-auto gap-2 border-dashed">
                    <Plus className="h-4 w-4" />
                    <span className="text-muted-foreground">Add project</span>
                </SelectTrigger>
                <SelectContent>
                    {availableProjects.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                            <div className="flex items-center gap-2">
                                <div
                                    className="w-2 h-2 rounded-full"
                                    style={{ backgroundColor: project.color }}
                                />
                                <span>{project.name}</span>
                                <span className="text-muted-foreground text-xs">
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
