"use client"

import { cn } from "@/lib/utils"

interface HealthOrbProps {
  healthScore: number
  isScanning: boolean
}

export function HealthOrb({ healthScore, isScanning }: HealthOrbProps) {
  const getHealthColor = () => {
    if (healthScore >= 80) return "from-emerald-400 to-emerald-600"
    if (healthScore >= 60) return "from-amber-400 to-amber-600"
    return "from-red-400 to-red-600"
  }

  const getGlowColor = () => {
    if (healthScore >= 80) return "shadow-emerald-500/50"
    if (healthScore >= 60) return "shadow-amber-500/50"
    return "shadow-red-500/50"
  }

  const getRingColor = () => {
    if (healthScore >= 80) return "border-emerald-500/30"
    if (healthScore >= 60) return "border-amber-500/30"
    return "border-red-500/30"
  }

  return (
    <div className="relative flex items-center justify-center w-64 h-64">
      {/* Outer rotating ring */}
      <div
        className={cn(
          "absolute w-56 h-56 rounded-full border-2 border-dashed",
          getRingColor(),
          isScanning ? "animate-spin" : ""
        )}
        style={{ animationDuration: "8s" }}
      />

      {/* Second rotating ring - opposite direction */}
      <div
        className={cn(
          "absolute w-48 h-48 rounded-full border border-dashed",
          getRingColor(),
          isScanning ? "animate-spin" : ""
        )}
        style={{ animationDuration: "6s", animationDirection: "reverse" }}
      />

      {/* Inner pulsing ring */}
      <div
        className={cn(
          "absolute w-40 h-40 rounded-full border-2",
          getRingColor(),
          isScanning ? "animate-pulse" : ""
        )}
      />

      {/* Orbiting dot 1 */}
      <div
        className={cn(
          "absolute w-56 h-56",
          isScanning ? "animate-spin" : ""
        )}
        style={{ animationDuration: "3s" }}
      >
        <div
          className={cn(
            "absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-gradient-to-r",
            getHealthColor()
          )}
        />
      </div>

      {/* Orbiting dot 2 */}
      <div
        className={cn(
          "absolute w-48 h-48",
          isScanning ? "animate-spin" : ""
        )}
        style={{ animationDuration: "4s", animationDirection: "reverse" }}
      >
        <div
          className={cn(
            "absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-gradient-to-r",
            getHealthColor()
          )}
        />
      </div>

      {/* Orbiting dot 3 */}
      <div
        className={cn(
          "absolute w-40 h-40",
          isScanning ? "animate-spin" : ""
        )}
        style={{ animationDuration: "5s" }}
      >
        <div
          className={cn(
            "absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 rounded-full bg-gradient-to-r",
            getHealthColor()
          )}
        />
      </div>

      {/* Central orb */}
      <div
        className={cn(
          "relative w-28 h-28 rounded-full bg-gradient-to-br shadow-2xl flex items-center justify-center",
          getHealthColor(),
          getGlowColor(),
          isScanning ? "animate-pulse" : ""
        )}
      >
        {/* Inner glow */}
        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white/30 to-transparent" />
        
        {/* Score display */}
        <div className="relative text-center">
          {isScanning ? (
            <div className="flex flex-col items-center">
              <div className="w-6 h-6 border-2 border-white/80 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs text-white/80 mt-1 font-medium">Scanning</span>
            </div>
          ) : (
            <>
              <span className="text-3xl font-bold text-white">{healthScore}</span>
              <span className="text-xs text-white/80 block">Health Score</span>
            </>
          )}
        </div>
      </div>

      {/* Ambient glow effect */}
      <div
        className={cn(
          "absolute w-32 h-32 rounded-full blur-xl opacity-30 -z-10",
          healthScore >= 80 ? "bg-emerald-500" : healthScore >= 60 ? "bg-amber-500" : "bg-red-500"
        )}
      />
    </div>
  )
}
