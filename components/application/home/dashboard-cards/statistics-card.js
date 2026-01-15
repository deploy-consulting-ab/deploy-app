'use client'

import { Card } from '@/components/ui/card'
import { Briefcase, ArrowUpRight, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { MiniLineChart } from '@/components/application/home/mini-chart'

export function StatisticsCard({
  stats = [],
  title = 'Business Activity',
  refreshAction,
  error: initialError,
}) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [statsData, setStatsData] = useState(stats)
  const [error, setError] = useState(initialError)

  const handleRefresh = async () => {
    if (isRefreshing || !refreshAction) return
    setIsRefreshing(true)
    try {
      const freshData = await refreshAction()
      setStatsData(freshData)
      setError(null)
    } catch (err) {
      setError(err.message || 'Failed to refresh statistics')
    } finally {
      setIsRefreshing(false)
    }
  }

  // Color mapping for different stat types
  const getStatColor = (label) => {
    const lowerLabel = label?.toLowerCase() || ''
    if (lowerLabel.includes('active')) return 'var(--accent-yellow)'
    if (lowerLabel.includes('proposed')) return 'var(--accent-orange)'
    if (lowerLabel.includes('closed')) return 'var(--accent-lime)'
    return 'var(--accent-blue-bright)'
  }

  // Generate mock chart data for each stat
  const generateChartData = (value) => {
    const base = value || 1
    return [
      Math.max(0, base - 2),
      Math.max(0, base - 1),
      base,
      Math.max(0, base + 1),
      base,
      Math.max(0, base - 1),
      base,
    ]
  }

  if (error) {
    return (
      <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
        <h2 className="text-xl font-semibold text-foreground mb-4">{title}</h2>
        <p className="text-sm text-destructive">{error}</p>
      </Card>
    )
  }

  if (!statsData || statsData.length === 0) {
    return (
      <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
        <h2 className="text-xl font-semibold text-foreground mb-4">{title}</h2>
        <p className="text-sm text-muted-foreground">No statistics available</p>
      </Card>
    )
  }

  // Calculate totals for progress bars
  const total = statsData.reduce((sum, s) => sum + (s.value || 0), 0)

  return (
    <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">{title}</h2>
        <div className="flex items-center gap-2">
          {refreshAction && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className={isRefreshing ? 'animate-spin' : ''}
            >
              <RefreshCw className="h-4 w-4 text-muted-foreground" />
            </Button>
          )}
          <select className="bg-background border border-border rounded-lg px-3 py-1 text-sm">
            <option>This Week</option>
            <option>This Month</option>
            <option>This Quarter</option>
          </select>
        </div>
      </div>

      {/* Stats with Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {statsData.map((stat, index) => {
          const color = getStatColor(stat.label)
          const chartData = generateChartData(stat.value)

          return (
            <div key={stat.id || index} className="space-y-2">
              <div className="h-20 w-full">
                <MiniLineChart data={chartData} color={color} />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-sm text-muted-foreground">{stat.label}</span>
                <div
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: color }}
                />
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                {stat.detail && (
                  <div className="text-xs text-muted-foreground">{stat.detail}</div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Progress Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border/50">
        {/* Progress Bars */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Assignments Progress</span>
            <span className="text-xs text-[var(--accent-lime)]">
              {total > 0 ? Math.round(((statsData.find(s => s.label?.toLowerCase().includes('closed'))?.value || 0) / total) * 100) : 0}% completed
            </span>
          </div>
          {statsData.slice(0, 3).map((stat, index) => (
            <div key={stat.id || index}>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-muted-foreground">{stat.label}</span>
                <span className="font-bold">{stat.value}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full transition-all duration-500"
                  style={{
                    width: `${total > 0 ? (stat.value / Math.max(total, 20)) * 100 : 0}%`,
                    background: `linear-gradient(to right, ${getStatColor(stat.label)}, ${getStatColor(stat.label)}88)`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-2 gap-2">
          {statsData.map((stat, index) => (
            <Card
              key={stat.id || index}
              className="p-3 bg-card/50 backdrop-blur border-border/50 hover:shadow-lg transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-1">
                <Briefcase className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                <ArrowUpRight className="h-3 w-3 text-muted-foreground group-hover:text-[var(--accent-lime)] transition-colors" />
              </div>
              <div className="text-xl font-bold">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </Card>
          ))}
        </div>
      </div>
    </Card>
  )
}
