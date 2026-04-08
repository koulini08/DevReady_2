"use client"

import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  trend?: "up" | "down" | "neutral"
  trendValue?: string
  variant?: "default" | "success" | "warning" | "error"
}

export function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = "default",
}: StatsCardProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "success":
        return "border-emerald-500/20 bg-emerald-500/5"
      case "warning":
        return "border-amber-500/20 bg-amber-500/5"
      case "error":
        return "border-red-500/20 bg-red-500/5"
      default:
        return "border-border bg-card/50"
    }
  }

  const getIconStyles = () => {
    switch (variant) {
      case "success":
        return "bg-emerald-500/20 text-emerald-400"
      case "warning":
        return "bg-amber-500/20 text-amber-400"
      case "error":
        return "bg-red-500/20 text-red-400"
      default:
        return "bg-secondary text-foreground"
    }
  }

  const getValueStyles = () => {
    switch (variant) {
      case "success":
        return "text-emerald-400"
      case "warning":
        return "text-amber-400"
      case "error":
        return "text-red-400"
      default:
        return "text-foreground"
    }
  }

  return (
    <div
      className={cn(
        "p-5 rounded-xl border backdrop-blur-sm transition-all hover:scale-[1.02]",
        getVariantStyles()
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className={cn("text-3xl font-bold tracking-tight", getValueStyles())}>
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <div className={cn("p-2.5 rounded-lg", getIconStyles())}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  )
}
