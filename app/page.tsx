import { ExperimentSetup } from "@/components/experiment-setup"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-foreground">LLM Experiment Platform</h1>
          <p className="text-muted-foreground mt-1">Run experiments & evaluations on multi-agent systems</p>
        </div>
      </header>
      <main className="container mx-auto px-6 py-8">
        <ExperimentSetup />
      </main>
    </div>
  )
}
