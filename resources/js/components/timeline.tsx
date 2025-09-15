import { useState, useMemo } from "react"
import type { TimelineItem, User } from "@/lib/types"
import { sortTimelineItems, filterTimelineItems, groupItemsByDate, formatGroupDate } from "@/lib/timeline-utils"
import { TimelineItemComponent } from "./timeline-item"
import { SearchFilters } from "./search-filters"
import { TimelineControls } from "./timeline-controls"

interface TimelineProps {
  items: TimelineItem[]
  currentUser?: User
  onAddClick?: () => void
}

export function Timeline({ items = [], currentUser, onAddClick }: TimelineProps) {
  // console.log(items,'items')
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedAuthor, setSelectedAuthor] = useState<string>("")
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [dateRange, setDateRange] = useState({ start: "", end: "" })
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const [groupByDate, setGroupByDate] = useState(false)
  const [forceExpandAll, setForceExpandAll] = useState<boolean | undefined>()

  const filteredAndSortedItems = useMemo(() => {
    const filtered = filterTimelineItems(items, searchTerm, selectedAuthor, selectedCategory, dateRange)
    return sortTimelineItems(filtered)
  }, [items, searchTerm, selectedAuthor, selectedCategory, dateRange])

  const groupedItems = useMemo(() => {
    if (!groupByDate) return null
    return groupItemsByDate(filteredAndSortedItems)
  }, [filteredAndSortedItems, groupByDate])

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

  const handleItemToggle = (id: string, isExpanded: boolean) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev)
      if (isExpanded) {
        newSet.add(id)
      } else {
        newSet.delete(id)
      }
      return newSet
    })
  }

  const renderTimelineItem = (item: TimelineItem, index: number) => {
    const isLeft = item.user.role === "father"

    return (
      <div key={item.id} className="relative flex flex-col sm:block">
        {/* Timeline dot */}
        <div className="absolute left-1/2 sm:left-1/2 top-0 transform -translate-x-1/2 w-4 h-4 bg-primary rounded-full border-4 border-background z-10"></div>

        {/* Timeline item */}
        <div className={`flex flex-col sm:flex-row ${isLeft ? "sm:justify-start" : "sm:justify-end"}`}>
          <div className={`w-full sm:w-1/2 ${isLeft ? "sm:pr-8" : "sm:pl-8"}`}>
            <TimelineItemComponent
              item={item}
              isLeft={isLeft}
              forceExpanded={forceExpandAll}
              forceCollapsed={forceExpandAll === false}
              onToggle={handleItemToggle}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
  <div className="w-full max-w-6xl mx-auto px-2 sm:px-4">
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

      <TimelineControls
        totalItems={filteredAndSortedItems.length}
        expandedCount={expandedItems.size}
        onExpandAll={handleExpandAll}
        onCollapseAll={handleCollapseAll}
        groupByDate={groupByDate}
        onToggleGrouping={() => setGroupByDate(!groupByDate)}
        onAddClick={onAddClick}
      />

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
                    {dateItems.map((item, index) => renderTimelineItem(item, index))}
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="space-y-8">
            {filteredAndSortedItems.map((item, index) => renderTimelineItem(item, index))}
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
