import { useState, useEffect } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet";
import React, { Dispatch, SetStateAction } from "react";
import type { TimelineItem } from "@/lib/types"
import { getAuthorColor, getCategoryColor, formatDate } from "@/lib/timeline-utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, MessageCircle, Paperclip } from "lucide-react"
import { capitalise } from "@/lib/utils"

interface TimelineItemProps {
  item: TimelineItem
  isLeft: boolean
  forceExpanded?: boolean
  forceCollapsed?: boolean
  onToggle?: (id: string, isExpanded: boolean) => void
  onAddComment?: (itemId: string) => void
  onAddFile?: (itemId: string) => void
}
import { CommentsSheet } from "@/components/comments-sheet";

export function TimelineItemComponent({
  item,
  isLeft,
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

  useEffect(() => {
    if (forceExpanded !== undefined) {
      setIsExpanded(forceExpanded)
    } else if (forceCollapsed !== undefined) {
      setIsExpanded(!forceCollapsed)
    }
  }, [forceExpanded, forceCollapsed])

  const authorColorClass = getAuthorColor(item.user.name)
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
    onAddFile?.(item.id)
  }

  return (
    <div className={`flex w-full ${isLeft ? "justify-start sm:pr-8" : "justify-end sm:pl-8"}`}>
      <Card
        className={`w-full max-w-md sm:max-w-md max-w-full border-2 ${authorColorClass} relative transition-all duration-200`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardHeader className="pb-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={categoryColorClass}>
                {capitalise(item.category)}
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
            <span className="px-2 py-0.5 border border-current rounded-md mr-1 inline-block align-middle">
              {item.user.role ?? 'N/A'}
            </span>
            - {formatDate(item.timestamp)}
          </p>
          <div className="flex flex-wrap gap-1">
            {item.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-[10px] text-neutral-700 dark:text-neutral-200">
                {capitalise(tag)}
              </Badge>
            ))}
          </div>
        </CardHeader>

        {isExpanded && (
          <CardContent className="pb-4">
            <p className="text-sm mb-3 leading-relaxed">{item.content}</p>
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
    </div>
  )
}
