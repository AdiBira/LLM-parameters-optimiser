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
    <Card>
      <CardHeader>
        <CardTitle>Upload Dataset</CardTitle>
        <CardDescription>
          Upload a CSV, JSON, or Excel file containing input prompts for your experiments
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!uploadedFile ? (
          <div
            {...getRootProps()}
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
              isDragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
            )}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center space-y-4">
              <Upload className="h-12 w-12 text-muted-foreground" />
              <div>
                <p className="text-lg font-medium">
                  {isDragActive ? "Drop your file here" : "Drag & drop your dataset"}
                </p>
                <p className="text-sm text-muted-foreground mt-1">or click to browse files (CSV, JSON, XLSX, XLS)</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg bg-card">
              <div className="flex items-center space-x-3">
                <FileText className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-medium">{uploadedFile.name}</p>
                  <p className="text-sm text-muted-foreground">{formatFileSize(uploadedFile.size)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <Button variant="ghost" size="sm" onClick={() => setUploadedFile(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {uploadedFile.preview && (
              <div className="space-y-2">
                <Label>Dataset Preview</Label>
                <div className="border rounded-lg p-4 bg-muted/50">
                  <pre className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {uploadedFile.preview.join("\n")}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}

        {isProcessing && (
          <div className="flex items-center justify-center p-8">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span className="text-sm text-muted-foreground">Processing file...</span>
            </div>
          </div>
        )}

        <div className="flex justify-between">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button onClick={onComplete} disabled={!uploadedFile || isProcessing}>
            Continue to LLM Configuration
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
