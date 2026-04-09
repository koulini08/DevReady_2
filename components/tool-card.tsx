"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { CheckCircle2, AlertTriangle, XCircle, ExternalLink, Wrench, X, Apple, Monitor, Terminal, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"

export interface ToolInfo {
  name: string
  icon: React.ReactNode
  installed: boolean
  version?: string
  latestVersion?: string
  isOutdated?: boolean
  description: string
  downloadUrl: string
  installInstructions: {
    windows: { url: string; steps: string[] }
    macos: { url: string; steps: string[] }
    linux: { url: string; steps: string[] }
  }
}

interface ToolCardProps {
  tool: ToolInfo
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

export function ToolCard({ tool }: ToolCardProps) {
  const [showInstallModal, setShowInstallModal] = useState(false)
  const [showUpdateGuide, setShowUpdateGuide] = useState(false)
  const [selectedOs, setSelectedOs] = useState<"windows" | "macos" | "linux">("macos")

  const needsAction = !tool.installed || tool.isOutdated

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

  const handleAutofix = () => {
    setShowInstallModal(true)
  }

  const handleConfirmInstall = () => {
    const url = tool.installInstructions[selectedOs].url
    window.open(url, "_blank")
    setShowInstallModal(false)
  }

  return (
    <>
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

            {/* Status badge and actions */}
            <div className="mt-3 space-y-2">
              <span className={cn("text-xs font-medium block", getStatusColor())}>
                {getStatusText()}
              </span>
              
              {/* Action buttons - only show if needs action */}
              {needsAction && (
                <div className="flex flex-col gap-2">
                  {/* Autofix button - ABOVE update guide */}
                  <Button
                    size="sm"
                    onClick={handleAutofix}
                    className="w-full gap-2 bg-primary hover:bg-primary/90"
                  >
                    <Wrench className="w-4 h-4" />
                    {tool.installed ? "Autofix - Update Now" : "Autofix - Install Now"}
                  </Button>
                  
                  {/* View Update Guide - BELOW autofix */}
                  <button
                    onClick={() => setShowUpdateGuide(!showUpdateGuide)}
                    className="text-xs text-primary hover:text-primary/80 flex items-center gap-1 transition-colors justify-center"
                  >
                    View {tool.installed ? "update" : "install"} guide
                    <ChevronDown className={cn("w-3 h-3 transition-transform", showUpdateGuide && "rotate-180")} />
                  </button>
                </div>
              )}
            </div>

            {/* Update/Install Guide Dropdown */}
            {showUpdateGuide && needsAction && (
              <div className="mt-3 p-3 rounded-lg bg-secondary/50 border border-border space-y-3">
                {/* OS Selector */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Platform:</span>
                  {(["macos", "windows", "linux"] as const).map((os) => (
                    <button
                      key={os}
                      onClick={() => setSelectedOs(os)}
                      className={cn(
                        "flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium transition-colors",
                        selectedOs === os
                          ? "bg-primary text-primary-foreground"
                          : "bg-background text-foreground hover:bg-background/80"
                      )}
                    >
                      <OsIcon os={os} />
                      <span className="capitalize">{os}</span>
                    </button>
                  ))}
                </div>

                {/* Instructions */}
                <div className="space-y-2">
                  <p className="text-xs font-medium text-foreground">Installation Steps:</p>
                  <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
                    {tool.installInstructions[selectedOs].steps.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ol>
                </div>

                {/* Download link */}
                <a
                  href={tool.installInstructions[selectedOs].url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
                >
                  <ExternalLink className="w-3 h-3" />
                  Open official download page
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Installation Confirmation Modal */}
      {showInstallModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-xl border-2 border-primary/50 bg-card p-6 shadow-2xl shadow-primary/20">
            {/* Close button */}
            <button
              onClick={() => setShowInstallModal(false)}
              className="absolute top-4 right-4 p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                {tool.icon}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  {tool.installed ? "Update" : "Install"} {tool.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {tool.installed ? `Update to v${tool.latestVersion}` : "Install the latest version"}
                </p>
              </div>
            </div>

            {/* OS Selector */}
            <div className="mb-4">
              <p className="text-sm text-muted-foreground mb-2">Select your platform:</p>
              <div className="flex gap-2">
                {(["macos", "windows", "linux"] as const).map((os) => (
                  <button
                    key={os}
                    onClick={() => setSelectedOs(os)}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      selectedOs === os
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-foreground hover:bg-secondary/80"
                    )}
                  >
                    <OsIcon os={os} />
                    <span className="capitalize">{os}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Highlighted download box */}
            <div className="p-4 rounded-lg bg-primary/10 border border-primary/30 mb-4">
              <p className="text-sm text-foreground mb-2">
                You will be redirected to the official {tool.name} download page:
              </p>
              <code className="text-xs text-primary break-all block">
                {tool.installInstructions[selectedOs].url}
              </code>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowInstallModal(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 gap-2"
                onClick={handleConfirmInstall}
              >
                <ExternalLink className="w-4 h-4" />
                Confirm & {tool.installed ? "Update" : "Install"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
