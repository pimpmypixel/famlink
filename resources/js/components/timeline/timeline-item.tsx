import { useState, useEffect } from "react"
import type { TimelineItem, Attachment } from "@/lib/types"
import { getAuthorColor, getCategoryColor, formatDate } from "@/lib/timeline-utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, MessageCircle, Paperclip, Download, Trash2, File, FileImage, FileText, FileVideo } from "lucide-react"
import { capitalise } from "@/lib/utils"
import { FileUploadModal } from "@/components/file-upload-modal"
import { router } from '@inertiajs/react'
import { CommentsSheet } from "@/components/comments-sheet";

interface TimelineItemProps {
  item: TimelineItem
  isLeft: boolean
  isCenter?: boolean
  forceExpanded?: boolean
  forceCollapsed?: boolean
  onToggle?: (id: string, isExpanded: boolean) => void
  onAddComment?: (itemId: string) => void
  onAddFile?: (itemId: string) => void
}

export function TimelineItemComponent({
  item,
  isLeft,
  isCenter = false,
  forceExpanded,
  forceCollapsed,
  onToggle,
  onAddComment,
  onAddFile
}: TimelineItemProps) {
  // console.log(item,'item')
  const [isExpanded, setIsExpanded] = useState(!item.isCollapsed)
  const [isHovered, setIsHovered] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [showFileUpload, setShowFileUpload] = useState(false)

  useEffect(() => {
    if (forceExpanded !== undefined) {
      setIsExpanded(forceExpanded)
    } else if (forceCollapsed !== undefined) {
      setIsExpanded(!forceCollapsed)
    }
  }, [forceExpanded, forceCollapsed])

  const authorColorClass = getAuthorColor(item.user.role)
  const categoryColorClass = getCategoryColor(item.category)

  const handleToggle = () => {
    const newExpanded = !isExpanded
    setIsExpanded(newExpanded)
    onToggle?.(item.id, newExpanded)
  }

  const handleAddComment = () => {
    onAddComment?.(item.id)
  }

  const handleAddFile = () => {
    setShowFileUpload(true)
  }

  const handleFileUploadSuccess = () => {
    // Refresh the page to get updated attachments
    window.location.reload()
  }

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) {
      return <FileImage className="h-4 w-4 text-blue-500" />
    } else if (mimeType.startsWith('video/')) {
      return <FileVideo className="h-4 w-4 text-red-500" />
    } else if (mimeType.includes('pdf') || mimeType.includes('document')) {
      return <FileText className="h-4 w-4 text-green-500" />
    } else {
      return <File className="h-4 w-4 text-gray-500" />
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleDownload = (attachment: Attachment) => {
    window.open(attachment.url, '_blank')
  }

  const handleDeleteAttachment = (attachment: Attachment) => {
    if (!confirm(`Are you sure you want to delete "${attachment.original_name}"?`)) {
      return
    }

    router.delete(`/timeline/${item.id}/attachment/${attachment.id}`, {
      onSuccess: () => {
        // Refresh the page to get updated attachments
        window.location.reload()
      },
      onError: (errors) => {
        alert('Failed to delete attachment: ' + (errors.error || 'Unknown error'))
      },
    })
  }

  return (
    <div className={`flex w-full ${isCenter ? "justify-center" : isLeft ? "justify-start sm:pr-8" : "justify-end sm:pl-8"}`}>
      <Card
        className={`w-full ${isCenter ? "max-w-2xl" : "max-w-md sm:max-w-md"} max-w-full border-2 ${authorColorClass} relative transition-all duration-200`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardHeader className="pb-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={categoryColorClass}>
                {capitalise(typeof item.category === 'string' ? item.category : 'Uncategorized')}
              </Badge>

            </div>
            <Button variant="ghost" size="sm" onClick={handleToggle} className="h-6 w-6 p-0">
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full">
            <CardTitle className="text-lg underline flex-1">{item.title}</CardTitle>
            <button
              type="button"
              className="flex items-center text-xs text-muted-foreground mt-2 sm:mt-0 ml-0 sm:ml-1 rounded px-2 py-1 border border-current bg-teal-100 hover:bg-green-300 dark:hover:bg-gray-800 w-full sm:w-auto justify-center"
              onClick={() => setShowComments(true)}
              aria-label="Show comments"
            >
              <MessageCircle className="h-3 w-3 mr-0.5" />
              {Array.isArray(item.comments) ? item.comments.length : 0} kommentarer
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            <span className={`px-2 py-0.5 border border-current rounded-md mr-1 inline-block align-middle bg-white dark:bg-black uppercase font-medium ${authorColorClass}`}>
              {item.user.role ?? 'N/A'}
            </span>
            - {formatDate(item.timestamp)}
          </p>
          <div className="flex flex-wrap gap-1">
            {item.tags?.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-[10px] text-neutral-700 dark:text-neutral-200">
                {capitalise(typeof tag === 'string' ? tag : 'Unknown')}
              </Badge>
            )) ?? null}
          </div>
        </CardHeader>

        {isExpanded && (
          <CardContent className="pb-4">
            <p className="text-sm mb-3 leading-relaxed">{item.content}</p>

            {/* Attachments Section */}
            {item.attachments && item.attachments.length > 0 && (
              <div className="mb-3">
                <h4 className="text-sm font-medium mb-2 flex items-center">
                  <Paperclip className="h-4 w-4 mr-1" />
                  Filer ({item.attachments.length})
                </h4>
                <div className="space-y-2">
                  {item.attachments.map((attachment) => (
                    <div key={attachment.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                      <div className="flex items-center space-x-2 flex-1 min-w-0">
                        {getFileIcon(attachment.mime_type)}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{attachment.original_name}</p>
                          <p className="text-xs text-muted-foreground">{formatFileSize(attachment.size)}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownload(attachment)}
                          className="h-8 w-8 p-0"
                          title="Download"
                        >
                          <Download className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteAttachment(attachment)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          title="Delete"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        )}

        <CommentsSheet open={showComments} onOpenChange={setShowComments} comments={item.comments ?? []} />


        {/* Action buttons that appear on hover */}
        {isHovered && (
          <div className="absolute bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border rounded-b-lg p-2 flex justify-center gap-2 transition-all duration-200">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleAddComment}
              className="h-8 px-3 text-xs hover:bg-accent"
            >
              <MessageCircle className="h-3 w-3 mr-1" />
              Tilføj Kommentar
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleAddFile}
              className="h-8 px-3 text-xs hover:bg-accent"
            >
              <Paperclip className="h-3 w-3 mr-1" />
              Tilføj Fil
            </Button>
          </div>
        )}
      </Card>

      <FileUploadModal
        isOpen={showFileUpload}
        onClose={() => setShowFileUpload(false)}
        timelineItemId={item.id}
        onUploadSuccess={handleFileUploadSuccess}
      />
    </div>
  )
}
