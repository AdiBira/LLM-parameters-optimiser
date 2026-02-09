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
    <div className="space-y-4 sm:space-y-6">
      <Card className="border-0 shadow-sm">
        <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
          <CardTitle className="text-lg sm:text-xl">Experiment: {experimentTitle}</CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Run experiments across different LLM configurations and prompt versions, then evaluate results
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-4 sm:space-y-6">
          {/* Experiment Overview */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
            <Card className="p-3 sm:p-4 hover:shadow-sm transition-shadow">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Target className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">Total</span>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold">{experiments.length}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Experiments</p>
                </div>
              </div>
            </Card>
            <Card className="p-3 sm:p-4 hover:shadow-sm transition-shadow">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-green-600">
                  <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">Completed</span>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold">{completedExperiments.length}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Results</p>
                </div>
              </div>
            </Card>
            <Card className="p-3 sm:p-4 hover:shadow-sm transition-shadow">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-blue-600">
                  <Clock className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">Avg Latency</span>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold">
                    {completedExperiments.length > 0
                      ? Math.round(
                          completedExperiments.reduce((sum, exp) => sum + (exp.results?.avgLatency || 0), 0) /
                            completedExperiments.length,
                        )
                      : 0}
                    s
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground">average</p>
                </div>
              </div>
            </Card>
            <Card className="p-3 sm:p-4 hover:shadow-sm transition-shadow">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-purple-600">
                  <Zap className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">Best Score</span>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold">
                    {bestExperiment?.results ? bestExperiment.results.avgEvalScore.toFixed(1) : "N/A"}
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground">performance</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Evaluation Setup */}
          <Card className="border-dashed border-2">
            <CardHeader className="px-4 sm:px-6 py-3 sm:py-4 pb-2 sm:pb-3">
              <CardTitle className="text-base sm:text-lg">Evaluation Setup</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Configure how you want to evaluate the experiment results</CardDescription>
            </CardHeader>
            <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Evaluation Type</label>
                  <Select value={evalType} onValueChange={setEvalType}>
                    <SelectTrigger className="h-10 sm:h-11">
                      <SelectValue placeholder="Select evaluation type" />
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
                  <label className="text-sm font-medium">Evaluation Method</label>
                  <Select value={evalMethod} onValueChange={setEvalMethod}>
                    <SelectTrigger className="h-10 sm:h-11">
                      <SelectValue placeholder="Select evaluation method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manual">Manual Human Scoring</SelectItem>
                      <SelectItem value="llm-judge">LLM as a Judge</SelectItem>
                      <SelectItem value="conditional">Basic Conditional Scoring</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Experiment List */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
              <h3 className="text-base sm:text-lg font-semibold">Experiment Combinations</h3>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <Button variant="outline" size="sm" className="h-9 text-xs sm:text-sm bg-transparent">
                  <Download className="h-4 w-4 mr-2" />
                  Export Results
                </Button>
                <Button onClick={runExperiments} disabled={isRunning} size="sm" className="h-9 text-xs sm:text-sm">
                  <Play className="h-4 w-4 mr-2" />
                  {isRunning ? "Running..." : "Run All Experiments"}
                </Button>
              </div>
            </div>

            <div className="space-y-2 sm:space-y-3">
              {experiments.map((experiment) => (
                <Card key={experiment.id} className="p-3 sm:p-4 hover:shadow-sm transition-shadow">
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
                      <div className="space-y-1.5 min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="secondary" className="text-xs sm:text-sm truncate">{experiment.configVersion}</Badge>
                          <Badge variant="outline" className="text-xs sm:text-sm">{experiment.promptVersion}</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(experiment.status)}`} />
                          <span className="text-xs sm:text-sm capitalize">{experiment.status}</span>
                        </div>
                      </div>
                      {experiment.results && (
                        <div className="text-right flex-shrink-0">
                          <p className="text-lg sm:text-xl font-semibold">{experiment.results.avgEvalScore.toFixed(1)}</p>
                          <p className="text-xs text-muted-foreground">Eval Score</p>
                        </div>
                      )}
                    </div>

                    {experiment.status === "running" && (
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span>Progress</span>
                          <span>{experiment.progress}%</span>
                        </div>
                        <Progress value={experiment.progress} className="h-2" />
                      </div>
                    )}

                    {experiment.results && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 text-xs sm:text-sm">
                        <div>
                          <p className="text-muted-foreground">TTFT</p>
                          <p className="font-medium">{experiment.results.avgTTFT}s</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Latency</p>
                          <p className="font-medium">{experiment.results.avgLatency}s</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Success Rate</p>
                          <p className="font-medium">{experiment.results.successRate}%</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Responses</p>
                          <p className="font-medium">{experiment.results.totalResponses}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-between pt-2 sm:pt-4">
            <Button variant="outline" onClick={onBack} className="h-10 sm:h-11 order-2 sm:order-1 bg-transparent">
              Back
            </Button>
            <Button disabled={completedExperiments.length === 0} className="h-10 sm:h-11 order-1 sm:order-2">
              View Detailed Analysis ({completedExperiments.length} completed)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
