"use client"

import { cn } from "@/lib/utils"

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
      {/* Progress Indicator - Minimalist Timeline */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2">
        {steps.map((step, index) => {
          const Icon = isStepCompleted(step.id) ? CheckCircle : step.icon
          const isActive = currentStep === step.id
          const isCompleted = isStepCompleted(step.id)

          return (
            <div key={step.id} className="flex items-center gap-1.5 sm:gap-2">
              <div
                className={`flex flex-col items-center justify-center h-9 w-9 sm:h-10 sm:w-10 rounded-lg transition-all ${
                  isCompleted 
                    ? "bg-green-50 text-green-600" 
                    : isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted text-muted-foreground"
                }`}
                onClick={() => isCompleted && setCurrentStep(step.id)}
                role={isCompleted ? "button" : undefined}
                className={cn(
                  "flex flex-col items-center justify-center h-9 w-9 sm:h-10 sm:w-10 rounded-lg transition-all cursor-pointer",
                  isCompleted 
                    ? "bg-green-50 text-green-600 hover:bg-green-100" 
                    : isActive 
                    ? "bg-primary text-primary-foreground shadow-md" 
                    : "bg-muted text-muted-foreground"
                )}
              >
                <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              {index < steps.length - 1 && (
                <div className={`h-px w-3 sm:w-4 ${isCompleted ? "bg-green-200" : "bg-border"}`} />
              )}
            </div>
          )
        })}
      </div>

      {/* Step Content */}
      {currentStep === "setup" && (
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-foreground">Create Experiment</h2>
            <p className="text-muted-foreground font-light">Give your experiment a descriptive name</p>
          </div>

          <Card className="border-0 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
            <CardContent className="p-6 sm:p-8 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="experiment-title" className="font-medium">Experiment Title</Label>
                <Input
                  id="experiment-title"
                  placeholder="e.g., Planner orchestration with GPT-4, Prompts V14"
                  value={experimentTitle}
                  onChange={(e) => setExperimentTitle(e.target.value)}
                  className="h-11 border-border/40 rounded-lg bg-muted/30 focus:bg-white transition-colors"
                />
                <p className="text-xs text-muted-foreground font-light mt-2">Be descriptive about models, prompt versions, or objectives</p>
              </div>

              <Button
                onClick={() => {
                  if (experimentTitle.trim()) {
                    completeStep("setup")
                    setCurrentStep("dataset")
                  }
                }}
                disabled={!experimentTitle.trim()}
                className="w-full h-11 bg-primary hover:bg-primary/90 font-medium"
              >
                Continue
              </Button>
            </CardContent>
          </Card>
        </div>
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
