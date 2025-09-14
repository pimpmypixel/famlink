export interface TimelineItem {
  id: string
  author: "father" | "mother" | "consultant"
  title: string
  content: string
  date: string
  timestamp: number
  category: "parenting" | "logistics" | "consultation" | "other"
  tags: string[]
  isCollapsed?: boolean
}

export interface User {
  id: string
  name: string
  role: "father" | "mother" | "consultant"
}

export interface TimelineUser {
  id: number;
  name: string;
  email: string;
}
