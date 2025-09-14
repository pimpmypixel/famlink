import { useState, useEffect } from "react"
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

export function TimelineItemComponent({ item, isLeft, forceExpanded, forceCollapsed, onToggle, onAddComment, onAddFile }: TimelineItemProps) {
  const [isExpanded, setIsExpanded] = useState(!item.isCollapsed)
  const [isHovered, setIsHovered] = useState(false)

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
    <div className={`flex w-full ${isLeft ? "justify-start pr-8" : "justify-end pl-8"}`}>
      <Card
        className={`w-full max-w-md border-2 ${authorColorClass} relative transition-all duration-200`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={categoryColorClass}>
                {capitalise(item.category)}
              </Badge>
              <span className="text-xs text-muted-foreground">{item.user.name}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleToggle} className="h-6 w-6 p-0">
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
          <CardTitle className="text-lg underline">{item.title}</CardTitle>
          <p className="text-sm text-muted-foreground">{formatDate(item.timestamp)}</p>
        </CardHeader>

        {isExpanded && (
          <CardContent className="pt-0">
            <p className="text-sm mb-3 leading-relaxed">{item.content}</p>
            <div className="flex flex-wrap gap-1">
              {item.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-[10px]">
                  {capitalise(tag)}
                </Badge>
              ))}
            </div>
          </CardContent>
        )}

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
              Add Comment
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleAddFile}
              className="h-8 px-3 text-xs hover:bg-accent"
            >
              <Paperclip className="h-3 w-3 mr-1" />
              Add File
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}
