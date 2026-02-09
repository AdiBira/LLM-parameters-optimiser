"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Play, Download, BarChart3, Clock, Zap, Target } from "lucide-react"

interface ExperimentResultsProps {
  experimentTitle: string
  onBack: () => void
}

interface ExperimentCombination {
  id: string
  configVersion: string
  promptVersion: string
  status: "pending" | "running" | "completed" | "failed"
  progress: number
  results?: {
    avgEvalScore: number
    avgTTFT: number
    avgLatency: number
    totalResponses: number
    successRate: number
  }
}

export function ExperimentResults({ experimentTitle, onBack }: ExperimentResultsProps) {
  const [experiments, setExperiments] = useState<ExperimentCombination[]>([
    {
      id: "1",
      configVersion: "LLM Config v12 (GPT-4o, GPT-5, Claude Sonnet 3.7)",
      promptVersion: "Prompt v14",
      status: "completed",
      progress: 100,
      results: {
        avgEvalScore: 4.2,
        avgTTFT: 15,
        avgLatency: 18,
        totalResponses: 150,
        successRate: 97,
      },
    },
    {
      id: "2",
      configVersion: "LLM Config v12 (GPT-4o, GPT-5, Claude Sonnet 3.7)",
      promptVersion: "Prompt v15",
      status: "completed",
      progress: 100,
      results: {
        avgEvalScore: 3.4,
        avgTTFT: 12,
        avgLatency: 16,
        totalResponses: 150,
        successRate: 84,
      },
    },
    {
      id: "3",
      configVersion: "LLM Config v13 (Gemini 2.5 Flash, DeepSeek V3)",
      promptVersion: "Prompt v14",
      status: "running",
      progress: 65,
    },
    {
      id: "4",
      configVersion: "LLM Config v14 (Claude Sonnet 4, Llama 3.3 70B)",
      promptVersion: "Prompt v15",
      status: "pending",
      progress: 0,
    },
  ])

  const [isRunning, setIsRunning] = useState(false)
  const [evalType, setEvalType] = useState<string>("")
  const [evalMethod, setEvalMethod] = useState<string>("")

  const runExperiments = () => {
    setIsRunning(true)
    // Simulate running experiments
    setTimeout(() => {
      setExperiments((prev) =>
        prev.map((exp) => ({
          ...exp,
          status: exp.status === "pending" ? "running" : exp.status,
          progress: exp.status === "pending" ? 30 : exp.progress,
        })),
      )
    }, 1000)

    setTimeout(() => {
      setIsRunning(false)
      setExperiments((prev) =>
        prev.map((exp) => ({
          ...exp,
          status: "completed",
          progress: 100,
          results: exp.results || {
            avgEvalScore: Math.random() * 2 + 3,
            avgTTFT: Math.random() * 10 + 10,
            avgLatency: Math.random() * 8 + 15,
            totalResponses: 150,
            successRate: Math.random() * 20 + 80,
          },
        })),
      )
    }, 5000)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500"
      case "running":
        return "bg-blue-500"
      case "failed":
        return "bg-red-500"
      default:
        return "bg-gray-400"
    }
  }

  const completedExperiments = experiments.filter((exp) => exp.status === "completed")
  const bestExperiment = completedExperiments.reduce(
    (best, current) =>
      current.results && best.results && current.results.avgEvalScore > best.results.avgEvalScore ? current : best,
    completedExperiments[0],
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">Run Experiments</h2>
        <p className="text-muted-foreground font-light">{experimentTitle}</p>
      </div>

      {/* Experiment Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 border border-border/40 rounded-lg bg-background hover:bg-muted/30 transition-colors">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Target className="h-4 w-4" />
              <span className="text-xs font-medium">Total</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{experiments.length}</p>
            </div>
          </div>
        </div>
        <div className="p-4 border border-border/40 rounded-lg bg-background hover:bg-muted/30 transition-colors">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-green-600">
              <BarChart3 className="h-4 w-4" />
              <span className="text-xs font-medium">Completed</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{completedExperiments.length}</p>
            </div>
          </div>
        </div>
        <div className="p-4 border border-border/40 rounded-lg bg-background hover:bg-muted/30 transition-colors">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-blue-600">
              <Clock className="h-4 w-4" />
              <span className="text-xs font-medium">Avg Latency</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {completedExperiments.length > 0
                  ? Math.round(
                      completedExperiments.reduce((sum, exp) => sum + (exp.results?.avgLatency || 0), 0) /
                        completedExperiments.length,
                    )
                  : 0}
                s
              </p>
            </div>
          </div>
        </div>
        <div className="p-4 border border-border/40 rounded-lg bg-background hover:bg-muted/30 transition-colors">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary">
              <Zap className="h-4 w-4" />
              <span className="text-xs font-medium">Best Score</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {bestExperiment?.results ? bestExperiment.results.avgEvalScore.toFixed(1) : "—"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <Card className="border-0 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
        <CardContent className="p-6 sm:p-8 space-y-6">
          {/* Experiment Overview */}

          {/* Evaluation Setup */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">Evaluation Setup</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Type</label>
                <Select value={evalType} onValueChange={setEvalType}>
                  <SelectTrigger className="h-11 border-border/40 rounded-lg bg-muted/30 focus:bg-white transition-colors">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="output-based">Output Based</SelectItem>
                    <SelectItem value="orchestration">Orchestration</SelectItem>
                    <SelectItem value="tool-selection">Tool Selection</SelectItem>
                    <SelectItem value="context-coherence">Memory/Context Coherence</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Method</label>
                <Select value={evalMethod} onValueChange={setEvalMethod}>
                  <SelectTrigger className="h-11 border-border/40 rounded-lg bg-muted/30 focus:bg-white transition-colors">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manual">Manual Human Scoring</SelectItem>
                    <SelectItem value="llm-judge">LLM as a Judge</SelectItem>
                    <SelectItem value="conditional">Basic Conditional Scoring</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Experiment List */}
          <div className="space-y-4 pt-4 border-t border-border/40">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-foreground">Experiment Combinations</h3>
                <p className="text-xs text-muted-foreground mt-1 font-light">{experiments.length} total combinations</p>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button variant="outline" size="sm" className="h-10 text-xs border-border/40 hover:bg-muted/50 flex-1 sm:flex-none bg-transparent">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button onClick={runExperiments} disabled={isRunning} size="sm" className="h-10 text-xs bg-primary hover:bg-primary/90 flex-1 sm:flex-none">
                  <Play className="h-4 w-4 mr-2" />
                  {isRunning ? "Running..." : "Run"}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              {experiments.map((experiment) => (
                <div key={experiment.id} className="p-4 border border-border/40 rounded-lg bg-background hover:bg-muted/20 transition-colors group">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <Badge variant="secondary" className="text-xs">{experiment.configVersion}</Badge>
                          <Badge variant="outline" className="text-xs">{experiment.promptVersion}</Badge>
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(experiment.status)}`} />
                          <span className="text-xs font-medium capitalize text-muted-foreground">{experiment.status}</span>
                        </div>
                        {experiment.results && (
                          <p className="text-xs text-muted-foreground">
                            Score: <span className="font-mono font-semibold text-foreground">{experiment.results.avgEvalScore.toFixed(1)}</span>
                          </p>
                        )}
                      </div>
                      {experiment.results && (
                        <div className="text-right flex-shrink-0">
                          <p className="text-lg font-bold text-primary">{experiment.results.avgEvalScore.toFixed(1)}</p>
                        </div>
                      )}
                    </div>

                    {experiment.status === "running" && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Progress</span>
                          <span className="font-mono">{experiment.progress}%</span>
                        </div>
                        <Progress value={experiment.progress} className="h-1.5" />
                      </div>
                    )}

                    {experiment.results && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-2 border-t border-border/40">
                        <div>
                          <p className="text-muted-foreground font-medium">TTFT</p>
                          <p className="font-mono">{experiment.results.avgTTFT}s</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground font-medium">Latency</p>
                          <p className="font-mono">{experiment.results.avgLatency}s</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground font-medium">Success</p>
                          <p className="font-mono">{experiment.results.successRate}%</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground font-medium">Responses</p>
                          <p className="font-mono">{experiment.results.totalResponses}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col-reverse sm:flex-row gap-3 justify-between">
        <Button variant="outline" onClick={onBack} className="h-11 border-border/40 hover:bg-muted/50 font-medium bg-transparent">
          Back
        </Button>
        <Button disabled={completedExperiments.length === 0} className="h-11 bg-primary hover:bg-primary/90 font-medium">
          View Analysis
        </Button>
      </div>
    </div>
  )
}
