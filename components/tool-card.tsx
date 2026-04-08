"use client"

import { cn } from "@/lib/utils"
import { CheckCircle2, AlertTriangle, XCircle, ExternalLink } from "lucide-react"

export interface ToolInfo {
  name: string
  icon: React.ReactNode
  installed: boolean
  version?: string
  latestVersion?: string
  isOutdated?: boolean
  description: string
}

interface ToolCardProps {
  tool: ToolInfo
}

export function ToolCard({ tool }: ToolCardProps) {
  const getStatusIcon = () => {
    if (!tool.installed) {
      return <XCircle className="w-5 h-5 text-red-500" />
    }
    if (tool.isOutdated) {
      return <AlertTriangle className="w-5 h-5 text-amber-500" />
    }
    return <CheckCircle2 className="w-5 h-5 text-emerald-500" />
  }

  const getStatusText = () => {
    if (!tool.installed) return "Not Installed"
    if (tool.isOutdated) return "Update Available"
    return "Up to Date"
  }

  const getStatusColor = () => {
    if (!tool.installed) return "text-red-400"
    if (tool.isOutdated) return "text-amber-400"
    return "text-emerald-400"
  }

  return (
    <div
      className={cn(
        "group relative p-5 rounded-xl border transition-all duration-300",
        "bg-card/50 backdrop-blur-sm hover:bg-card/80",
        "border-border hover:border-primary/30",
        !tool.installed && "border-red-500/20 bg-red-500/5",
        tool.isOutdated && "border-amber-500/20 bg-amber-500/5"
      )}
    >
      {/* Status indicator dot */}
      <div
        className={cn(
          "absolute top-3 right-3 w-2 h-2 rounded-full",
          tool.installed
            ? tool.isOutdated
              ? "bg-amber-500 animate-pulse"
              : "bg-emerald-500"
            : "bg-red-500"
        )}
      />

      <div className="flex items-start gap-4">
        {/* Tool icon */}
        <div
          className={cn(
            "flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center",
            "bg-secondary/50 group-hover:bg-secondary transition-colors",
            tool.installed ? "text-foreground" : "text-muted-foreground"
          )}
        >
          {tool.icon}
        </div>

        {/* Tool info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-foreground">{tool.name}</h3>
            {getStatusIcon()}
          </div>

          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {tool.description}
          </p>

          {/* Version info */}
          <div className="flex items-center gap-4 text-sm">
            {tool.installed ? (
              <>
                <div className="flex items-center gap-1.5">
                  <span className="text-muted-foreground">Current:</span>
                  <code className="px-1.5 py-0.5 rounded bg-secondary text-foreground font-mono text-xs">
                    {tool.version}
                  </code>
                </div>
                {tool.latestVersion && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-muted-foreground">Latest:</span>
                    <code
                      className={cn(
                        "px-1.5 py-0.5 rounded font-mono text-xs",
                        tool.isOutdated
                          ? "bg-amber-500/20 text-amber-400"
                          : "bg-secondary text-foreground"
                      )}
                    >
                      {tool.latestVersion}
                    </code>
                  </div>
                )}
              </>
            ) : (
              <span className="text-red-400 text-sm">Tool not detected</span>
            )}
          </div>

          {/* Status badge */}
          <div className="mt-3 flex items-center justify-between">
            <span className={cn("text-xs font-medium", getStatusColor())}>
              {getStatusText()}
            </span>
            {tool.installed && tool.isOutdated && (
              <button className="text-xs text-primary hover:text-primary/80 flex items-center gap-1 transition-colors">
                View update guide
                <ExternalLink className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
