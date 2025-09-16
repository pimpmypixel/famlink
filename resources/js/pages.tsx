import { useState } from "react"
import { Timeline } from "@/components/timeline"
import { AddItemModal } from "@/components/add-item-modal"
import type { User, TimelineItem } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { usePage } from "@inertiajs/react"
import { SharedData } from "./types"

export default function Home() {
  const { auth } = usePage<SharedData>().props;
  const [currentUser, setCurrentUser] = useState<User>({
    id: auth.user.id.toString(),
    name: auth.user.name,
    role: (auth.user.role as User['role']) ?? "andet", // fallback if role is missing
  })
  // const [currentUser, setCurrentUser] = useState<User>(mockUsers[0])
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const handleAddItem = (newItemData: Omit<TimelineItem, "id" | "timestamp">) => {
    const newItem: TimelineItem = {
      ...newItemData,
      id: Date.now().toString(),
      timestamp: new Date(`${newItemData.date}T12:00:00`).getTime(),
    }

    setTimelineItems((prev) => [...prev, newItem])
  }

  return (
    <main className="min-h-screen bg-background py-8">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          {/* <h1 className="text-4xl font-bold text-foreground mb-2 text-balance">Co-Parenting Timeline</h1> */}
          <p className="text-muted-foreground text-lg">Track parenting updates, logistics, and consultations</p>
        </div>

        {/* User Selector and Add Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
          {/* User selector removed - no mock data available */}
          {/* <div className="flex gap-2 p-1 bg-muted rounded-lg">
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
          </div> */}

          <Button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add New Item
          </Button>
        </div>

        {/* Timeline */}
        <Timeline items={timelineItems} currentUser={currentUser} />

        <AddItemModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAddItem}
          currentUser={currentUser}
        />
      </div>
    </main>
  )
}