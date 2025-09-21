import AppLayout from '@/layouts/app-layout';
import { SharedData, type BreadcrumbItem } from '@/types';
import { Head, usePage, router } from '@inertiajs/react';
import { useState, useEffect } from "react"
import { Timeline as TimelineComponent } from "@/components/timeline/timeline"
import { AddItemModal } from "@/components/timeline/add-item-modal"
import type { User, TimelineItem } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Timeline',
    href: '/timeline',
  },
];

interface TimelineProps {
  timelineItems: TimelineItem[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    links?: {
    url: string | null;
    label: string;
    active: boolean;
  }[];
  };
}

export default function TimelinePage({ timelineItems: initialTimelineItems, pagination }: TimelineProps) {
  const { auth } = usePage<SharedData>().props;
  const [currentUser] = useState<User>({
    id: auth.user.id.toString(),
    name: auth.user.name,
    role: (auth.user.roles?.[0] as User['role']) ?? (auth.user.role as User['role']) ?? "andet", // fallback if role is missing
  })
  const [timelineItems, setTimelineItems] = useState(initialTimelineItems)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [currentPagination, setCurrentPagination] = useState(pagination)

  useEffect(() => {
    setTimelineItems(initialTimelineItems)
    setCurrentPagination(pagination)
  }, [initialTimelineItems, pagination])

  const handleAddItem = (newItemData: Omit<TimelineItem, "id" | "timestamp">) => {
    const newItem: TimelineItem = {
      ...newItemData,
      id: Date.now().toString(),
      timestamp: new Date(`${newItemData.date}T12:00:00`).getTime(),
    }

    setTimelineItems((prev) => ([...prev, newItem]))
  }

  const handlePageChange = (page: number) => {
    router.get('/timeline', { page, per_page: currentPagination.per_page }, {
      preserveState: true,
      preserveScroll: true,
    })
  }

  const handlePerPageChange = (perPage: string) => {
    router.get('/timeline', { page: 1, per_page: parseInt(perPage) }, {
      preserveState: true,
      preserveScroll: true,
    })
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Timeline" />
      <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4 scale-100 md:scale-[0.8] origin-top">
        {/* Comprehensive Pagination Controls */}
        <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Left side - Results info */}
            <div className="flex flex-col sm:flex-row items-center gap-2 text-sm text-muted-foreground">
              <span className="font-medium">
                Viser {currentPagination.from || 0} til {currentPagination.to || 0} af {currentPagination.total} sagsindlæg
              </span>
              <div className="flex items-center gap-2">
                <span>Pr. side:</span>
                <Select value={currentPagination.per_page.toString()} onValueChange={handlePerPageChange}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Right side - Pagination controls */}
            <div className="flex items-center gap-2">
              {/* First page */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(1)}
                disabled={currentPagination.current_page === 1}
                className="hidden sm:flex"
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>

              {/* Previous page */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPagination.current_page - 1)}
                disabled={currentPagination.current_page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden sm:inline ml-1">Forrige</span>
              </Button>

              {/* Page numbers */}
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, currentPagination.last_page) }, (_, i) => {
                  const pageNumber = Math.max(1, Math.min(currentPagination.last_page - 4, currentPagination.current_page - 2)) + i
                  if (pageNumber > currentPagination.last_page) return null

                  return (
                    <Button
                      key={pageNumber}
                      variant={pageNumber === currentPagination.current_page ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(pageNumber)}
                      className="w-10"
                    >
                      {pageNumber}
                    </Button>
                  )
                })}
              </div>

              {/* Next page */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPagination.current_page + 1)}
                disabled={currentPagination.current_page === currentPagination.last_page}
              >
                <span className="hidden sm:inline mr-1">Næste</span>
                <ChevronRight className="h-4 w-4" />
              </Button>

              {/* Last page */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPagination.last_page)}
                disabled={currentPagination.current_page === currentPagination.last_page}
                className="hidden sm:flex"
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <TimelineComponent
          items={timelineItems}
          user={currentUser}
          onAddClick={() => setIsAddModalOpen(true)}
          onAddFile={(itemId) => {
            // This will be handled by the TimelineItemComponent's FileUploadModal
            console.log('Add file for item:', itemId)
          }}
        />

        <AddItemModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAddItem}
          currentUser={currentUser}
        />
      </div>
    </AppLayout>
  )
}
