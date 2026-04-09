"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
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

// Tool definitions with installation instructions
const toolDefinitions = [
  {
    name: "Node.js",
    icon: <Hexagon className="w-6 h-6" />,
    description: "JavaScript runtime built on Chrome's V8 JavaScript engine",
    latestVersion: "22.2.0",
    possibleVersions: ["18.17.0", "19.0.0", "20.10.0", "21.5.0", "22.2.0"],
    downloadUrl: "https://nodejs.org/en/download",
    installInstructions: {
      windows: { 
        url: "https://nodejs.org/en/download", 
        steps: ["Download the Windows Installer (.msi) from nodejs.org", "Run the installer and follow the prompts", "Restart your terminal and verify with 'node --version'"] 
      },
      macos: { 
        url: "https://nodejs.org/en/download", 
        steps: ["Install via Homebrew: brew install node", "Or download the macOS Installer from nodejs.org", "Verify installation with 'node --version'"] 
      },
      linux: { 
        url: "https://nodejs.org/en/download", 
        steps: ["Use nvm: curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash", "Then run: nvm install 22", "Verify with 'node --version'"] 
      },
    },
  },
  {
    name: "npm",
    icon: <Package className="w-6 h-6" />,
    description: "Node package manager for JavaScript",
    latestVersion: "10.8.0",
    possibleVersions: ["8.19.0", "9.6.0", "10.2.0", "10.5.0", "10.8.0"],
    downloadUrl: "https://www.npmjs.com/package/npm",
    installInstructions: {
      windows: { 
        url: "https://docs.npmjs.com/downloading-and-installing-node-js-and-npm", 
        steps: ["npm comes bundled with Node.js", "Update npm: npm install -g npm@latest", "Verify with 'npm --version'"] 
      },
      macos: { 
        url: "https://docs.npmjs.com/downloading-and-installing-node-js-and-npm", 
        steps: ["npm comes bundled with Node.js", "Update: npm install -g npm@latest", "Verify with 'npm --version'"] 
      },
      linux: { 
        url: "https://docs.npmjs.com/downloading-and-installing-node-js-and-npm", 
        steps: ["npm comes bundled with Node.js", "Update: sudo npm install -g npm@latest", "Verify with 'npm --version'"] 
      },
    },
  },
  {
    name: "Git",
    icon: <GitBranch className="w-6 h-6" />,
    description: "Distributed version control system",
    latestVersion: "2.45.0",
    possibleVersions: ["2.39.0", "2.40.0", "2.42.0", "2.44.0", "2.45.0"],
    downloadUrl: "https://git-scm.com/downloads",
    installInstructions: {
      windows: { 
        url: "https://git-scm.com/download/win", 
        steps: ["Download Git for Windows from git-scm.com", "Run the installer with default settings", "Open Git Bash and verify with 'git --version'"] 
      },
      macos: { 
        url: "https://git-scm.com/download/mac", 
        steps: ["Install via Homebrew: brew install git", "Or install Xcode Command Line Tools: xcode-select --install", "Verify with 'git --version'"] 
      },
      linux: { 
        url: "https://git-scm.com/download/linux", 
        steps: ["Ubuntu/Debian: sudo apt-get install git", "Fedora: sudo dnf install git", "Verify with 'git --version'"] 
      },
    },
  },
  {
    name: "Docker",
    icon: <Box className="w-6 h-6" />,
    description: "Container platform for building and deploying applications",
    latestVersion: "25.0.3",
    possibleVersions: ["23.0.0", "24.0.0", "24.0.6", "25.0.0", "25.0.3"],
    downloadUrl: "https://www.docker.com/products/docker-desktop",
    installInstructions: {
      windows: { 
        url: "https://docs.docker.com/desktop/install/windows-install/", 
        steps: ["Download Docker Desktop for Windows", "Enable WSL 2 if prompted", "Run the installer and restart your computer", "Verify with 'docker --version'"] 
      },
      macos: { 
        url: "https://docs.docker.com/desktop/install/mac-install/", 
        steps: ["Download Docker Desktop for Mac", "Drag Docker to Applications folder", "Open Docker and complete setup", "Verify with 'docker --version'"] 
      },
      linux: { 
        url: "https://docs.docker.com/engine/install/", 
        steps: ["Follow the official Docker Engine installation guide", "Add your user to docker group: sudo usermod -aG docker $USER", "Log out and back in, then verify with 'docker --version'"] 
      },
    },
  },
  {
    name: "Python",
    icon: <Code2 className="w-6 h-6" />,
    description: "High-level programming language for general-purpose programming",
    latestVersion: "3.12.3",
    possibleVersions: ["3.9.0", "3.10.0", "3.11.4", "3.12.0", "3.12.3"],
    downloadUrl: "https://www.python.org/downloads/",
    installInstructions: {
      windows: { 
        url: "https://www.python.org/downloads/windows/", 
        steps: ["Download Python installer from python.org", "Check 'Add Python to PATH' during installation", "Run the installer", "Verify with 'python --version'"] 
      },
      macos: { 
        url: "https://www.python.org/downloads/macos/", 
        steps: ["Install via Homebrew: brew install python", "Or download from python.org", "Verify with 'python3 --version'"] 
      },
      linux: { 
        url: "https://www.python.org/downloads/source/", 
        steps: ["Ubuntu/Debian: sudo apt-get install python3", "Or use pyenv for version management", "Verify with 'python3 --version'"] 
      },
    },
  },
  {
    name: "PostgreSQL",
    icon: <Database className="w-6 h-6" />,
    description: "Open source relational database management system",
    latestVersion: "16.2",
    possibleVersions: ["14.0", "15.0", "15.5", "16.0", "16.2"],
    downloadUrl: "https://www.postgresql.org/download/",
    installInstructions: {
      windows: { 
        url: "https://www.postgresql.org/download/windows/", 
        steps: ["Download PostgreSQL installer from postgresql.org", "Run the installer and set a password", "Use pgAdmin or psql to manage databases", "Verify with 'psql --version'"] 
      },
      macos: { 
        url: "https://www.postgresql.org/download/macosx/", 
        steps: ["Install via Homebrew: brew install postgresql@16", "Start the service: brew services start postgresql@16", "Verify with 'psql --version'"] 
      },
      linux: { 
        url: "https://www.postgresql.org/download/linux/", 
        steps: ["Ubuntu: sudo apt-get install postgresql postgresql-contrib", "Start service: sudo systemctl start postgresql", "Verify with 'psql --version'"] 
      },
    },
  },
  {
    name: "pnpm",
    icon: <Layers className="w-6 h-6" />,
    description: "Fast, disk space efficient package manager",
    latestVersion: "9.1.0",
    possibleVersions: ["7.0.0", "8.0.0", "8.15.0", "9.0.0", "9.1.0"],
    downloadUrl: "https://pnpm.io/installation",
    installInstructions: {
      windows: { 
        url: "https://pnpm.io/installation#using-winget", 
        steps: ["Using npm: npm install -g pnpm", "Or using winget: winget install pnpm", "Verify with 'pnpm --version'"] 
      },
      macos: { 
        url: "https://pnpm.io/installation#using-homebrew", 
        steps: ["Using Homebrew: brew install pnpm", "Or using npm: npm install -g pnpm", "Verify with 'pnpm --version'"] 
      },
      linux: { 
        url: "https://pnpm.io/installation#using-npm", 
        steps: ["Using npm: npm install -g pnpm", "Or using curl: curl -fsSL https://get.pnpm.io/install.sh | sh -", "Verify with 'pnpm --version'"] 
      },
    },
  },
  {
    name: "Bun",
    icon: <Cpu className="w-6 h-6" />,
    description: "All-in-one JavaScript runtime & toolkit",
    latestVersion: "1.1.8",
    possibleVersions: ["1.0.0", "1.0.5", "1.1.0", "1.1.5", "1.1.8"],
    downloadUrl: "https://bun.sh/",
    installInstructions: {
      windows: { 
        url: "https://bun.sh/docs/installation#windows", 
        steps: ["Open PowerShell as Administrator", "Run: powershell -c \"irm bun.sh/install.ps1 | iex\"", "Restart your terminal", "Verify with 'bun --version'"] 
      },
      macos: { 
        url: "https://bun.sh/docs/installation#macos-and-linux", 
        steps: ["Using curl: curl -fsSL https://bun.sh/install | bash", "Or using Homebrew: brew tap oven-sh/bun && brew install bun", "Verify with 'bun --version'"] 
      },
      linux: { 
        url: "https://bun.sh/docs/installation#macos-and-linux", 
        steps: ["Using curl: curl -fsSL https://bun.sh/install | bash", "Add to your shell profile if needed", "Verify with 'bun --version'"] 
      },
    },
  },
]

// Helper function to generate random tool data
function generateRandomTools(): ToolInfo[] {
  return toolDefinitions.map((tool) => {
    const installed = Math.random() > 0.25 // 75% chance of being installed
    const versionIndex = Math.floor(Math.random() * tool.possibleVersions.length)
    const version = tool.possibleVersions[versionIndex]
    const isOutdated = installed && version !== tool.latestVersion
    
    return {
      name: tool.name,
      icon: tool.icon,
      installed,
      version: installed ? version : undefined,
      latestVersion: tool.latestVersion,
      isOutdated,
      description: tool.description,
      downloadUrl: tool.downloadUrl,
      installInstructions: tool.installInstructions,
    }
  })
}

// Generate random config issues
function generateRandomConfigIssues() {
  const allIssues = [
    { id: "1", file: ".npmrc", issue: "Missing registry configuration. Consider adding a registry URL for faster package resolution.", severity: "info" as const },
    { id: "2", file: "tsconfig.json", issue: "Strict mode is disabled. Enable 'strict: true' for better type safety.", severity: "warning" as const, line: 5 },
    { id: "3", file: ".gitignore", issue: "Missing common patterns. Consider adding node_modules, .env, and build directories.", severity: "info" as const },
    { id: "4", file: "package.json", issue: "No 'engines' field specified. Define Node.js version requirements.", severity: "warning" as const, line: 1 },
    { id: "5", file: ".eslintrc", issue: "ESLint configuration not found. Add linting for code quality.", severity: "warning" as const },
    { id: "6", file: ".prettierrc", issue: "Prettier not configured. Add formatting rules for consistent code style.", severity: "info" as const },
    { id: "7", file: "docker-compose.yml", issue: "Version field is deprecated. Remove the 'version' key.", severity: "info" as const, line: 1 },
    { id: "8", file: ".env.example", issue: "Environment template missing. Create an example file for required variables.", severity: "warning" as const },
  ]
  
  const count = Math.floor(Math.random() * 4) + 1
  return allIssues.sort(() => Math.random() - 0.5).slice(0, count)
}

// Generate random missing dependencies
function generateRandomMissingDeps() {
  const allDeps = [
    { id: "1", name: "@types/node", requiredBy: "tsconfig.json", type: "npm" as const, suggestion: "npm install -D @types/node" },
    { id: "2", name: "eslint", requiredBy: "package.json scripts", type: "npm" as const, suggestion: "npm install -D eslint" },
    { id: "3", name: "typescript", requiredBy: "tsconfig.json", type: "npm" as const, suggestion: "npm install -D typescript" },
    { id: "4", name: "@types/react", requiredBy: "React components", type: "npm" as const, suggestion: "npm install -D @types/react" },
    { id: "5", name: "dotenv", requiredBy: ".env usage", type: "npm" as const, suggestion: "npm install dotenv" },
    { id: "6", name: "jest", requiredBy: "test scripts", type: "npm" as const, suggestion: "npm install -D jest" },
  ]
  
  const count = Math.floor(Math.random() * 3) + 1
  return allDeps.sort(() => Math.random() - 0.5).slice(0, count)
}

// Generate recommendations based on tools
function generateRecommendations(tools: ToolInfo[]) {
  const recommendations = []
  
  const outdatedNode = tools.find(t => t.name === "Node.js" && t.isOutdated)
  if (outdatedNode) {
    recommendations.push({
      id: "node",
      title: "Update Node.js to version 22.x",
      description: "Your Node.js version is significantly outdated. Version 22.x includes performance improvements, new features, and security patches.",
      severity: "critical" as const,
      commands: [
        { os: "macos" as const, command: "brew upgrade node" },
        { os: "macos" as const, command: "nvm install 22 && nvm use 22" },
        { os: "windows" as const, command: "winget upgrade OpenJS.NodeJS" },
        { os: "windows" as const, command: "nvm install 22 && nvm use 22" },
        { os: "linux" as const, command: "nvm install 22 && nvm use 22" },
      ],
      downloads: [
        { os: "windows" as const, url: "https://nodejs.org/en/download", label: "Download Node.js for Windows" },
        { os: "macos" as const, url: "https://nodejs.org/en/download", label: "Download Node.js for macOS" },
        { os: "linux" as const, url: "https://nodejs.org/en/download", label: "Download Node.js for Linux" },
      ],
    })
  }

  const missingPostgres = tools.find(t => t.name === "PostgreSQL" && !t.installed)
  if (missingPostgres) {
    recommendations.push({
      id: "postgres",
      title: "Install PostgreSQL",
      description: "PostgreSQL is not installed on your system. Many projects require a local database for development.",
      severity: "warning" as const,
      commands: [
        { os: "macos" as const, command: "brew install postgresql@16" },
        { os: "windows" as const, command: "winget install PostgreSQL.PostgreSQL" },
        { os: "linux" as const, command: "sudo apt-get install postgresql postgresql-contrib" },
      ],
      downloads: [
        { os: "windows" as const, url: "https://www.postgresql.org/download/windows/", label: "PostgreSQL Windows Installer" },
        { os: "macos" as const, url: "https://www.postgresql.org/download/macosx/", label: "PostgreSQL macOS Downloads" },
        { os: "linux" as const, url: "https://www.postgresql.org/download/linux/", label: "PostgreSQL Linux Downloads" },
      ],
    })
  }

  const outdatedDocker = tools.find(t => t.name === "Docker" && t.isOutdated)
  if (outdatedDocker) {
    recommendations.push({
      id: "docker",
      title: "Update Docker to latest version",
      description: "A new version of Docker is available with bug fixes and new features.",
      severity: "warning" as const,
      commands: [
        { os: "macos" as const, command: "brew upgrade --cask docker" },
        { os: "windows" as const, command: "winget upgrade Docker.DockerDesktop" },
        { os: "linux" as const, command: "sudo apt-get update && sudo apt-get install docker-ce" },
      ],
      downloads: [
        { os: "windows" as const, url: "https://docs.docker.com/desktop/install/windows-install/", label: "Docker Desktop for Windows" },
        { os: "macos" as const, url: "https://docs.docker.com/desktop/install/mac-install/", label: "Docker Desktop for Mac" },
        { os: "linux" as const, url: "https://docs.docker.com/engine/install/", label: "Docker Engine for Linux" },
      ],
    })
  }

  const missingBun = tools.find(t => t.name === "Bun" && !t.installed)
  if (missingBun) {
    recommendations.push({
      id: "bun",
      title: "Consider installing Bun",
      description: "Bun is a fast JavaScript runtime that can significantly speed up your development workflow.",
      severity: "info" as const,
      commands: [
        { os: "macos" as const, command: "curl -fsSL https://bun.sh/install | bash" },
        { os: "windows" as const, command: "powershell -c \"irm bun.sh/install.ps1 | iex\"" },
        { os: "linux" as const, command: "curl -fsSL https://bun.sh/install | bash" },
      ],
      downloads: [
        { os: "windows" as const, url: "https://bun.sh/docs/installation#windows", label: "Bun Installation for Windows" },
        { os: "macos" as const, url: "https://bun.sh/docs/installation", label: "Bun Installation for macOS" },
        { os: "linux" as const, url: "https://bun.sh/docs/installation", label: "Bun Installation for Linux" },
      ],
    })
  }

  const outdatedPython = tools.find(t => t.name === "Python" && t.isOutdated)
  if (outdatedPython) {
    recommendations.push({
      id: "python",
      title: "Update Python to version 3.12",
      description: "Python 3.12 brings performance improvements and new syntax features.",
      severity: "warning" as const,
      commands: [
        { os: "macos" as const, command: "brew upgrade python" },
        { os: "windows" as const, command: "winget upgrade Python.Python.3.12" },
        { os: "linux" as const, command: "sudo apt-get install python3.12" },
      ],
      downloads: [
        { os: "windows" as const, url: "https://www.python.org/downloads/windows/", label: "Python for Windows" },
        { os: "macos" as const, url: "https://www.python.org/downloads/macos/", label: "Python for macOS" },
        { os: "linux" as const, url: "https://www.python.org/downloads/source/", label: "Python Source Downloads" },
      ],
    })
  }

  return recommendations
}

export function Dashboard() {
  const [isScanning, setIsScanning] = useState(false)
  const [healthScore, setHealthScore] = useState(0)
  const [hasScanned, setHasScanned] = useState(false)
  const [scanKey, setScanKey] = useState(0)

  // Generate randomized data on each scan
  const tools = useMemo(() => generateRandomTools(), [scanKey])
  const configIssues = useMemo(() => generateRandomConfigIssues(), [scanKey])
  const missingDependencies = useMemo(() => generateRandomMissingDeps(), [scanKey])
  const recommendations = useMemo(() => generateRecommendations(tools), [tools])

  const calculateHealth = useCallback(() => {
    const installedTools = tools.filter((t) => t.installed).length
    const upToDateTools = tools.filter((t) => t.installed && !t.isOutdated).length
    const totalTools = tools.length
    
    if (installedTools === 0) return 20
    
    const installScore = (installedTools / totalTools) * 50
    const updateScore = (upToDateTools / installedTools) * 50
    const issuesPenalty = Math.min(configIssues.length * 3, 15)
    const depsPenalty = Math.min(missingDependencies.length * 2, 10)
    
    return Math.max(20, Math.round(installScore + updateScore - issuesPenalty - depsPenalty))
  }, [tools, configIssues.length, missingDependencies.length])

  const runScan = useCallback(() => {
    // Increment scan key to regenerate random data
    setScanKey(prev => prev + 1)
    setIsScanning(true)
    setHasScanned(false)
    setHealthScore(0)

    // Simulate scanning animation
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 15
      if (progress >= 100) {
        clearInterval(interval)
        setIsScanning(false)
        setHasScanned(true)
      }
    }, 200)
  }, [])

  // Calculate health score after scan completes
  useEffect(() => {
    if (hasScanned && !isScanning) {
      setHealthScore(calculateHealth())
    }
  }, [hasScanned, isScanning, calculateHealth])

  // Auto-run scan on mount
  useEffect(() => {
    const timer = setTimeout(runScan, 500)
    return () => clearTimeout(timer)
  }, [])

  const installedCount = tools.filter((t) => t.installed).length
  const outdatedCount = tools.filter((t) => t.installed && t.isOutdated).length
  const notInstalledCount = tools.filter((t) => !t.installed).length

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section with Health Orb */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <HealthOrb healthScore={healthScore} isScanning={isScanning} hasScanned={hasScanned} />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            {isScanning 
              ? "Scanning Your Environment..." 
              : hasScanned 
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
            subtitle={`of ${tools.length} detected`}
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
            value={configIssues.length}
            subtitle="to review"
            icon={Package}
            variant={configIssues.length > 0 ? "warning" : "success"}
          />
        </div>

        {/* Tools Grid */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">Detected Developer Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tools.map((tool) => (
              <ToolCard key={tool.name} tool={tool} />
            ))}
          </div>
        </div>

        {/* Two Column Layout for Issues */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <ConfigIssues issues={configIssues} />
          <MissingDependencies dependencies={missingDependencies} />
        </div>

        {/* Recommendations */}
        <RecommendationsPanel recommendations={recommendations} />
      </div>
    </div>
  )
}












