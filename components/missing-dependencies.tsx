"use client"

import { cn } from "@/lib/utils"
import { Package, AlertTriangle, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MissingDependency {
  id: string
  name: string
  requiredBy: string
  type: "npm" | "system" | "peer"
  suggestion?: string
}

interface MissingDependenciesProps {
  dependencies: MissingDependency[]
}

export function MissingDependencies({ dependencies }: MissingDependenciesProps) {
  const getTypeLabel = (type: MissingDependency["type"]) => {
    switch (type) {
      case "npm":
        return { label: "NPM Package", color: "bg-red-500/20 text-red-400" }
      case "system":
        return { label: "System Tool", color: "bg-amber-500/20 text-amber-400" }
      case "peer":
        return { label: "Peer Dependency", color: "bg-blue-500/20 text-blue-400" }
    }
  }

  if (dependencies.length === 0) {
    return (
      <div className="p-6 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-center">
        <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-3">
          <Package className="w-6 h-6 text-emerald-500" />
        </div>
        <h3 className="font-medium text-foreground mb-1">All Dependencies Installed</h3>
        <p className="text-sm text-muted-foreground">
          Your project has all required dependencies.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          <h2 className="text-lg font-semibold text-foreground">Missing Dependencies</h2>
        </div>
        <span className="text-sm text-muted-foreground">{dependencies.length} missing</span>
      </div>

      <div className="space-y-2">
        {dependencies.map((dep) => {
          const typeInfo = getTypeLabel(dep.type)
          return (
            <div
              key={dep.id}
              className="p-4 rounded-lg border border-border bg-card/50 hover:bg-card/80 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                    <Package className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <code className="font-mono font-medium text-foreground">{dep.name}</code>
                      <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", typeInfo.color)}>
                        {typeInfo.label}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Required by: <span className="text-foreground/80">{dep.requiredBy}</span>
                    </p>
                  </div>
                </div>
                <Button size="sm" variant="secondary" className="gap-1.5">
                  <Download className="w-4 h-4" />
                  Install
                </Button>
              </div>
              {dep.suggestion && (
                <div className="mt-3 pt-3 border-t border-border">
                  <code className="text-xs font-mono text-muted-foreground bg-background/50 px-2 py-1 rounded">
                    {dep.suggestion}
                  </code>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
