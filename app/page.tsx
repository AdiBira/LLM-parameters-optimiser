import { ExperimentSetup } from "@/components/experiment-setup"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="w-full px-4 sm:px-6 py-4 sm:py-5">
          <div className="max-w-7xl mx-auto flex items-start justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight">LLM Experiment Platform</h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 font-light">Run experiments & evaluations on multi-agent systems</p>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 w-full px-4 sm:px-6 py-8 sm:py-12 bg-gradient-to-br from-background via-background to-muted/20">
        <div className="max-w-6xl mx-auto">
          <ExperimentSetup />
        </div>
      </main>
    </div>
  )
}
