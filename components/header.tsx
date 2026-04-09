"use client"

import { Github, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"

function ClipboardShieldIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Clipboard base */}
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      {/* Clipboard top clip */}
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
      {/* Shield in center */}
      <path d="M12 10c-2 0-3.5 1-3.5 1v4c0 2.5 3.5 4 3.5 4s3.5-1.5 3.5-4v-4s-1.5-1-3.5-1z" fill="currentColor" fillOpacity="0.2" />
      <path d="M12 10c-2 0-3.5 1-3.5 1v4c0 2.5 3.5 4 3.5 4s3.5-1.5 3.5-4v-4s-1.5-1-3.5-1z" />
      {/* Checkmark on shield */}
      <path d="M10 14l1.5 1.5L14 13" strokeWidth="1.5" />
    </svg>
  )
}

export function Header() {
  return (
    <header className="border-b border-border bg-card/30 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <ClipboardShieldIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">DevReady</h1>
              <p className="text-xs text-muted-foreground -mt-0.5">Environment Health Checker</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <Github className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

















