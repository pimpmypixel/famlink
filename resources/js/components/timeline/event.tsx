import { useState, useEffect } from "react"
import type { Event, Attachment, User } from "@/lib/types"
import { getAuthorColor, getCategoryColor, formatDate } from "@/lib/timeline-utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, MessageCircle, Paperclip, Download, Trash2, File, FileImage, FileText, FileVideo, Mic, Camera, Upload, Plus } from "lucide-react"
import { capitalise } from "@/lib/utils"
import { FileUploadModal } from "@/components/file-upload-modal"
import { router } from '@inertiajs/react'
import { CommentsSheet } from "@/components/comments-sheet"
import { store as storeComment } from "@/routes/timeline/comments/index"
import { Toast } from "@/components/ui/toast"

interface EventProps {
  item: Event
  isLeft: boolean
  isCenter?: boolean
  forceExpanded?: boolean
  forceCollapsed?: boolean
  onToggle?: (id: string, isExpanded: boolean) => void
  onAddComment?: (itemId: string) => void
  onAddFile?: (itemId: string) => void
  user?: User
}

export function EventComponent({
  item,
  isLeft,
  isCenter = false,
  forceExpanded,
  forceCollapsed,
  onToggle,
  onAddComment,
  onAddFile,
  user
}: EventProps) {
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

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleAddCommentSubmit = (content: string, parentCommentId?: string) => {
    router.post(storeComment.url(item.id), {
      content,
      parent_comment_id: parentCommentId,
    }, {
      preserveScroll: true,
      onSuccess: () => {
        setToastMessage(parentCommentId ? 'Svaret blev tilføjet!' : 'Kommentaren blev tilføjet!');
        // Refetch the timeline item to get latest comments
        router.reload({ only: ['timelineItems'], preserveUrl: true });
      },
      onError: (errors) => {
        setToastMessage('Der opstod en fejl ved tilføjelse af kommentar.');
        console.error('Error adding comment:', errors)
      }
    })
  }

  const handleAddFile = () => {
    onAddFile?.(item.id)
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
    } else if (mimeType.startsWith('audio/')) {
      return <Mic className="h-4 w-4 text-purple-500" />
    } else if (mimeType.includes('pdf') || mimeType.includes('document')) {
      return <FileText className="h-4 w-4 text-green-500" />
    } else {
      return <File className="h-4 w-4 text-gray-500" />
    }
  }

  const getContentTypeIndicators = () => {
    const indicators = []
    const attachments = item.attachments || []

    if (attachments.some(att => att.mime_type.startsWith('image/'))) {
      indicators.push({ icon: Camera, label: 'Billeder', color: 'text-blue-600 bg-blue-50' })
    }
    if (attachments.some(att => att.mime_type.startsWith('video/'))) {
      indicators.push({ icon: FileVideo, label: 'Video', color: 'text-red-600 bg-red-50' })
    }
    if (attachments.some(att => att.mime_type.startsWith('audio/'))) {
      indicators.push({ icon: Mic, label: 'Lyd', color: 'text-purple-600 bg-purple-50' })
    }
    if (attachments.some(att => att.mime_type.includes('pdf') || att.mime_type.includes('document'))) {
      indicators.push({ icon: FileText, label: 'Dokumenter', color: 'text-green-600 bg-green-50' })
    }

    return indicators
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
        className={`w-full ${isCenter ? "max-w-2xl" : "max-w-md sm:max-w-md"} max-w-full border-2 ${authorColorClass} relative transition-all duration-200 hover:shadow-lg group`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className={categoryColorClass}>
                {capitalise(typeof item.category === 'object' && item.category?.name ? item.category.name : (typeof item.category === 'string' ? item.category : 'Uncategorized'))}
              </Badge>

              {/* Multi-modal content indicators */}
              {getContentTypeIndicators().map((indicator, index) => (
                <Badge key={index} variant="secondary" className={`text-xs ${indicator.color} border-0 flex items-center gap-1`}>
                  <indicator.icon className="h-3 w-3" />
                  <span className="hidden sm:inline">{indicator.label}</span>
                </Badge>
              ))}

              {/* Live upload indicator */}
              {(item.attachments && item.attachments.length > 0) && (
                <Badge variant="outline" className="text-xs text-orange-600 bg-orange-50 border-orange-200 flex items-center gap-1">
                  <Upload className="h-3 w-3" />
                  <span className="hidden sm:inline">Live Upload</span>
                </Badge>
              )}
            </div>
            <Button variant="ghost" size="sm" onClick={handleToggle} className="h-6 w-6 p-0 hover:bg-muted">
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>

          <CardTitle className="text-lg underline flex-1 leading-tight">{item.title}</CardTitle>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mt-2">
            <button
              type="button"
              className="flex items-center text-xs text-muted-foreground rounded px-2 py-1 border border-current bg-teal-100 hover:bg-green-300 dark:hover:bg-gray-800 transition-colors"
              onClick={() => setShowComments(true)}
              aria-label="Show comments"
            >
              <MessageCircle className="h-3 w-3 mr-1" />
              {Array.isArray(item.comments) ? item.comments.length : 0} kommentarer
            </button>
          </div>

          <p className="text-xs text-muted-foreground mt-2">
            <span className={`px-2 py-0.5 border border-current rounded-md mr-1 inline-block align-middle bg-white dark:bg-black uppercase font-medium ${authorColorClass}`}>
              {item.user.role ?? 'N/A'}
            </span>
            - {formatDate(item.timestamp)}
          </p>

          <div className="flex flex-wrap gap-1 mt-2">
            {/* Family tag for admin users */}
            {user && (user.role === 'admin' || user.role === 'super-admin') && item.family && (
              <Badge variant="outline" className="text-[10px] text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800">
                👨‍👩‍👧‍👦 {item.family.child_name || item.family.name}
              </Badge>
            )}
            {item.tags?.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-[10px] text-neutral-700 dark:text-neutral-200">
                {capitalise(typeof tag === 'object' && tag?.name ? tag.name : (typeof tag === 'string' ? tag : 'Unknown'))}
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

        <CommentsSheet
          item={item}
          open={showComments}
          onOpenChange={setShowComments}
          comments={item.comments ?? []}
          onAddComment={handleAddCommentSubmit}
        />
        {toastMessage && (
          <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
        )}


        {/* Action buttons - always visible on mobile, hover on desktop */}
        <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-r from-background/95 to-background/95 backdrop-blur-sm border-t border-border rounded-b-lg p-3 flex flex-col sm:flex-row gap-2 transition-all duration-200 sm:opacity-0 sm:group-hover:opacity-100 ${isHovered || window.innerWidth < 640 ? 'opacity-100' : ''}`}>
          <Button
            variant="default"
            size="sm"
            onClick={handleAddComment}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md hover:shadow-lg transition-all duration-200 flex-1 sm:flex-none"
          >
            <MessageCircle className="h-4 w-4" />
            <span>Tilføj Kommentar</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddFile}
            className="flex items-center justify-center gap-2 border-2 border-dashed border-orange-300 text-orange-700 bg-orange-50 hover:bg-orange-100 hover:border-orange-400 transition-all duration-200 flex-1 sm:flex-none"
          >
            <Plus className="h-4 w-4" />
            <span>Upload Fil</span>
          </Button>
        </div>
      </Card>

      <FileUploadModal
        isOpen={showFileUpload}
        onClose={() => setShowFileUpload(false)}
        eventId={item.id}
        onUploadSuccess={handleFileUploadSuccess}
      />
    </div>
  )
}
