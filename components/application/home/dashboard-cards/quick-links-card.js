'use client'

import { Card } from '@/components/ui/card'
import {
  Wallet,
  Shield,
  Leaf,
  Clock,
  FileText,
  ExternalLink,
  Calendar,
  Users,
  Settings,
  Home,
  Briefcase,
  BarChart,
  Link as LinkIcon,
  ArrowUpRight,
} from 'lucide-react'

const iconMap = {
  Wallet,
  Shield,
  Leaf,
  Clock,
  FileText,
  ExternalLink,
  Calendar,
  Users,
  Settings,
  Home,
  Briefcase,
  BarChart,
  Link: LinkIcon,
}

export function QuickLinksCard({
  links = [],
  title = 'Quick Access',
  description = 'Access resources and support anytime',
}) {
  if (!links || links.length === 0) {
    return (
      <Card className="p-6 bg-gradient-to-br from-[var(--accent-yellow)] to-[var(--accent-orange)] border-0 text-gray-900">
        <h3 className="text-lg font-bold mb-2">{title}</h3>
        <p className="text-sm mb-4 opacity-90">{description}</p>
        <p className="text-sm opacity-75">No links configured</p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Links Grid */}
      <div className="grid grid-cols-2 gap-3">
        {links.map((link, index) => {
          const Icon = iconMap[link.icon] || LinkIcon

          return (
            <a
              key={link.href || index}
              href={link.href}
              target={link.external ? '_blank' : undefined}
              rel={link.external ? 'noopener noreferrer' : undefined}
              className="group"
            >
              <Card className="p-4 bg-card/50 backdrop-blur border-border/50 hover:shadow-lg transition-all cursor-pointer h-full">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-[var(--accent-lime)] transition-colors" />
                </div>
                <div className="font-medium text-sm group-hover:text-primary transition-colors">
                  {link.title}
                </div>
                {link.description && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {link.description}
                  </p>
                )}
              </Card>
            </a>
          )
        })}
      </div>
    </div>
  )
}
