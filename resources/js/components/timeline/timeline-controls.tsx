import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronDown, ChevronUp, Calendar, List } from "lucide-react"

import { Plus, Search } from "lucide-react"


interface TimelineControlsProps {
  totalItems: number
  expandedCount: number
  onExpandAll: () => void
  onCollapseAll: () => void
  groupByDate: boolean
  onToggleGrouping: () => void
  onAddClick?: () => void
  onSearchClick?: () => void
}

export function TimelineControls({
  totalItems,
  expandedCount,
  onExpandAll,
  onCollapseAll,
  groupByDate,
  onToggleGrouping,
  onAddClick,
  onSearchClick,
}: TimelineControlsProps) {
  return (
    <Card className="mb-6">
      <CardContent className="py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-sm text-muted-foreground w-full sm:w-auto">
            {onAddClick && (
              <Button onClick={onAddClick} className="flex items-center gap-2" size="sm">
                <Plus className="h-4 w-4" />
                Tilføj
              </Button>
            )}
            {onSearchClick && (
              <Button onClick={onSearchClick} variant="outline" className="flex items-center gap-2" size="sm">
                <Search className="h-4 w-4" />
                Søg
              </Button>
            )}
            <span>
              {totalItems} sagsindlæg
            </span>
            {/* <span>{expandedCount} expanded</span> */}
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-center sm:justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={onToggleGrouping}
              className="flex items-center gap-2 bg-transparent"
            >
              {groupByDate ? <List className="h-4 w-4" /> : <Calendar className="h-4 w-4" />}
              {groupByDate ? "Listevisning" : "Grupper efter dato"}
            </Button>

            <div className="flex flex-wrap items-center gap-1 w-full sm:w-auto justify-center sm:justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={onExpandAll}
                // disabled={expandedCount === totalItems}
                className="flex items-center gap-1 bg-transparent"
              >
                <ChevronDown className="h-4 w-4" />
                Udvid Alle
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onCollapseAll}
                // disabled={expandedCount === 0}
                className="flex items-center gap-1 bg-transparent"
              >
                <ChevronUp className="h-4 w-4" />
                Fold Alle
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
