'use client'

import { Plus, Check, Briefcase } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

/**
 * Project selector component for time reporting.
 * Displays selected projects and allows adding new ones.
 */
export function ProjectSelector({
  projects,
  selectedProjects,
  onAddProject,
  onRemoveProject,
}) {
  // Filter out already selected projects
  const availableProjects = projects.filter(
    p => !selectedProjects.includes(p.id)
  )

  const handleProjectSelect = (projectId) => {
    if (projectId && !selectedProjects.includes(projectId)) {
      onAddProject(projectId)
    }
  }

  return (
    <div className="space-y-3">
      {/* Selected projects list */}
      {selectedProjects.length > 0 && (
        <div className="space-y-2">
          {selectedProjects.map(projectId => {
            const project = projects.find(p => p.id === projectId)
            if (!project) return null

            return (
              <div
                key={projectId}
                className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border border-border/50"
              >
                <div
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: project.color }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{project.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {project.client}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveProject(projectId)}
                  className="h-7 px-2 text-muted-foreground hover:text-destructive"
                >
                  Remove
                </Button>
              </div>
            )
          })}
        </div>
      )}

      {/* Add project selector */}
      {availableProjects.length > 0 && (
        <Select onValueChange={handleProjectSelect}>
          <SelectTrigger className="w-full">
            <div className="flex items-center gap-2">
              <Plus className="h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Add a project to report time..." />
            </div>
          </SelectTrigger>
          <SelectContent>
            {availableProjects.map(project => (
              <SelectItem key={project.id} value={project.id}>
                <div className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: project.color }}
                  />
                  <span>{project.name}</span>
                  <span className="text-muted-foreground text-xs">
                    • {project.client}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* Empty state */}
      {selectedProjects.length === 0 && (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Briefcase className="h-10 w-10 text-muted-foreground/50 mb-3" />
          <p className="text-sm text-muted-foreground">
            No projects selected
          </p>
          <p className="text-xs text-muted-foreground/70 mt-1">
            Add a project above to start reporting time
          </p>
        </div>
      )}
    </div>
  )
}

