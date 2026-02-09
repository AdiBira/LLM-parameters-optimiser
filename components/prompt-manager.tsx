"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { MessageSquare, Edit, Trash2, Save } from "lucide-react"

interface PromptManagerProps {
  onComplete: () => void
  onBack: () => void
}

interface PromptVersion {
  id: string
  name: string
  agent: string
  systemPrompt: string
  userPrompt: string
  version: number
  createdAt: Date
}

const AVAILABLE_AGENTS = ["ui_agent", "basic_chat_agent", "etl_agent", "planning_agent", "cube_agent", "python_agent"]

export function PromptManager({ onComplete, onBack }: PromptManagerProps) {
  const [promptVersions, setPromptVersions] = useState<PromptVersion[]>([])
  const [selectedAgent, setSelectedAgent] = useState<string>("")
  const [currentPrompt, setCurrentPrompt] = useState({
    systemPrompt: "",
    userPrompt: "",
    versionName: "",
  })
  const [editingPrompt, setEditingPrompt] = useState<string | null>(null)

  // Sample existing prompts for demonstration
  const existingPrompts = {
    ui_agent: {
      system: "You are a UI agent responsible for generating user interface components and layouts.",
      user: "Generate a {component_type} component with the following specifications: {specifications}",
    },
    planning_agent: {
      system: "You are a planning agent that orchestrates tasks across multiple agents in the system.",
      user: "Plan the execution of the following task: {task_description}. Consider available agents and their capabilities.",
    },
    python_agent: {
      system: "You are a Python code execution agent. Write and execute Python code to solve problems.",
      user: "Execute the following Python task: {task}. Provide code and results.",
    },
  }

  const loadExistingPrompt = (agent: string) => {
    const existing = existingPrompts[agent as keyof typeof existingPrompts]
    if (existing) {
      setCurrentPrompt({
        systemPrompt: existing.system,
        userPrompt: existing.user,
        versionName: `${agent}_v1`,
      })
    }
  }

  const savePromptVersion = () => {
    if (!selectedAgent || !currentPrompt.versionName) return

    const newVersion: PromptVersion = {
      id: Date.now().toString(),
      name: currentPrompt.versionName,
      agent: selectedAgent,
      systemPrompt: currentPrompt.systemPrompt,
      userPrompt: currentPrompt.userPrompt,
      version: promptVersions.filter((p) => p.agent === selectedAgent).length + 1,
      createdAt: new Date(),
    }

    setPromptVersions([...promptVersions, newVersion])
    setCurrentPrompt({ systemPrompt: "", userPrompt: "", versionName: "" })
    setSelectedAgent("")
  }

  const deletePromptVersion = (id: string) => {
    setPromptVersions(promptVersions.filter((p) => p.id !== id))
  }

  const editPromptVersion = (prompt: PromptVersion) => {
    setSelectedAgent(prompt.agent)
    setCurrentPrompt({
      systemPrompt: prompt.systemPrompt,
      userPrompt: prompt.userPrompt,
      versionName: `${prompt.name}_edited`,
    })
    setEditingPrompt(prompt.id)
  }

  const groupedPrompts = promptVersions.reduce(
    (acc, prompt) => {
      if (!acc[prompt.agent]) acc[prompt.agent] = []
      acc[prompt.agent].push(prompt)
      return acc
    },
    {} as Record<string, PromptVersion[]>,
  )

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
        <CardTitle className="text-lg sm:text-xl">Prompt Management System</CardTitle>
        <CardDescription className="text-sm sm:text-base">Manage system and user prompts for each agent in your multi-agent system</CardDescription>
      </CardHeader>
      <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-4 sm:space-y-6">
        {/* Agent Selection */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Select Agent</Label>
          <Select value={selectedAgent} onValueChange={setSelectedAgent}>
            <SelectTrigger className="h-10 sm:h-11">
              <SelectValue placeholder="Choose an agent to configure prompts" />
            </SelectTrigger>
            <SelectContent>
              {AVAILABLE_AGENTS.map((agent) => (
                <SelectItem key={agent} value={agent}>
                  {agent.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedAgent && (
          <Card className="border-dashed border-2">
            <CardHeader className="px-4 sm:px-6 py-3 sm:py-4 pb-2 sm:pb-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  Configure Prompts for {selectedAgent.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                </CardTitle>
                {existingPrompts[selectedAgent as keyof typeof existingPrompts] && (
                  <Button variant="outline" size="sm" onClick={() => loadExistingPrompt(selectedAgent)} className="h-9 text-xs sm:text-sm">
                    Load Existing
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-4">
              {/* Version Name */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Version Name</Label>
                <Input
                  placeholder="e.g., planning_v14, ui_optimized_v2"
                  value={currentPrompt.versionName}
                  onChange={(e) => setCurrentPrompt({ ...currentPrompt, versionName: e.target.value })}
                  className="h-10 sm:h-11"
                />
              </div>

              {/* System Prompt */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">System Prompt</Label>
                <Textarea
                  placeholder="Define the agent's role, capabilities, and behavior..."
                  className="min-h-[100px] sm:min-h-[120px] text-sm"
                  value={currentPrompt.systemPrompt}
                  onChange={(e) => setCurrentPrompt({ ...currentPrompt, systemPrompt: e.target.value })}
                />
              </div>

              {/* User Prompt */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">User Prompt Template</Label>
                <Textarea
                  placeholder="Define the user input template with variables like {task}, {context}..."
                  className="min-h-[80px] sm:min-h-[100px] text-sm"
                  value={currentPrompt.userPrompt}
                  onChange={(e) => setCurrentPrompt({ ...currentPrompt, userPrompt: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  Use variables in curly braces like {"{task}"}, {"{context}"}, {"{specifications}"} for dynamic content
                </p>
              </div>

              <Button
                onClick={savePromptVersion}
                disabled={!currentPrompt.systemPrompt || !currentPrompt.versionName}
                className="w-full h-10 sm:h-11 mt-2"
              >
                <Save className="h-4 w-4 mr-2" />
                {editingPrompt ? "Update Prompt Version" : "Save Prompt Version"}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Existing Prompt Versions */}
        {Object.keys(groupedPrompts).length > 0 && (
          <div className="space-y-3 sm:space-y-4 pt-2">
            <Separator />
            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
                Prompt Versions ({promptVersions.length} total across {Object.keys(groupedPrompts).length} agents)
              </h3>
              <div className="space-y-3 sm:space-y-4">
                {Object.entries(groupedPrompts).map(([agent, prompts]) => (
                  <Card key={agent} className="p-3 sm:p-4 hover:shadow-sm transition-shadow">
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs sm:text-sm">
                          {agent.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                        </Badge>
                        <span className="text-xs sm:text-sm text-muted-foreground">{prompts.length} versions</span>
                      </div>
                      <div className="space-y-2">
                        {prompts.map((prompt) => (
                          <div key={prompt.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-2 sm:p-3 border rounded-lg hover:bg-muted/30 transition-colors">
                            <div className="space-y-1 min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-medium text-xs sm:text-sm truncate">{prompt.name}</span>
                                <Badge variant="outline" className="text-xs">
                                  v{prompt.version}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground line-clamp-2">
                                {prompt.systemPrompt.substring(0, 100)}...
                              </p>
                            </div>
                            <div className="flex items-center gap-1 flex-shrink-0">
                              <Button variant="ghost" size="sm" onClick={() => editPromptVersion(prompt)} className="h-8 w-8 sm:h-9 sm:w-9">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => deletePromptVersion(prompt.id)} className="h-8 w-8 sm:h-9 sm:w-9">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-between pt-2 sm:pt-4">
          <Button variant="outline" onClick={onBack} className="h-10 sm:h-11 order-2 sm:order-1 bg-transparent">
            Back
          </Button>
          <Button onClick={onComplete} disabled={promptVersions.length === 0} className="h-10 sm:h-11 order-1 sm:order-2">
            Continue to Experiment Setup ({promptVersions.length} prompt versions)
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
