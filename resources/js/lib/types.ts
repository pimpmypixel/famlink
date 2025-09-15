export interface TimelineItem {
  id: string
  title: string
  content: string
  date: string
  timestamp: number
  category: string
  tags: string[]
  user: TimelineUser
  isCollapsed?: boolean
  comments?: { id: string; content: string; user: TimelineUser; created_at?: string }[]
}

export interface User {
  id: string
  name: string
  role: "far" | "mor" | "myndighed" | "andet"
}

export interface TimelineUser {
  id: number;
  name: string;
  email: string;
  role: string;
}
