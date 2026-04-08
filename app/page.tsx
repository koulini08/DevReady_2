import { Header } from "@/components/header"
import { Dashboard } from "@/components/dashboard"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Dashboard />
    </main>
  )
}
