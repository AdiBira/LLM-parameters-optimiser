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
    <Card className="border-0 shadow-sm">
      <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
        <CardTitle className="text-lg sm:text-xl">LLM Configuration Manager</CardTitle>
        <CardDescription className="text-sm sm:text-base">Configure LLM settings for each agent in your multi-agent system</CardDescription>
      </CardHeader>
      <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-4 sm:space-y-6">
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

              <Button onClick={addConfig} disabled={!currentConfig.model} className="w-full h-10 sm:h-11 mt-2">
                <Plus className="h-4 w-4 mr-2" />
                Add Configuration
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Existing Configurations */}
        {configs.length > 0 && (
          <div className="space-y-3 sm:space-y-4 pt-2">
            <Separator />
            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Configured Agents ({configs.length})</h3>
              <div className="space-y-2 sm:space-y-3">
                {configs.map((config) => (
                  <Card key={config.id} className="p-3 sm:p-4 hover:shadow-sm transition-shadow">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
                      <div className="space-y-2 min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="secondary" className="text-xs sm:text-sm">{config.agent}</Badge>
                          <Badge variant="outline" className="text-xs sm:text-sm">{config.model}</Badge>
                        </div>
                        <div className="text-xs sm:text-sm text-muted-foreground">
                          Temp: {config.temperature} | Tokens: {config.maxTokens}
                          {config.structuredOutput && " | JSON Mode"}
                          {config.stream && " | Streaming"}
                          {config.fallbackModel && ` | Fallback: ${config.fallbackModel}`}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => removeConfig(config.id)} className="h-8 w-8 sm:h-9 sm:w-9 flex-shrink-0">
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
          <Button onClick={onComplete} disabled={configs.length === 0} className="h-10 sm:h-11 order-1 sm:order-2">
            Continue to Prompt Management ({configs.length} configs)
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
