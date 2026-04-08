"use client"

import { cn } from "@/lib/utils"
import { AlertCircle, CheckCircle2, Info, FileCode2 } from "lucide-react"

interface ConfigIssue {
  id: string
  file: string
  issue: string
  severity: "error" | "warning" | "info"
  line?: number
}

interface ConfigIssuesProps {
  issues: ConfigIssue[]
}

export function ConfigIssues({ issues }: ConfigIssuesProps) {
  const getSeverityIcon = (severity: ConfigIssue["severity"]) => {
    switch (severity) {
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-500" />
      case "warning":
        return <AlertCircle className="w-4 h-4 text-amber-500" />
      case "info":
        return <Info className="w-4 h-4 text-blue-500" />
    }
  }

  const getSeverityStyles = (severity: ConfigIssue["severity"]) => {
    switch (severity) {
      case "error":
        return "border-red-500/30 bg-red-500/5"
      case "warning":
        return "border-amber-500/30 bg-amber-500/5"
      case "info":
        return "border-blue-500/30 bg-blue-500/5"
    }
  }

  if (issues.length === 0) {
    return (
      <div className="p-6 rounded-xl border border-border bg-card/50 text-center">
        <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-3">
          <CheckCircle2 className="w-6 h-6 text-emerald-500" />
        </div>
        <h3 className="font-medium text-foreground mb-1">No Configuration Issues</h3>
        <p className="text-sm text-muted-foreground">
          All your configuration files look good!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Configuration Issues</h2>
        <span className="text-sm text-muted-foreground">{issues.length} found</span>
      </div>

      <div className="space-y-2">
        {issues.map((issue) => (
          <div
            key={issue.id}
            className={cn(
              "p-4 rounded-lg border transition-colors hover:bg-card/30",
              getSeverityStyles(issue.severity)
            )}
          >
            <div className="flex items-start gap-3">
              {getSeverityIcon(issue.severity)}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <FileCode2 className="w-4 h-4 text-muted-foreground" />
                  <code className="text-sm font-mono text-foreground">{issue.file}</code>
                  {issue.line && (
                    <span className="text-xs text-muted-foreground">Line {issue.line}</span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{issue.issue}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
