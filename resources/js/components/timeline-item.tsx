import { useState, useEffect } from "react"
import type { TimelineItem } from "@/lib/types"
import { getAuthorColor, getCategoryColor, formatDate } from "@/lib/timeline-utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"

interface TimelineItemProps {
  item: TimelineItem
  isLeft: boolean
  forceExpanded?: boolean
  forceCollapsed?: boolean
  onToggle?: (id: string, isExpanded: boolean) => void
}

export function TimelineItemComponent({ item, isLeft, forceExpanded, forceCollapsed, onToggle }: TimelineItemProps) {
  const [isExpanded, setIsExpanded] = useState(!item.isCollapsed)

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

  return (
    <div className={`flex w-full ${isLeft ? "justify-start pr-8" : "justify-end pl-8"}`}>
      <Card className={`w-full max-w-md border-2 ${authorColorClass}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={categoryColorClass}>
                {item.category}
              </Badge>
              <span className="text-xs text-muted-foreground">{item.user.name}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleToggle} className="h-6 w-6 p-0">
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
          <CardTitle className="text-lg">{item.title}</CardTitle>
          <p className="text-sm text-muted-foreground">{formatDate(item.timestamp)}</p>
        </CardHeader>

        {isExpanded && (
          <CardContent className="pt-0">
            <p className="text-sm mb-3 leading-relaxed">{item.content}</p>
            <div className="flex flex-wrap gap-1">
              {item.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
