import type { TimelineItem, User } from "./types"

export const mockUsers: User[] = [
  { id: "1", name: "David", role: "father" },
  { id: "2", name: "Sarah", role: "mother" },
  { id: "3", name: "Dr. Johnson", role: "consultant" },
]

export const mockTimelineData: TimelineItem[] = [
  {
    id: "1",
    author: "father",
    title: "Soccer Practice Schedule",
    content: "Emma has soccer practice every Tuesday and Thursday at 4 PM. I can handle pickup on Tuesdays.",
    date: "2024-01-15",
    timestamp: new Date("2024-01-15T10:30:00").getTime(),
    category: "logistics",
    tags: ["soccer", "schedule", "pickup"],
  },
  {
    id: "2",
    author: "mother",
    title: "Parent-Teacher Conference",
    content: "Scheduled meeting with Ms. Rodriguez for Thursday at 3 PM to discuss Emma's progress in math.",
    date: "2024-01-16",
    timestamp: new Date("2024-01-16T14:20:00").getTime(),
    category: "parenting",
    tags: ["school", "meeting", "math"],
  },
  {
    id: "3",
    author: "consultant",
    title: "Co-Parenting Session Notes",
    content:
      "Discussed communication strategies and established guidelines for consistent bedtime routines across both households.",
    date: "2024-01-18",
    timestamp: new Date("2024-01-18T16:00:00").getTime(),
    category: "consultation",
    tags: ["communication", "bedtime", "consistency"],
  },
  {
    id: "4",
    author: "father",
    title: "Medical Appointment",
    content: "Emma has a dentist appointment on Friday at 2 PM. I'll take her and send you the report.",
    date: "2024-01-20",
    timestamp: new Date("2024-01-20T09:15:00").getTime(),
    category: "logistics",
    tags: ["medical", "dentist", "appointment"],
  },
  {
    id: "5",
    author: "mother",
    title: "Behavioral Concerns",
    content:
      "Emma has been having trouble with homework completion. We should discuss strategies to help her stay focused.",
    date: "2024-01-22",
    timestamp: new Date("2024-01-22T19:30:00").getTime(),
    category: "parenting",
    tags: ["homework", "behavior", "focus"],
  },
  {
    id: "6",
    author: "consultant",
    title: "Homework Strategy Recommendations",
    content:
      "Based on our discussion, I recommend implementing a structured homework time with 15-minute breaks every 30 minutes.",
    date: "2024-01-25",
    timestamp: new Date("2024-01-25T11:00:00").getTime(),
    category: "consultation",
    tags: ["homework", "strategy", "structure"],
  },
]
