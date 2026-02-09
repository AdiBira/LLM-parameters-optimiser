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
    <Card>
      <CardHeader>
        <CardTitle>LLM Configuration Manager</CardTitle>
        <CardDescription>Configure LLM settings for each agent in your multi-agent system</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Agent Selection */}
        <div className="space-y-2">
          <Label>Select Agent</Label>
          <Select value={selectedAgent} onValueChange={setSelectedAgent}>
            <SelectTrigger>
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
          <Card className="border-dashed">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configure {selectedAgent.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Model Selection */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Model</Label>
                  <Select
                    value={currentConfig.model}
                    onValueChange={(value) => setCurrentConfig({ ...currentConfig, model: value })}
                  >
                    <SelectTrigger>
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
                  <Label>Fallback Model</Label>
                  <Select
                    value={currentConfig.fallbackModel}
                    onValueChange={(value) => setCurrentConfig({ ...currentConfig, fallbackModel: value })}
                  >
                    <SelectTrigger>
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
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Temperature</Label>
                  <Input
                    type="number"
                    min="0"
                    max="1"
                    step="0.1"
                    value={currentConfig.temperature}
                    onChange={(e) =>
                      setCurrentConfig({ ...currentConfig, temperature: Number.parseFloat(e.target.value) })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Max Tokens</Label>
                  <Input
                    type="number"
                    min="1"
                    max="8192"
                    value={currentConfig.maxTokens}
                    onChange={(e) => setCurrentConfig({ ...currentConfig, maxTokens: Number.parseInt(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Max Retries</Label>
                  <Input
                    type="number"
                    min="0"
                    max="10"
                    value={currentConfig.maxRetries}
                    onChange={(e) =>
                      setCurrentConfig({ ...currentConfig, maxRetries: Number.parseInt(e.target.value) })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Top P</Label>
                  <Input
                    type="number"
                    min="0"
                    max="1"
                    step="0.1"
                    value={currentConfig.topP}
                    onChange={(e) => setCurrentConfig({ ...currentConfig, topP: Number.parseFloat(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Top K</Label>
                  <Input
                    type="number"
                    min="1"
                    max="100"
                    value={currentConfig.topK}
                    onChange={(e) => setCurrentConfig({ ...currentConfig, topK: Number.parseInt(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Presence Penalty</Label>
                  <Input
                    type="number"
                    min="-2"
                    max="2"
                    step="0.1"
                    value={currentConfig.presencePenalty}
                    onChange={(e) =>
                      setCurrentConfig({ ...currentConfig, presencePenalty: Number.parseFloat(e.target.value) })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Frequency Penalty</Label>
                  <Input
                    type="number"
                    min="-2"
                    max="2"
                    step="0.1"
                    value={currentConfig.frequencyPenalty}
                    onChange={(e) =>
                      setCurrentConfig({ ...currentConfig, frequencyPenalty: Number.parseFloat(e.target.value) })
                    }
                  />
                </div>
              </div>

              {/* Boolean Parameters */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="structured-output"
                    checked={currentConfig.structuredOutput}
                    onCheckedChange={(checked) => setCurrentConfig({ ...currentConfig, structuredOutput: checked })}
                  />
                  <Label htmlFor="structured-output">Structured Output (JSON Mode)</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="stream"
                    checked={currentConfig.stream}
                    onCheckedChange={(checked) => setCurrentConfig({ ...currentConfig, stream: checked })}
                  />
                  <Label htmlFor="stream">Stream</Label>
                </div>
              </div>

              <Button onClick={addConfig} disabled={!currentConfig.model} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Configuration
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Existing Configurations */}
        {configs.length > 0 && (
          <div className="space-y-4">
            <Separator />
            <div>
              <h3 className="text-lg font-semibold mb-4">Configured Agents ({configs.length})</h3>
              <div className="space-y-3">
                {configs.map((config) => (
                  <Card key={config.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{config.agent}</Badge>
                          <Badge variant="outline">{config.model}</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Temp: {config.temperature} | Tokens: {config.maxTokens} |
                          {config.structuredOutput && " JSON Mode |"}
                          {config.stream && " Streaming |"}
                          {config.fallbackModel && ` Fallback: ${config.fallbackModel}`}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => removeConfig(config.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button onClick={onComplete} disabled={configs.length === 0}>
            Continue to Prompt Management ({configs.length} configs)
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
