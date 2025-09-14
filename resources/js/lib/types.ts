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
  role: string;
}
