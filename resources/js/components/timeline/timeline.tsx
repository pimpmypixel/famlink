import { useState, useMemo } from "react"
import type { TimelineItem } from "@/lib/types"
import { sortTimelineItems, filterTimelineItems, groupItemsByDate, formatGroupDate } from "@/lib/timeline-utils"
import { TimelineItemComponent } from "./timeline-item"
import { SearchFilters } from "./search-filters"
import { TimelineControls } from "./timeline-controls"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface TimelineProps {
  items: TimelineItem[]
  onAddClick?: () => void
  onAddFile?: (itemId: string) => void
}

export function Timeline({ items = [], onAddClick, onAddFile }: TimelineProps) {
  // console.log(items,'items')
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedAuthor, setSelectedAuthor] = useState<string>("")
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [dateRange, setDateRange] = useState({ start: "", end: "" })
  const [groupByDate, setGroupByDate] = useState(false)
  const [forceExpandAll, setForceExpandAll] = useState<boolean | undefined>()
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false)

  const filteredAndSortedItems = useMemo(() => {
    const filtered = filterTimelineItems(items, searchTerm, selectedAuthor, selectedCategory, dateRange)
    return sortTimelineItems(filtered)
  }, [items, searchTerm, selectedAuthor, selectedCategory, dateRange])

  const groupedItems = useMemo(() => {
    if (!groupByDate) return null
    return groupItemsByDate(filteredAndSortedItems)
  }, [filteredAndSortedItems, groupByDate])

  // Calculate total files across all timeline items
  const totalFiles = useMemo(() => {
    return filteredAndSortedItems.reduce((total, item) => {
      return total + (item.attachments?.length || 0)
    }, 0)
  }, [filteredAndSortedItems])

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedAuthor("")
    setSelectedCategory("")
    setDateRange({ start: "", end: "" })
  }

  const handleExpandAll = () => {
    setForceExpandAll(true)
    // setTimeout(() => setForceExpandAll(undefined), 100)
  }

  const handleCollapseAll = () => {
    setForceExpandAll(false)
    // setTimeout(() => setForceExpandAll(undefined), 100)
  }

  const renderTimelineItem = (item: TimelineItem) => {
    const isLeft = item.user.role === "far"
    const isCenter = item.user.role === "myndighed"

    return (
      <div key={item.id} className="relative flex flex-col sm:block">
        {/* Timeline dot */}
        <div className={`absolute ${isCenter ? 'left-1/2' : 'left-1/2 sm:left-1/2'} top-0 transform -translate-x-1/2 w-4 h-4 bg-primary rounded-full border-4 border-background z-10`}></div>

        {/* Timeline item */}
        <div className={`flex flex-col sm:flex-row ${isCenter ? 'justify-center' : isLeft ? "sm:justify-start" : "sm:justify-end"}`}>
          <div className={`w-full ${isCenter ? 'sm:w-2/3 sm:max-w-2xl' : 'sm:w-1/2'} ${isCenter ? '' : isLeft ? "sm:pr-8" : "sm:pl-8"}`}>
            <TimelineItemComponent
              item={item}
              isLeft={isLeft}
              isCenter={isCenter}
              forceExpanded={forceExpandAll}
              forceCollapsed={forceExpandAll === false}
              onAddFile={onAddFile}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
  <div className="w-full max-w-6xl mx-auto px-2 sm:px-4">
      <TimelineControls
        totalItems={filteredAndSortedItems.length}
        totalFiles={totalFiles}
        onExpandAll={handleExpandAll}
        onCollapseAll={handleCollapseAll}
        groupByDate={groupByDate}
        onToggleGrouping={() => setGroupByDate(!groupByDate)}
        onAddClick={onAddClick}
        onSearchClick={() => setIsSearchModalOpen(true)}
      />

      {/* Search Modal */}
      <Dialog open={isSearchModalOpen} onOpenChange={setIsSearchModalOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Søg & Filtrer</DialogTitle>
          </DialogHeader>
          <SearchFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedAuthor={selectedAuthor}
            setSelectedAuthor={setSelectedAuthor}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            dateRange={dateRange}
            setDateRange={setDateRange}
            onClearFilters={clearFilters}
          />
        </DialogContent>
      </Dialog>

      {/* Timeline */}
      <div className="relative">
        {/* Center line */}
        <div className="hidden sm:block absolute left-1/2 transform -translate-x-1/2 w-0.5 bg-border h-full"></div>

        {groupByDate && groupedItems ? (
          <div className="space-y-12">
            {Object.entries(groupedItems)
              .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
              .map(([dateString, dateItems]) => (
                <div key={dateString} className="space-y-4">
                  {/* Date header above cards */}
                  <div className="flex justify-center mb-2">
                    <div className="bg-background px-6 py-3 rounded-2xl shadow-lg z-10 flex items-center justify-center min-w-[180px] max-w-xs border border-border">
                      <h3 className="text-base sm:text-lg font-semibold text-center text-foreground tracking-tight leading-tight whitespace-pre-line">
                        {formatGroupDate(dateString)}
                      </h3>
                    </div>
                  </div>

                  {/* Items for this date */}
                  <div className="space-y-8">
                    {dateItems.map((item) => renderTimelineItem(item))}
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="space-y-8">
            {filteredAndSortedItems.map((item) => renderTimelineItem(item))}
          </div>
        )}

        {filteredAndSortedItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Intet fundet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
