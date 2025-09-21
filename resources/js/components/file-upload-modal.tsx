import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Upload, X, File, FileImage, FileText, FileVideo } from 'lucide-react'
import { router } from '@inertiajs/react'

interface FileUploadModalProps {
  isOpen: boolean
  onClose: () => void
  timelineItemId: string
  onUploadSuccess?: () => void
}

export function FileUploadModal({ isOpen, onClose, timelineItemId, onUploadSuccess }: FileUploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB')
        return
      }
      setSelectedFile(file)
      setError(null)
    }
  }

  const handleUpload = () => {
    if (!selectedFile) return

    setIsUploading(true)
    setError(null)

    const formData = new FormData()
    formData.append('file', selectedFile)

    router.post(`/timeline/${timelineItemId}/upload`, formData, {
      onSuccess: () => {
        // Reset form
        setSelectedFile(null)
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }

        // Call success callback
        onUploadSuccess?.()

        // Close modal
        onClose()
      },
      onError: (errors: Record<string, string>) => {
        // Handle validation errors or other errors
        if (errors.file) {
          setError(errors.file)
        } else if (errors.error) {
          setError(errors.error)
        } else if (errors.attachment) {
          setError(errors.attachment)
        } else {
          setError('Upload failed. Please try again.')
        }
      },
      onFinish: () => {
        setIsUploading(false)
      },
    })
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <FileImage className="h-8 w-8 text-blue-500" />
    } else if (file.type.startsWith('video/')) {
      return <FileVideo className="h-8 w-8 text-red-500" />
    } else if (file.type.includes('pdf') || file.type.includes('document')) {
      return <FileText className="h-8 w-8 text-green-500" />
    } else {
      return <File className="h-8 w-8 text-gray-500" />
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Upload File</DialogTitle>
          <DialogDescription>
            Select a file to upload to this timeline item. Files will be stored securely in the cloud.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="file-upload">Choose File</Label>
            <Input
              id="file-upload"
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="*/*"
              className="mt-1"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Maximum file size: 10MB. All file types are supported.
            </p>
          </div>

          {selectedFile && (
            <div className="border rounded-lg p-4 bg-muted/50">
              <div className="flex items-center space-x-3">
                {getFileIcon(selectedFile)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{selectedFile.name}</p>
                  <p className="text-xs text-muted-foreground">{formatFileSize(selectedFile.size)}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedFile(null)
                    if (fileInputRef.current) {
                      fileInputRef.current.value = ''
                    }
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
              {error}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isUploading}>
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
          >
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload File
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}