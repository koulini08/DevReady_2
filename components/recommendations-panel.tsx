"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Terminal, Copy, Check, ChevronDown, Apple, Monitor } from "lucide-react"

interface Command {
  os: "windows" | "macos" | "linux"
  command: string
}

interface Recommendation {
  id: string
  title: string
  description: string
  severity: "critical" | "warning" | "info"
  commands: Command[]
}

interface RecommendationsPanelProps {
  recommendations: Recommendation[]
}

function OsIcon({ os }: { os: "windows" | "macos" | "linux" }) {
  switch (os) {
    case "windows":
      return <Monitor className="w-4 h-4" />
    case "macos":
      return <Apple className="w-4 h-4" />
    case "linux":
      return <Terminal className="w-4 h-4" />
  }
}

function CommandBlock({ command, os }: { command: string; os: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(command)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex items-center gap-2 bg-background/50 rounded-lg px-3 py-2 group">
      <OsIcon os={os as "windows" | "macos" | "linux"} />
      <code className="flex-1 font-mono text-sm text-foreground/90 overflow-x-auto">
        {command}
      </code>
      <button
        onClick={handleCopy}
        className="flex-shrink-0 p-1.5 rounded-md hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
        title="Copy command"
      >
        {copied ? (
          <Check className="w-4 h-4 text-emerald-500" />
        ) : (
          <Copy className="w-4 h-4" />
        )}
      </button>
    </div>
  )
}

function RecommendationCard({ recommendation }: { recommendation: Recommendation }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [selectedOs, setSelectedOs] = useState<"windows" | "macos" | "linux">("macos")

  const getSeverityStyles = () => {
    switch (recommendation.severity) {
      case "critical":
        return "border-l-red-500 bg-red-500/5"
      case "warning":
        return "border-l-amber-500 bg-amber-500/5"
      case "info":
        return "border-l-blue-500 bg-blue-500/5"
    }
  }

  const getSeverityBadge = () => {
    switch (recommendation.severity) {
      case "critical":
        return "bg-red-500/20 text-red-400"
      case "warning":
        return "bg-amber-500/20 text-amber-400"
      case "info":
        return "bg-blue-500/20 text-blue-400"
    }
  }

  const filteredCommands = recommendation.commands.filter((c) => c.os === selectedOs)

  return (
    <div
      className={cn(
        "rounded-lg border border-border border-l-4 overflow-hidden transition-all",
        getSeverityStyles()
      )}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-card/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "px-2 py-0.5 rounded-full text-xs font-medium capitalize",
              getSeverityBadge()
            )}
          >
            {recommendation.severity}
          </span>
          <span className="font-medium text-foreground">{recommendation.title}</span>
        </div>
        <ChevronDown
          className={cn(
            "w-5 h-5 text-muted-foreground transition-transform",
            isExpanded && "rotate-180"
          )}
        />
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 space-y-4">
          <p className="text-sm text-muted-foreground">{recommendation.description}</p>

          {/* OS selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Platform:</span>
            {(["macos", "windows", "linux"] as const).map((os) => (
              <button
                key={os}
                onClick={() => setSelectedOs(os)}
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors",
                  selectedOs === os
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                )}
              >
                <OsIcon os={os} />
                <span className="capitalize">{os}</span>
              </button>
            ))}
          </div>

          {/* Commands */}
          <div className="space-y-2">
            {filteredCommands.length > 0 ? (
              filteredCommands.map((cmd, i) => (
                <CommandBlock key={i} command={cmd.command} os={cmd.os} />
              ))
            ) : (
              <p className="text-sm text-muted-foreground italic">
                No commands available for this platform.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export function RecommendationsPanel({ recommendations }: RecommendationsPanelProps) {
  const criticalCount = recommendations.filter((r) => r.severity === "critical").length
  const warningCount = recommendations.filter((r) => r.severity === "warning").length

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Recommendations</h2>
        <div className="flex items-center gap-3 text-sm">
          {criticalCount > 0 && (
            <span className="text-red-400">{criticalCount} critical</span>
          )}
          {warningCount > 0 && (
            <span className="text-amber-400">{warningCount} warnings</span>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {recommendations.map((rec) => (
          <RecommendationCard key={rec.id} recommendation={rec} />
        ))}
      </div>
    </div>
  )
}
