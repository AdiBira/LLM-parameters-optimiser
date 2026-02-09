import { ExperimentSetup } from "@/components/experiment-setup"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="w-full px-4 sm:px-6 py-3 sm:py-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">LLM Experiment Platform</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">Run experiments & evaluations on multi-agent systems</p>
          </div>
        </div>
      </header>
      <main className="flex-1 w-full px-4 sm:px-6 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto">
          <ExperimentSetup />
        </div>
      </main>
    </div>
  )
}
