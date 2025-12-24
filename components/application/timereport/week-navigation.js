'use client'

import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'

/**
 * Get the Monday of the week containing the given date
 */
function getWeekMonday(date) {
  const d = new Date(date)
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  d.setHours(0, 0, 0, 0)
  return d
}

/**
 * Format date to display format
 */
function formatDate(date) {
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
  })
}

/**
 * Get week number of the year
 */
function getWeekNumber(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil(((d - yearStart) / 86400000 + 1) / 7)
}

/**
 * Week navigation component for selecting time report weeks.
 * Allows navigating to previous weeks and returning to current week.
 */
export function WeekNavigation({ selectedWeek, onWeekChange }) {
  const currentWeekMonday = getWeekMonday(new Date())
  const selectedMonday = getWeekMonday(selectedWeek)
  
  const isCurrentWeek = selectedMonday.getTime() === currentWeekMonday.getTime()
  const weekNumber = getWeekNumber(selectedMonday)
  
  // Calculate Sunday of the selected week
  const selectedSunday = new Date(selectedMonday)
  selectedSunday.setDate(selectedMonday.getDate() + 6)

  const handlePreviousWeek = () => {
    const newDate = new Date(selectedMonday)
    newDate.setDate(newDate.getDate() - 7)
    onWeekChange(newDate)
  }

  const handleNextWeek = () => {
    const newDate = new Date(selectedMonday)
    newDate.setDate(newDate.getDate() + 7)
    onWeekChange(newDate)
  }

  const handleCurrentWeek = () => {
    onWeekChange(currentWeekMonday)
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={handlePreviousWeek}
          className="h-8 w-8"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-lg min-w-[200px] justify-center">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium text-sm">
            Week {weekNumber}
          </span>
          <span className="text-muted-foreground text-sm">
            ({formatDate(selectedMonday)} - {formatDate(selectedSunday)})
          </span>
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={handleNextWeek}
          disabled={isCurrentWeek}
          className="h-8 w-8"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {!isCurrentWeek && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCurrentWeek}
          className="text-xs"
        >
          Go to current week
        </Button>
      )}
    </div>
  )
}

export { getWeekMonday, getWeekNumber }

