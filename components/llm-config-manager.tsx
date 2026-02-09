"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Plus, Settings, Trash2 } from "lucide-react"

interface LLMConfigManagerProps {
  onComplete: () => void
  onBack: () => void
}

interface LLMConfig {
  id: string
  name: string
  agent: string
  model: string
  temperature: number
  maxTokens: number
  topP: number
  topK: number
  maxRetries: number
  structuredOutput: boolean
  stream: boolean
  presencePenalty: number
  frequencyPenalty: number
  fallbackModel: string
}

const AVAILABLE_AGENTS = ["ui_agent", "basic_chat_agent", "etl_agent", "planning_agent", "cube_agent", "python_agent"]

const AVAILABLE_MODELS = [
  "GPT-4o",
  "GPT-5",
  "Gemini 2.5 Flash",
  "Gemini 2.5 Pro",
  "Claude Sonnet 4",
  "Deepseek V3",
  "Llama 3.3 70B",
]

export function LLMConfigManager({ onComplete, onBack }: LLMConfigManagerProps) {
  const [configs, setConfigs] = useState<LLMConfig[]>([])
  const [selectedAgent, setSelectedAgent] = useState<string>("")
  const [currentConfig, setCurrentConfig] = useState<Partial<LLMConfig>>({
    model: "",
    temperature: 0.7,
    maxTokens: 2048,
    topP: 1,
    topK: 50,
    maxRetries: 3,
    structuredOutput: false,
    stream: false,
    presencePenalty: 0,
    frequencyPenalty: 0,
    fallbackModel: "",
  })

  const addConfig = () => {
    if (!selectedAgent || !currentConfig.model) return

    const newConfig: LLMConfig = {
      id: Date.now().toString(),
      name: `${selectedAgent}_${currentConfig.model}_config`,
      agent: selectedAgent,
      model: currentConfig.model!,
      temperature: currentConfig.temperature!,
      maxTokens: currentConfig.maxTokens!,
      topP: currentConfig.topP!,
      topK: currentConfig.topK!,
      maxRetries: currentConfig.maxRetries!,
      structuredOutput: currentConfig.structuredOutput!,
      stream: currentConfig.stream!,
      presencePenalty: currentConfig.presencePenalty!,
      frequencyPenalty: currentConfig.frequencyPenalty!,
      fallbackModel: currentConfig.fallbackModel!,
    }

    setConfigs([...configs, newConfig])
    setSelectedAgent("")
    setCurrentConfig({
      model: "",
      temperature: 0.7,
      maxTokens: 2048,
      topP: 1,
      topK: 50,
      maxRetries: 3,
      structuredOutput: false,
      stream: false,
      presencePenalty: 0,
      frequencyPenalty: 0,
      fallbackModel: "",
    })
  }

  const removeConfig = (id: string) => {
    setConfigs(configs.filter((config) => config.id !== id))
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">Configure LLM Models</h2>
        <p className="text-muted-foreground font-light">Set up parameters for each agent</p>
      </div>

      <Card className="border-0 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
        <CardContent className="p-6 sm:p-8 space-y-4 sm:space-y-6">
          {/* Agent Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Select Agent</Label>
            <Select value={selectedAgent} onValueChange={setSelectedAgent}>
              <SelectTrigger className="h-10 sm:h-11">
                <SelectValue placeholder="Choose an agent to configure" />
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
                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                  <Settings className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  Configure {selectedAgent.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-4">
                {/* Model Selection */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Model</Label>
                    <Select
                      value={currentConfig.model}
                      onValueChange={(value) => setCurrentConfig({ ...currentConfig, model: value })}
                    >
                      <SelectTrigger className="h-10 sm:h-11">
                        <SelectValue placeholder="Select model" />
                      </SelectTrigger>
                      <SelectContent>
                        {AVAILABLE_MODELS.map((model) => (
                          <SelectItem key={model} value={model}>
                            {model}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Fallback Model</Label>
                    <Select
                      value={currentConfig.fallbackModel}
                      onValueChange={(value) => setCurrentConfig({ ...currentConfig, fallbackModel: value })}
                    >
                      <SelectTrigger className="h-10 sm:h-11">
                        <SelectValue placeholder="Select fallback model" />
                      </SelectTrigger>
                      <SelectContent>
                        {AVAILABLE_MODELS.map((model) => (
                          <SelectItem key={model} value={model}>
                            {model}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Numeric Parameters */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Temperature</Label>
                    <Input
                      type="number"
                      min="0"
                      max="1"
                      step="0.1"
                      value={currentConfig.temperature}
                      onChange={(e) =>
                        setCurrentConfig({ ...currentConfig, temperature: Number.parseFloat(e.target.value) })
                      }
                      className="h-10 sm:h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Max Tokens</Label>
                    <Input
                      type="number"
                      min="1"
                      max="8192"
                      value={currentConfig.maxTokens}
                      onChange={(e) => setCurrentConfig({ ...currentConfig, maxTokens: Number.parseInt(e.target.value) })}
                      className="h-10 sm:h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Max Retries</Label>
                    <Input
                      type="number"
                      min="0"
                      max="10"
                      value={currentConfig.maxRetries}
                      onChange={(e) =>
                        setCurrentConfig({ ...currentConfig, maxRetries: Number.parseInt(e.target.value) })
                      }
                      className="h-10 sm:h-11"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Top P</Label>
                    <Input
                      type="number"
                      min="0"
                      max="1"
                      step="0.1"
                      value={currentConfig.topP}
                      onChange={(e) => setCurrentConfig({ ...currentConfig, topP: Number.parseFloat(e.target.value) })}
                      className="h-10 sm:h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Top K</Label>
                    <Input
                      type="number"
                      min="1"
                      max="100"
                      value={currentConfig.topK}
                      onChange={(e) => setCurrentConfig({ ...currentConfig, topK: Number.parseInt(e.target.value) })}
                      className="h-10 sm:h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Presence Penalty</Label>
                    <Input
                      type="number"
                      min="-2"
                      max="2"
                      step="0.1"
                      value={currentConfig.presencePenalty}
                      onChange={(e) =>
                        setCurrentConfig({ ...currentConfig, presencePenalty: Number.parseFloat(e.target.value) })
                      }
                      className="h-10 sm:h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Frequency Penalty</Label>
                    <Input
                      type="number"
                      min="-2"
                      max="2"
                      step="0.1"
                      value={currentConfig.frequencyPenalty}
                      onChange={(e) =>
                        setCurrentConfig({ ...currentConfig, frequencyPenalty: Number.parseFloat(e.target.value) })
                      }
                      className="h-10 sm:h-11"
                    />
                  </div>
                </div>

                {/* Boolean Parameters */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center sm:justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <Switch
                      id="structured-output"
                      checked={currentConfig.structuredOutput}
                      onCheckedChange={(checked) => setCurrentConfig({ ...currentConfig, structuredOutput: checked })}
                    />
                    <Label htmlFor="structured-output" className="text-sm font-medium">Structured Output (JSON Mode)</Label>
                  </div>

                  <div className="flex items-center gap-2">
                    <Switch
                      id="stream"
                      checked={currentConfig.stream}
                      onCheckedChange={(checked) => setCurrentConfig({ ...currentConfig, stream: checked })}
                    />
                    <Label htmlFor="stream" className="text-sm font-medium">Stream</Label>
                  </div>
                </div>

              <Button onClick={addConfig} disabled={!currentConfig.model} className="w-full h-11 bg-primary hover:bg-primary/90 font-medium mt-2">
                <Plus className="h-4 w-4 mr-2" />
                Add Configuration
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Existing Configurations */}
        {configs.length > 0 && (
          <div className="space-y-4 pt-4">
            <div className="flex items-baseline gap-2">
              <h3 className="text-lg font-semibold">Configured Agents</h3>
              <span className="text-xs font-medium px-2 py-1 rounded-lg bg-muted text-muted-foreground">{configs.length}</span>
            </div>
            <div className="grid gap-3">
              {configs.map((config) => (
                <div key={config.id} className="flex items-center justify-between p-4 border border-border/40 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors group">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <Badge variant="secondary" className="text-xs">{config.agent}</Badge>
                      <Badge variant="outline" className="text-xs font-normal">{config.model}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Temp: <span className="font-mono">{config.temperature}</span>
                      {config.structuredOutput && " · JSON"}
                      {config.stream && " · Streaming"}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => removeConfig(config.id)} className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>

      {/* Actions */}
      <div className="flex flex-col-reverse sm:flex-row gap-3 justify-between">
        <Button variant="outline" onClick={onBack} className="h-11 border-border/40 hover:bg-muted/50 font-medium bg-transparent">
          Back
        </Button>
        <Button onClick={onComplete} disabled={configs.length === 0} className="h-11 bg-primary hover:bg-primary/90 font-medium">
          Continue
        </Button>
      </div>
    </div>
  )
}
