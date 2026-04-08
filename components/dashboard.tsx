"use client"

import { useState, useEffect, useCallback } from "react"
import { HealthOrb } from "./health-orb"
import { ToolCard, type ToolInfo } from "./tool-card"
import { StatsCard } from "./stats-card"
import { RecommendationsPanel } from "./recommendations-panel"
import { ConfigIssues } from "./config-issues"
import { MissingDependencies } from "./missing-dependencies"
import { Button } from "@/components/ui/button"
import { 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Package,
  Layers,
  Hexagon,
  Database,
  Code2,
  GitBranch,
  Box,
  Cpu
} from "lucide-react"

// Mock data for demonstration
const mockTools: ToolInfo[] = [
  {
    name: "Node.js",
    icon: <Hexagon className="w-6 h-6" />,
    installed: true,
    version: "18.17.0",
    latestVersion: "22.2.0",
    isOutdated: true,
    description: "JavaScript runtime built on Chrome's V8 JavaScript engine",
  },
  {
    name: "npm",
    icon: <Package className="w-6 h-6" />,
    installed: true,
    version: "10.2.0",
    latestVersion: "10.8.0",
    isOutdated: true,
    description: "Node package manager for JavaScript",
  },
  {
    name: "Git",
    icon: <GitBranch className="w-6 h-6" />,
    installed: true,
    version: "2.42.0",
    latestVersion: "2.42.0",
    isOutdated: false,
    description: "Distributed version control system",
  },
  {
    name: "Docker",
    icon: <Box className="w-6 h-6" />,
    installed: true,
    version: "24.0.6",
    latestVersion: "25.0.3",
    isOutdated: true,
    description: "Container platform for building and deploying applications",
  },
  {
    name: "Python",
    icon: <Code2 className="w-6 h-6" />,
    installed: true,
    version: "3.11.4",
    latestVersion: "3.12.3",
    isOutdated: true,
    description: "High-level programming language for general-purpose programming",
  },
  {
    name: "PostgreSQL",
    icon: <Database className="w-6 h-6" />,
    installed: false,
    description: "Open source relational database management system",
  },
  {
    name: "pnpm",
    icon: <Layers className="w-6 h-6" />,
    installed: true,
    version: "8.15.0",
    latestVersion: "8.15.0",
    isOutdated: false,
    description: "Fast, disk space efficient package manager",
  },
  {
    name: "Bun",
    icon: <Cpu className="w-6 h-6" />,
    installed: false,
    description: "All-in-one JavaScript runtime & toolkit",
  },
]

const mockRecommendations = [
  {
    id: "1",
    title: "Update Node.js to version 22.x",
    description: "Your Node.js version is significantly outdated. Version 22.x includes performance improvements, new features, and security patches.",
    severity: "critical" as const,
    commands: [
      { os: "macos" as const, command: "brew upgrade node" },
      { os: "macos" as const, command: "nvm install 22 && nvm use 22" },
      { os: "windows" as const, command: "winget upgrade OpenJS.NodeJS" },
      { os: "windows" as const, command: "nvm install 22 && nvm use 22" },
      { os: "linux" as const, command: "nvm install 22 && nvm use 22" },
      { os: "linux" as const, command: "curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash - && sudo apt-get install -y nodejs" },
    ],
  },
  {
    id: "2",
    title: "Install PostgreSQL",
    description: "PostgreSQL is not installed on your system. Many projects require a local database for development.",
    severity: "warning" as const,
    commands: [
      { os: "macos" as const, command: "brew install postgresql@16" },
      { os: "windows" as const, command: "winget install PostgreSQL.PostgreSQL" },
      { os: "linux" as const, command: "sudo apt-get install postgresql postgresql-contrib" },
    ],
  },
  {
    id: "3",
    title: "Update Docker to latest version",
    description: "A new version of Docker is available with bug fixes and new features.",
    severity: "warning" as const,
    commands: [
      { os: "macos" as const, command: "brew upgrade --cask docker" },
      { os: "windows" as const, command: "winget upgrade Docker.DockerDesktop" },
      { os: "linux" as const, command: "sudo apt-get update && sudo apt-get install docker-ce docker-ce-cli containerd.io" },
    ],
  },
  {
    id: "4",
    title: "Consider installing Bun",
    description: "Bun is a fast JavaScript runtime that can significantly speed up your development workflow.",
    severity: "info" as const,
    commands: [
      { os: "macos" as const, command: "curl -fsSL https://bun.sh/install | bash" },
      { os: "windows" as const, command: "powershell -c \"irm bun.sh/install.ps1 | iex\"" },
      { os: "linux" as const, command: "curl -fsSL https://bun.sh/install | bash" },
    ],
  },
]

const mockConfigIssues = [
  {
    id: "1",
    file: ".npmrc",
    issue: "Missing registry configuration. Consider adding a registry URL for faster package resolution.",
    severity: "info" as const,
  },
  {
    id: "2",
    file: "tsconfig.json",
    issue: "Strict mode is disabled. Enable 'strict: true' for better type safety.",
    severity: "warning" as const,
    line: 5,
  },
]

const mockMissingDependencies = [
  {
    id: "1",
    name: "@types/node",
    requiredBy: "tsconfig.json",
    type: "npm" as const,
    suggestion: "npm install -D @types/node",
  },
  {
    id: "2",
    name: "eslint",
    requiredBy: "package.json scripts",
    type: "npm" as const,
    suggestion: "npm install -D eslint",
  },
]

export function Dashboard() {
  const [isScanning, setIsScanning] = useState(false)
  const [healthScore, setHealthScore] = useState(0)
  const [scanComplete, setScanComplete] = useState(false)

  const calculateHealth = useCallback(() => {
    const installedTools = mockTools.filter((t) => t.installed).length
    const upToDateTools = mockTools.filter((t) => t.installed && !t.isOutdated).length
    const totalTools = mockTools.length
    const score = Math.round(
      ((installedTools / totalTools) * 50 + (upToDateTools / installedTools) * 50)
    )
    return score
  }, [])

  const runScan = () => {
    setIsScanning(true)
    setScanComplete(false)
    setHealthScore(0)

    // Simulate scanning animation
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 15
      if (progress >= 100) {
        clearInterval(interval)
        setIsScanning(false)
        setHealthScore(calculateHealth())
        setScanComplete(true)
      } else {
        setHealthScore(Math.round(progress * 0.72)) // Scale to max 72%
      }
    }, 200)
  }

  useEffect(() => {
    // Auto-run scan on mount
    const timer = setTimeout(runScan, 500)
    return () => clearTimeout(timer)
  }, [])

  const installedCount = mockTools.filter((t) => t.installed).length
  const outdatedCount = mockTools.filter((t) => t.installed && t.isOutdated).length
  const notInstalledCount = mockTools.filter((t) => !t.installed).length

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section with Health Orb */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <HealthOrb healthScore={healthScore} isScanning={isScanning} />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            {isScanning 
              ? "Scanning Your Environment..." 
              : scanComplete 
                ? "Environment Health Report" 
                : "Ready to Scan"}
          </h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            {isScanning 
              ? "Analyzing installed tools, versions, and configurations"
              : "Keep your development environment clean, consistent, and ready to run"}
          </p>
          <Button 
            onClick={runScan} 
            disabled={isScanning}
            size="lg"
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isScanning ? "animate-spin" : ""}`} />
            {isScanning ? "Scanning..." : "Run New Scan"}
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Tools Installed"
            value={installedCount}
            subtitle={`of ${mockTools.length} detected`}
            icon={CheckCircle2}
            variant="success"
          />
          <StatsCard
            title="Outdated Tools"
            value={outdatedCount}
            subtitle="need updates"
            icon={AlertTriangle}
            variant={outdatedCount > 0 ? "warning" : "success"}
          />
          <StatsCard
            title="Missing Tools"
            value={notInstalledCount}
            subtitle="not installed"
            icon={XCircle}
            variant={notInstalledCount > 0 ? "error" : "success"}
          />
          <StatsCard
            title="Config Issues"
            value={mockConfigIssues.length}
            subtitle="to review"
            icon={Package}
            variant={mockConfigIssues.length > 0 ? "warning" : "success"}
          />
        </div>

        {/* Tools Grid */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">Detected Developer Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockTools.map((tool) => (
              <ToolCard key={tool.name} tool={tool} />
            ))}
          </div>
        </div>

        {/* Two Column Layout for Issues */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <ConfigIssues issues={mockConfigIssues} />
          <MissingDependencies dependencies={mockMissingDependencies} />
        </div>

        {/* Recommendations */}
        <RecommendationsPanel recommendations={mockRecommendations} />
      </div>
    </div>
  )
}
