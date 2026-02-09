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
    <Card className="border-0 shadow-sm">
      <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
        <CardTitle className="text-lg sm:text-xl">Upload Dataset</CardTitle>
        <CardDescription className="text-sm sm:text-base">
          Upload a CSV, JSON, or Excel file containing input prompts for your experiments
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-4 sm:space-y-6">
        {!uploadedFile ? (
          <div
            {...getRootProps()}
            className={cn(
              "border-2 border-dashed rounded-xl p-6 sm:p-8 text-center cursor-pointer transition-all duration-200",
              isDragActive ? "border-primary bg-primary/5 scale-[1.02]" : "border-border hover:border-primary/50 hover:bg-muted/30",
            )}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 rounded-full bg-muted">
                <Upload className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
              </div>
              <div>
                <p className="text-base sm:text-lg font-semibold text-foreground">
                  {isDragActive ? "Drop your file here" : "Drag & drop your dataset"}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">or click to browse files (CSV, JSON, XLSX, XLS)</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 sm:p-4 border rounded-lg bg-muted/30">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <div className="flex-shrink-0">
                  <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-sm sm:text-base truncate">{uploadedFile.name}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">{formatFileSize(uploadedFile.size)}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <Button variant="ghost" size="sm" onClick={() => setUploadedFile(null)} className="h-8 w-8 sm:h-9 sm:w-9">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {uploadedFile.preview && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Dataset Preview</Label>
                <div className="border rounded-lg p-3 sm:p-4 bg-muted/50 overflow-x-auto">
                  <pre className="text-xs sm:text-sm text-muted-foreground whitespace-pre-wrap break-words">
                    {uploadedFile.preview.join("\n")}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}

        {isProcessing && (
          <div className="flex items-center justify-center p-6 sm:p-8">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-2 border-primary border-t-transparent"></div>
              <span className="text-xs sm:text-sm text-muted-foreground">Processing file...</span>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-between pt-2 sm:pt-4">
          <Button variant="outline" onClick={onBack} className="h-10 sm:h-11 bg-transparent">
            Back
          </Button>
          <Button onClick={onComplete} disabled={!uploadedFile || isProcessing} className="h-10 sm:h-11">
            Continue to LLM Configuration
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
