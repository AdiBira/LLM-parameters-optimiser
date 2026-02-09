"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DatasetUpload } from "@/components/dataset-upload"
import { LLMConfigManager } from "@/components/llm-config-manager"
import { PromptManager } from "@/components/prompt-manager"
import { ExperimentResults } from "@/components/experiment-results"
import { CheckCircle, Circle, Upload, Settings, MessageSquare, Play } from "lucide-react"

type ExperimentStep = "setup" | "dataset" | "llm-config" | "prompts" | "results"

export function ExperimentSetup() {
  const [currentStep, setCurrentStep] = useState<ExperimentStep>("setup")
  const [experimentTitle, setExperimentTitle] = useState("")
  const [completedSteps, setCompletedSteps] = useState<Set<ExperimentStep>>(new Set())

  const steps = [
    { id: "setup", label: "Setup Experiment", icon: Circle },
    { id: "dataset", label: "Upload Dataset", icon: Upload },
    { id: "llm-config", label: "LLM Configuration", icon: Settings },
    { id: "prompts", label: "Prompt Management", icon: MessageSquare },
    { id: "results", label: "Run & Results", icon: Play },
  ] as const

  const completeStep = (step: ExperimentStep) => {
    setCompletedSteps((prev) => new Set([...prev, step]))
  }

  const isStepCompleted = (step: ExperimentStep) => completedSteps.has(step)

  return (
    <div className="space-y-8">
      {/* Progress Steps */}
      <Card>
        <CardHeader>
          <CardTitle>Experiment Progress</CardTitle>
          <CardDescription>Complete each step to set up your experiment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = isStepCompleted(step.id) ? CheckCircle : step.icon
              const isActive = currentStep === step.id

              return (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`flex items-center space-x-2 ${isActive ? "text-primary" : isStepCompleted(step.id) ? "text-green-600" : "text-muted-foreground"}`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-sm font-medium">{step.label}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`mx-4 h-px w-8 ${isStepCompleted(step.id) ? "bg-green-600" : "bg-border"}`} />
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      {currentStep === "setup" && (
        <Card>
          <CardHeader>
            <CardTitle>Setup Experiment</CardTitle>
            <CardDescription>Give your experiment a descriptive title</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="experiment-title">Experiment Title</Label>
              <Input
                id="experiment-title"
                placeholder="e.g., Planner orchestration with different models, Prompts V14"
                value={experimentTitle}
                onChange={(e) => setExperimentTitle(e.target.value)}
              />
            </div>
            <Button
              onClick={() => {
                if (experimentTitle.trim()) {
                  completeStep("setup")
                  setCurrentStep("dataset")
                }
              }}
              disabled={!experimentTitle.trim()}
            >
              Continue to Dataset Upload
            </Button>
          </CardContent>
        </Card>
      )}

      {currentStep === "dataset" && (
        <DatasetUpload
          onComplete={() => {
            completeStep("dataset")
            setCurrentStep("llm-config")
          }}
          onBack={() => setCurrentStep("setup")}
        />
      )}

      {currentStep === "llm-config" && (
        <LLMConfigManager
          onComplete={() => {
            completeStep("llm-config")
            setCurrentStep("prompts")
          }}
          onBack={() => setCurrentStep("dataset")}
        />
      )}

      {currentStep === "prompts" && (
        <PromptManager
          onComplete={() => {
            completeStep("prompts")
            setCurrentStep("results")
          }}
          onBack={() => setCurrentStep("llm-config")}
        />
      )}

      {currentStep === "results" && (
        <ExperimentResults experimentTitle={experimentTitle} onBack={() => setCurrentStep("prompts")} />
      )}
    </div>
  )
}
