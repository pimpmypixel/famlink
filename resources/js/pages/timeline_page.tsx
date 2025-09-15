import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useState } from "react"
import { Timeline as TimelineComponent } from "@/components/timeline"
import { AddItemModal } from "@/components/add-item-modal"
import { mockUsers } from "@/lib/mock-data"
import type { User, TimelineItem } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Timeline',
    href: '/timeline',
  },
];

interface TimelineProps {
  timelineItems: { data: TimelineItem[] };
}

export default function TimelinePage({ timelineItems: initialTimelineItems }: TimelineProps) {
  const [currentUser, setCurrentUser] = useState<User>(mockUsers[0])
  const [timelineItems, setTimelineItems] = useState(initialTimelineItems)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  // console.log(timelineItems)

  const handleAddItem = (newItemData: Omit<TimelineItem, "id" | "timestamp">) => {
    const newItem: TimelineItem = {
      ...newItemData,
      id: Date.now().toString(),
      timestamp: new Date(`${newItemData.date}T12:00:00`).getTime(),
    }

    // setTimelineItems((prev) => [...prev, newItem])


    setTimelineItems((prev) => ({
      data: [...prev.data, newItem]
    }))
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Timeline" />
  <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4 scale-100 md:scale-[0.8] origin-top">
        {/* Header */}
        {/* <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2 text-balance">Tidslinje</h1> 
          <p className="text-muted-foreground text-lg">Følg forældres korrespondance med myndighederne</p>
        </div> */}

        {/* User Selector */}
        {/* <div className="flex flex-col items-center justify-between mb-8 gap-4">
          <div className="flex gap-2 p-1 bg-muted rounded-lg">
            {mockUsers.map((user) => (
              <Button
                key={user.id}
                variant={currentUser.id === user.id ? "default" : "ghost"}
                onClick={() => setCurrentUser(user)}
                className="capitalize"
              >
                {user.name} ({user.role})
              </Button>
            ))}
          </div>
        </div> */}

        {/* Timeline */}
        <TimelineComponent
          items={timelineItems}
          currentUser={currentUser}
          onAddClick={() => setIsAddModalOpen(true)}
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
