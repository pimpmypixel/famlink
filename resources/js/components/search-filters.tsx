"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Filter, X } from "lucide-react"

interface SearchFiltersProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  selectedAuthor: string
  setSelectedAuthor: (author: string) => void
  selectedCategory: string
  setSelectedCategory: (category: string) => void
  dateRange: { start: string; end: string }
  setDateRange: (range: { start: string; end: string }) => void
  onClearFilters: () => void
}

export function SearchFilters({
  searchTerm,
  setSearchTerm,
  selectedAuthor,
  setSelectedAuthor,
  selectedCategory,
  setSelectedCategory,
  dateRange,
  setDateRange,
  onClearFilters,
}: SearchFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)

  const hasActiveFilters = selectedAuthor || selectedCategory || dateRange.start || dateRange.end

  return (
    <Card className="mb-6">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search & Filter
          </CardTitle>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <Button variant="outline" size="sm" onClick={onClearFilters} className="text-xs bg-transparent">
                <X className="h-3 w-3 mr-1" />
                Clear
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={() => setShowAdvanced(!showAdvanced)}>
              <Filter className="h-4 w-4 mr-1" />
              {showAdvanced ? "Hide" : "Show"} Filters
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Search Input */}
        <div>
          <Label htmlFor="search" className="text-sm font-medium">
            Search in titles, content, and tags
          </Label>
          <Input
            id="search"
            type="text"
            placeholder="Type to search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mt-1"
          />
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t">
            <div>
              <Label htmlFor="author" className="text-sm font-medium">
                Author
              </Label>
              <select
                id="author"
                value={selectedAuthor}
                onChange={(e) => setSelectedAuthor(e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">All Authors</option>
                <option value="father">Father</option>
                <option value="mother">Mother</option>
                <option value="consultant">Consultant</option>
              </select>
            </div>

            <div>
              <Label htmlFor="category" className="text-sm font-medium">
                Category
              </Label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">All Categories</option>
                <option value="parenting">Parenting</option>
                <option value="logistics">Logistics</option>
                <option value="consultation">Consultation</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <Label htmlFor="startDate" className="text-sm font-medium">
                From Date
              </Label>
              <Input
                id="startDate"
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="endDate" className="text-sm font-medium">
                To Date
              </Label>
              <Input
                id="endDate"
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="mt-1"
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
