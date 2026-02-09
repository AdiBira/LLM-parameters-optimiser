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
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">Create Prompts</h2>
        <p className="text-muted-foreground font-light">Define system and user prompts for each agent</p>
      </div>

      <Card className="border-0 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
        <CardContent className="p-6 sm:p-8 space-y-4 sm:space-y-6">
          {/* Agent Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Select Agent</Label>
            <Select value={selectedAgent} onValueChange={setSelectedAgent}>
              <SelectTrigger className="h-11 border-border/40 rounded-lg bg-muted/30 focus:bg-white transition-colors">
                <SelectValue placeholder="Choose an agent" />
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
            <div className="pt-2 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">
                  {selectedAgent.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                </h3>
                {existingPrompts[selectedAgent as keyof typeof existingPrompts] && (
                  <Button variant="outline" size="sm" onClick={() => loadExistingPrompt(selectedAgent)} className="h-9 text-xs border-border/40">
                    Load Previous
                  </Button>
                )}
              </div>

              {/* Version Name */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Version</Label>
                <Input
                  placeholder="e.g., v1, optimized, with_memory"
                  value={currentPrompt.versionName}
                  onChange={(e) => setCurrentPrompt({ ...currentPrompt, versionName: e.target.value })}
                  className="h-11 border-border/40 rounded-lg bg-muted/30 focus:bg-white transition-colors"
                />
              </div>

              {/* System Prompt */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">System Prompt</Label>
                <Textarea
                  placeholder="You are a helpful agent. Your role is to..."
                  className="min-h-[100px] text-sm border-border/40 rounded-lg bg-muted/30 focus:bg-white transition-colors resize-none"
                  value={currentPrompt.systemPrompt}
                  onChange={(e) => setCurrentPrompt({ ...currentPrompt, systemPrompt: e.target.value })}
                />
              </div>

              {/* User Prompt */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">User Template</Label>
                <Textarea
                  placeholder="Task: {task}&#10;Context: {context}"
                  className="min-h-[80px] text-sm font-mono border-border/40 rounded-lg bg-muted/30 focus:bg-white transition-colors resize-none"
                  value={currentPrompt.userPrompt}
                  onChange={(e) => setCurrentPrompt({ ...currentPrompt, userPrompt: e.target.value })}
                />
                <p className="text-xs text-muted-foreground font-light">Use {`{variable}`} syntax for dynamic content</p>
              </div>

              <Button
                onClick={savePromptVersion}
                disabled={!currentPrompt.systemPrompt || !currentPrompt.versionName}
                className="w-full h-11 bg-primary hover:bg-primary/90 font-medium mt-2"
              >
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Existing Prompt Versions */}
      {Object.keys(groupedPrompts).length > 0 && (
        <Card className="border-0 bg-muted/20">
          <CardContent className="p-6 sm:p-8 space-y-4">
            <div className="flex items-baseline gap-2">
              <h3 className="text-lg font-semibold">Saved Prompts</h3>
              <span className="text-xs font-medium px-2 py-1 rounded-lg bg-primary/10 text-primary">{promptVersions.length}</span>
            </div>
            <div className="space-y-3">
              {Object.entries(groupedPrompts).map(([agent, prompts]) => (
                <div key={agent} className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    {agent.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                  </p>
                  <div className="space-y-2">
                    {prompts.map((prompt) => (
                      <div key={prompt.id} className="flex items-center justify-between p-3 border border-border/40 rounded-lg hover:bg-background/50 transition-colors group">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm truncate">{prompt.name}</span>
                            <Badge variant="outline" className="text-xs">v{prompt.version}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {prompt.systemPrompt.substring(0, 80)}...
                          </p>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                          <Button variant="ghost" size="sm" onClick={() => editPromptVersion(prompt)} className="h-8 w-8">
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => deletePromptVersion(prompt.id)} className="h-8 w-8">
                            <Trash2 className="h-3.5 w-3.5 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex flex-col-reverse sm:flex-row gap-3 justify-between">
        <Button variant="outline" onClick={onBack} className="h-11 border-border/40 hover:bg-muted/50 font-medium bg-transparent">
          Back
        </Button>
        <Button onClick={onComplete} disabled={promptVersions.length === 0} className="h-11 bg-primary hover:bg-primary/90 font-medium">
          Continue
        </Button>
      </div>
    </div>
  )
}
