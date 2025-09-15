import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronDown, ChevronUp, Calendar, List } from "lucide-react"

interface TimelineControlsProps {
  totalItems: number
  expandedCount: number
  onExpandAll: () => void
  onCollapseAll: () => void
  groupByDate: boolean
  onToggleGrouping: () => void
}

export function TimelineControls({
  totalItems,
  expandedCount,
  onExpandAll,
  onCollapseAll,
  groupByDate,
  onToggleGrouping,
}: TimelineControlsProps) {
  return (
    <Card className="mb-6">
      <CardContent className="py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>
              Showing {totalItems} item{totalItems !== 1 ? "s" : ""}
            </span>
            <span>{expandedCount} expanded</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onToggleGrouping}
              className="flex items-center gap-2 bg-transparent"
            >
              {groupByDate ? <List className="h-4 w-4" /> : <Calendar className="h-4 w-4" />}
              {groupByDate ? "List View" : "Group by Date"}
            </Button>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={onExpandAll}
                // disabled={expandedCount === totalItems}
                className="flex items-center gap-1 bg-transparent"
              >
                <ChevronDown className="h-4 w-4" />
                Expand All
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onCollapseAll}
                // disabled={expandedCount === 0}
                className="flex items-center gap-1 bg-transparent"
              >
                <ChevronUp className="h-4 w-4" />
                Collapse All
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
