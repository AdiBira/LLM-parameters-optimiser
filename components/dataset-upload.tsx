"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useDropzone } from "react-dropzone"
import { Upload, FileText, CheckCircle, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface DatasetUploadProps {
  onComplete: () => void
  onBack: () => void
}

interface UploadedFile {
  name: string
  size: number
  type: string
  preview?: string[]
}

export function DatasetUpload({ onComplete, onBack }: DatasetUploadProps) {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      setIsProcessing(true)

      // Simulate file processing
      setTimeout(() => {
        const reader = new FileReader()
        reader.onload = (e) => {
          const content = e.target?.result as string
          const lines = content.split("\n").slice(0, 5) // Preview first 5 lines

          setUploadedFile({
            name: file.name,
            size: file.size,
            type: file.type,
            preview: lines.filter((line) => line.trim()),
          })
          setIsProcessing(false)
        }
        reader.readAsText(file)
      }, 1500)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "application/json": [".json"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "application/vnd.ms-excel": [".xls"],
    },
    maxFiles: 1,
  })

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">Upload Dataset</h2>
        <p className="text-muted-foreground font-light">Add your dataset to begin experiments</p>
      </div>

      {/* Main Content */}
      <Card className="border-0 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
        <CardContent className="p-0">
          {!uploadedFile ? (
            <div
              {...getRootProps()}
              className={cn(
                "border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-300 relative overflow-hidden",
                isDragActive 
                  ? "border-primary bg-primary/3 scale-[1.01]" 
                  : "border-border/60 hover:border-primary/60 hover:bg-muted/20",
              )}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center gap-4">
                <div className="p-3 rounded-xl bg-muted/50">
                  <Upload className="h-7 w-7 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-lg font-medium text-foreground">
                    {isDragActive ? "Release to upload" : "Drag & drop your dataset"}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2 font-light">
                    CSV, JSON, XLSX, XLS — {`<100MB`}
                  </p>
                </div>
                <button className="px-4 py-2 text-sm font-medium text-primary hover:bg-primary/5 rounded-lg transition-colors">
                  or browse
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 sm:p-8 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border border-border/40 rounded-xl bg-muted/20 hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="flex-shrink-0 p-2 rounded-lg bg-primary/10">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{uploadedFile.name}</p>
                    <p className="text-xs text-muted-foreground">{formatFileSize(uploadedFile.size)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="flex items-center gap-1 px-2 py-1 bg-green-50 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-xs font-medium text-green-700">Ready</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setUploadedFile(null)} className="h-8 w-8 text-muted-foreground hover:text-foreground">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {uploadedFile.preview && (
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Preview</Label>
                  <div className="border border-border/40 rounded-xl p-4 bg-muted/20 overflow-x-auto">
                    <pre className="text-xs text-muted-foreground font-mono whitespace-pre-wrap break-words">
                      {uploadedFile.preview.join("\n")}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )}

          {isProcessing && (
            <div className="p-8 sm:p-12 flex items-center justify-center">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent"></div>
                <span className="text-sm text-muted-foreground font-light">Processing...</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col-reverse sm:flex-row gap-3 justify-between">
        <Button 
          variant="outline" 
          onClick={onBack} 
          className="h-10 sm:h-11 border-border/40 hover:bg-muted/50 font-medium bg-transparent"
        >
          Back
        </Button>
        <Button 
          onClick={onComplete} 
          disabled={!uploadedFile || isProcessing} 
          className="h-10 sm:h-11 bg-primary hover:bg-primary/90 font-medium"
        >
          Continue
        </Button>
      </div>
    </div>
  )
}
