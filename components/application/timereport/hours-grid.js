'use client'

import { useState, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

/**
 * Hours grid component for entering daily hours per project.
 * Displays a grid where rows are projects and columns are days.
 */
export function HoursGrid({
  projects,
  selectedProjects,
  hours,
  onHoursChange,
  selectedWeek,
}) {
  const today = new Date()
  const selectedMonday = new Date(selectedWeek)
  
  // Generate dates for the week
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(selectedMonday)
    date.setDate(selectedMonday.getDate() + i)
    return date
  })

  // Calculate totals per day
  const dailyTotals = Array.from({ length: 7 }, (_, dayIndex) => {
    return selectedProjects.reduce((sum, projectId) => {
      return sum + (hours[projectId]?.[dayIndex] || 0)
    }, 0)
  })

  // Calculate total for the week
  const weekTotal = dailyTotals.reduce((sum, hours) => sum + hours, 0)

  const handleHourChange = useCallback((projectId, dayIndex, value) => {
    const numValue = parseFloat(value) || 0
    const clampedValue = Math.max(0, Math.min(24, numValue))
    onHoursChange(projectId, dayIndex, clampedValue)
  }, [onHoursChange])

  if (selectedProjects.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      {/* Hours grid */}
      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          {/* Project rows */}
          <div className="space-y-3">
            {selectedProjects.map(projectId => {
              const project = projects.find(p => p.id === projectId)
              if (!project) return null

              const projectHours = hours[projectId] || [0, 0, 0, 0, 0, 0, 0]
              const projectTotal = projectHours.reduce((sum, h) => sum + h, 0)

              return (
                <div
                  key={projectId}
                  className="grid grid-cols-[1fr_repeat(7,minmax(60px,1fr))_80px] gap-2 items-center"
                >
                  {/* Project name */}
                  <div className="flex items-center gap-2 pr-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: project.color }}
                    />
                    <span className="text-sm font-medium truncate">
                      {project.name}
                    </span>
                  </div>

                  {/* Hour inputs for each day */}
                  {weekDates.map((date, dayIndex) => {
                    const isWeekend = dayIndex >= 5
                    const isToday = date.toDateString() === today.toDateString()
                    const isFuture = date > today

                    return (
                      <div key={dayIndex} className="relative">
                        <Input
                          type="number"
                          min="0"
                          max="24"
                          step="0.5"
                          value={projectHours[dayIndex] || ''}
                          onChange={(e) => handleHourChange(projectId, dayIndex, e.target.value)}
                          placeholder="0"
                          className={cn(
                            'text-center h-10 text-sm',
                            isWeekend && 'bg-muted/30',
                            isToday && 'ring-1 ring-primary/30',
                            isFuture && 'opacity-50'
                          )}
                        />
                      </div>
                    )
                  })}

                  {/* Project total */}
                  <div className="text-right pr-2">
                    <span className={cn(
                      'text-sm font-semibold',
                      projectTotal > 0 && 'text-primary'
                    )}>
                      {projectTotal}h
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Totals row */}
          <div className="grid grid-cols-[1fr_repeat(7,minmax(60px,1fr))_80px] gap-2 items-center mt-4 pt-4 border-t">
            <div className="text-sm font-medium text-muted-foreground">
              Daily Total
            </div>
            {dailyTotals.map((total, index) => {
              const isOvertime = total > 8
              const isWeekend = index >= 5
              
              return (
                <div
                  key={index}
                  className={cn(
                    'text-center text-sm font-semibold py-2 rounded-md',
                    isOvertime && 'text-amber-600 bg-amber-50 dark:bg-amber-950/30',
                    total === 8 && 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30',
                    total > 0 && total < 8 && !isWeekend && 'text-blue-600 bg-blue-50 dark:bg-blue-950/30',
                    (total === 0 || isWeekend) && 'text-muted-foreground'
                  )}
                >
                  {total}h
                </div>
              )
            })}
            <div className="text-right pr-2">
              <span className={cn(
                'text-base font-bold',
                weekTotal >= 40 && 'text-emerald-600',
                weekTotal > 0 && weekTotal < 40 && 'text-primary'
              )}>
                {weekTotal}h
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="flex items-center justify-between pt-4 border-t">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-xs text-muted-foreground">8h (Standard)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="text-xs text-muted-foreground">&gt;8h (Overtime)</span>
          </div>
        </div>
        <div className="text-sm">
          <span className="text-muted-foreground">Week target: </span>
          <span className={cn(
            'font-medium',
            weekTotal >= 40 ? 'text-emerald-600' : 'text-muted-foreground'
          )}>
            {weekTotal}/40h
          </span>
        </div>
      </div>
    </div>
  )
}

